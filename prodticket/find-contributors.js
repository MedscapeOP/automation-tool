const _ = require('lodash');
const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

function Contributor(title, name, affiliation, disclosure) {
    return {
        title, 
        name,
        affiliation,
        disclosure
    }
}

let disclosureRegexArray = [
    /(<p>Disclosure:.*)/gi,
    /(Disclosure:.*)/gi
];

let titleRegexArray = [
    /.*Co-Moderator.*/gi,
    /.*Moderator.*/gi,
    /.*Faculty.*/gi,
    /.*Panelist.*/gi,
    /.*Anticoagulation Management Steering Committee.*/gi,
    /.*Vascular Protection Steering Committee.*/gi, 
    /.*Steering Committee.*/gi
];

function buildContributors(ticketHTML) {
    var contributors = [];
    var contributor = null;
    var disclosureStartRegExp = /(<p>Disclosure:.*)/gi; 
    var name, affiliations, disclosure;

    var contribNameRegExp = stringOps.getNextRegex(ticketHTML, config.credentials.credentialRegexArray);
    var titleRegExp = stringOps.getNextRegex(ticketHTML, titleRegexArray);
    var title = "";
    var previousTitle = "";
    var previousTitleSymbol = null;
    while (contribNameRegExp != -1) {
        if (titleRegExp != -1) {
            if ((previousTitleSymbol == titleRegExp.symbol) && (titleRegExp.index < contribNameRegExp.index)) {
                title = previousTitle;
            }
            else if (titleRegExp.index < contribNameRegExp.index) {
                title = ticketHTML.match(titleRegExp.symbol)[0];
                previousTitle = title;
                previousTitleSymbol = titleRegExp.symbol;
            } else {
                title = previousTitle;
            }
        } 

        if (!(contribNameRegExp instanceof RegExp)) {
            contribNameRegExp = contribNameRegExp.symbol;
        }
        // ***** DEBUGGING ***** 
        // if (ticketHTML.match(contribNameRegExp) == null) {
        //     console.log("CONTRIB NAME REGEXP: ", (contribNameRegExp));
        //     console.log("TICKET AT NULL: ", ticketHTML);
        // }
        console.log("CONTRIB NAME REGEXP: ", ticketHTML.match(contribNameRegExp));
        name = ticketHTML.match(contribNameRegExp)[0];
        affiliations = stringOps.getTextBlock(ticketHTML, new RegExp(RegExp.escape(name), 'g'), disclosureStartRegExp);
        // ***** DEBUGGING *****
        // if (affiliations.startIndex == -1) {
        //     console.log("AFFILIATION NAME: ", name);
        //     console.log("TICKET AFFILIATION: ", ticketHTML);
        // }
        var affiliationsText = cleanHTML.onlyParagraphTags(affiliations.textBlock);
        
        // Chop off beginning of ticket;
        ticketHTML = ticketHTML.substring(affiliations.endIndex);

        // Get next contributor name regex
        contribNameRegExp = stringOps.getNextRegex(ticketHTML, config.credentials.credentialRegexArray);
        // console.log("CONTRIB NAME REGEXP 2: ", contribNameRegExp);

        // Get next title regex 
        titleRegExp = stringOps.getNextRegex(ticketHTML, titleRegexArray);

        // If there is another contributor
        var disclosureText = "";
        if (titleRegExp != -1) {
            // Get Disclosure textblock 
            disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, titleRegExp.symbol, false, false);
            disclosureText = disclosure.textBlock;
            ticketHTML = ticketHTML.substring(disclosure.endIndex);
        }
        else if (contribNameRegExp != -1) {
            // Get Disclosure textblock 
            disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, contribNameRegExp.symbol, false, false);
            disclosureText = disclosure.textBlock;
            ticketHTML = ticketHTML.substring(disclosure.endIndex);
        } else {
            var index = stringOps.regexIndexOf(ticketHTML, disclosureStartRegExp);
            disclosureText = ticketHTML.substring(index);
            ticketHTML = "";
        } 
        title = cleanHTML.insertEntityPlaceholders(title);
        name = cleanHTML.insertEntityPlaceholders(name);
        affiliationsText = cleanHTML.insertEntityPlaceholders(affiliationsText);
        disclosureText = cleanHTML.insertEntityPlaceholders(disclosureText);

        disclosureText = cleanHTML.onlyParagraphTags(disclosureText);       
        contributor = {
            title: cleanHTML.plainText(title),
            name: cleanHTML.plainText(name), 
            affiliation: cleanHTML.contributorAffiliations(affiliationsText), 
            disclosure: cleanHTML.contributorDisclosures(disclosureText)
        };
        contributors.push(contributor);
    }

    return contributors;
}

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    return ``;
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock: disclosureBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Disclosures", '<strong>Additional Planners/Reviewers', true, true);

    var {textBlock: contributorBlock} = stringOps.getTextBlock(disclosureBlock, /<table border=".*/g, /<\/table>/g, true, false);

    if (stringOps.isBlankOrWhiteSpace(contributorBlock) || stringOps.isEmptyString(contributorBlock) || contributorBlock.length < 10) {
        throw new Error("No contributors found in the Speakers section of the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);
        return buildContributors(contributorBlock);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}


// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Video Lecture 
exportObject[config.programs.videoLecture.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock: speakerBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Speakers", '<strong>Program Details', true, true);

    var {textBlock: contributorBlock} = stringOps.getTextBlock(speakerBlock, "Disclosure: Clyde W. Yancy, MD, MSc, has disclosed the following relevant financial relationships:</p>", "<strong>Program Details", true, false);

    if (stringOps.isBlankOrWhiteSpace(contributorBlock) || stringOps.isEmptyString(contributorBlock) || contributorBlock.length < 10) {
        throw new Error("No contributors found in the Speakers section of the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);
        return buildContributors(contributorBlock);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}

module.exports = exportObject;