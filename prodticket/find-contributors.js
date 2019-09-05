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
    /<p>Faculty<\/p>/gi,
    /<strong>Faculty<\/strong>/gi,
    /<strong>\s+Faculty\s+<\/strong>/gi,
    /.*Panelist.*/gi,
    /.*Anticoagulation Management Steering Committee.*/gi,
    /.*Vascular Protection Steering Committee.*/gi,
    /.*<strong>Steering Committee<\/strong>.*/gi,
    /.*<strong>\s+Steering Committee\s+<\/strong>.*/gi
];
/* TODO: Look into why anticoag regex isn't working. */

function buildContributors(ticketHTML) {
    var contributors = [];
    var contributor = null;
    var disclosureStartRegExp = /(<p>Disclosure:.*)/gi; 
    var name, affiliations, disclosure;

    var contribNameRegExp = stringOps.getNextRegex(ticketHTML, config.credentials.credentialRegexArray);
    var titleRegExp = stringOps.getNextRegex(ticketHTML, titleRegexArray);
    var testSubstring = "";
    var titleRegExp2 = null;
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
        name = ticketHTML.match(contribNameRegExp)[0];

        affiliations = stringOps.getTextBlock(ticketHTML, new RegExp(RegExp.escape(name), 'g'), disclosureStartRegExp);
        // ***** DEBUGGING *****
        // if (affiliations.startIndex == -1) {
        //     console.log("AFFILIATION NAME: ", name);
        //     console.log("TICKET AFFILIATION: ", ticketHTML);
        // }
        // console.log("AFFILIATIONS: ", affiliations);

        var affiliationsText = cleanHTML.onlyParagraphTags(affiliations.textBlock);
        
        // Chop off beginning of ticket;
        ticketHTML = ticketHTML.substring(affiliations.endIndex);

        // console.log("TICKET HTML: ", ticketHTML);

        // Get next contributor name regex
        contribNameRegExp = stringOps.getNextRegex(ticketHTML, config.credentials.credentialRegexArray);
        // console.log("CONTRIB NAME REGEXP 2: ", contribNameRegExp);

        // Get next title regex 
        titleRegExp = stringOps.getNextRegex(ticketHTML, titleRegexArray);
        // console.log("TITLE REGEXP: ", titleRegExp);

        // If there is another contributor
        var disclosureText = "";

        if ((titleRegExp != -1) && (contribNameRegExp != -1)) {
            /* 
                If Title is before contrib name 
                    get the textblock from the next disclosure statement up until the next title 
                If the Contrib name is before the next title 
                    get the textblock from the next disclosure statement up until the next contrib name
            */
            testSubstring = ticketHTML.substring(titleRegExp.index + 20);
            titleRegExp2 = stringOps.getNextRegex(testSubstring, titleRegexArray);
            var titleCutoffRegExp = titleRegExp;
            if (titleRegExp2 != -1) {
                // Handle case where there are two valid titles back to back. 
                // In this case we want to use the second title (ignoring the first)
                // get index of regex2 in ticket 
                // compare that index with contribNameRegExp.index
                // If it is less than (comes before) -> titleRegExp = titleRegExp2;
                // console.log("COMMITTEE INDEX: ", stringOps.regexIndexOf(ticketHTML, /.*Anticoagulation Management Steering Committee.*/gi));
                var regexIndex = stringOps.regexIndexOf(ticketHTML, titleRegExp2.symbol, titleRegExp.index + 1);
                // console.log("REGEX INDEX: ", regexIndex);                    
                // console.log("TITLE 1: ", titleRegExp);
                // console.log("TITLE 2: ", titleRegExp2);
                // console.log("CONTRIB NAME REGEXP: ", contribNameRegExp);
                if (regexIndex < contribNameRegExp.index) {
                    // ticketHTML = ticketHTML.replace(titleRegExp.symbol, "");
                    titleRegExp = titleRegExp2;
                    // ticketHTML = ticketHTML.substring(regexIndex);
                }
            }
            if (titleRegExp.index < contribNameRegExp.index) {
                disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, titleCutoffRegExp.symbol, false, false);
                disclosureText = disclosure.textBlock;
                // console.log("DISCLOSURE BLOCK: ", disclosureText);
                ticketHTML = ticketHTML.substring(disclosure.endIndex);
            } else {
                // Get Disclosure textblock 
                disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, contribNameRegExp.symbol, false, false);
                disclosureText = disclosure.textBlock;
                ticketHTML = ticketHTML.substring(disclosure.endIndex);
            }
        } else if (titleRegExp != -1) {
            // Get Disclosure textblock
            /* 
                TITLE IS NEXT: get the textblock from the next disclosure statement up until the next title            
            */ 
            disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, titleRegExp.symbol, false, false);
            disclosureText = disclosure.textBlock;
            ticketHTML = ticketHTML.substring(disclosure.endIndex);
        } else if (contribNameRegExp != -1) {
            // Get Disclosure textblock 
            /* 
                NO TITLES CONTRIB IS NEXT: get the textblock from the next disclosure statement up until the next title            
            */ 
            disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, contribNameRegExp.symbol, false, false);
            disclosureText = disclosure.textBlock;
            ticketHTML = ticketHTML.substring(disclosure.endIndex);
        } else {
            /* 
                NO MORE CONTRIBUTORS: just get the current disclosure  
            */
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
    var {textBlock: disclosureBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Disclosures", '<strong>SD/Editor/Writer', true, true);
    // console.log("CONTRIBUTOR BLOCK 1: \n\n", disclosureBlock);

    var {textBlock: contributorBlock} = stringOps.getTextBlock(disclosureBlock, /<table border=".*/g, /<\/table>/g, true, false);
    // console.log("CONTRIBUTOR BLOCK 2: \n\n", contributorBlock);
    if (stringOps.isBlankOrWhiteSpace(contributorBlock) || stringOps.isEmptyString(contributorBlock) || contributorBlock.length < 10) {
        throw new Error("No contributors found in the Speakers section of the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);

        contributorBlock = cleanHTML.contributorFluff(contributorBlock);
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

// Town Hall Enduring 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var {textBlock: speakerBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Speakers", '<strong>Program Details', true, true);

    var {textBlock: contributorBlock} = stringOps.getTextBlock(speakerBlock, "Disclosure: Clyde W. Yancy, MD, MSc, has disclosed the following relevant financial relationships:</p>", "<strong>Program Details", true, false);

    if (stringOps.isBlankOrWhiteSpace(contributorBlock) || stringOps.isEmptyString(contributorBlock) || contributorBlock.length < 10) {
        throw new Error("No contributors found in the Speakers section of the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);
        contributorBlock = cleanHTML.contributorFluff(contributorBlock);
        return buildContributors(contributorBlock);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}

// Test and Teach 
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML , program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}


module.exports = exportObject;