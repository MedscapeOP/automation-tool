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

let credentialRegexArray = function () {
    var result = [];
    for (var i = 0; i < config.credentials.length; i++) {
        result.push(new RegExp(`(.*${config.credentials[i]}</p>)`, 'g'));
        result.push(new RegExp(`(.*${config.credentials[i]}</strong></p>)`, 'g'));
    }
    return result;
}();

let disclosureRegexArray = [
    /(<p>Disclosure:.*)/gi,
    /(Disclosure:.*)/gi
];

let titleRegexArray = [
    /.*Co-Moderator.*/gi,
    /.*Moderator.*/gi,
    /.*Faculty.*/gi,
    /.*Panelist.*/gi 
];


function getNextRegex(ticketHTML, regexArray) {
    var options = [];
    var nextCredential = null;
    for (var i = 0; i < regexArray.length; i++) {
        nextCredential = {
            index: ticketHTML.search(regexArray[i]),
            symbol: regexArray[i],
            isInString: function () {
                return this.index != -1;
            }
        };
        options.push(nextCredential);
    }

    // remove all options not found in string
    _.pullAllBy(options, [{index: -1}], 'index');

    var minimum = undefined;
    for (var i = 0; i < options.length; i++) {
        if (!minimum) {
            minimum = options[i];
        } else {
            minimum = (minimum.index > options[i].index ? options[i] : minimum);
        }
    }
    if (minimum) {
        return minimum;
    } else {
        return -1;
    }
}

function buildContributors(ticketHTML) {
    var contributors = [];
    var contributor = null;
    var disclosureStartRegExp = /(<p>Disclosure:.*)/gi; 
    var name, affiliations, disclosure;

    var contribNameRegExp = getNextRegex(ticketHTML, credentialRegexArray);
    var titleRegExp = getNextRegex(ticketHTML, titleRegexArray);
    var newTitle = null;
    var title = "";
    var previousTitle = "";
    while (contribNameRegExp != -1) {
        // console.log("CREDENTIAL: ", contribNameRegExp);
        // console.log("TITLE: ", titleRegExp);
        if (titleRegExp != -1) {
            if (titleRegExp.index < contribNameRegExp.index) {
                newTitle = true;
                title = ticketHTML.match(titleRegExp.symbol)[0];
                console.log("TITLE: ", title);
                ticketHTML = ticketHTML.substring(titleRegExp.index + 4);
            } else {
                newTitle = false;
                title = previousTitle;
            }
        } 
        // console.log("CONTRIB NAME REGEXP: ", contribNameRegExp);
        if (!(contribNameRegExp instanceof RegExp)) {
            contribNameRegExp = contribNameRegExp.symbol;
        }
        name = ticketHTML.match(contribNameRegExp)[0];
        affiliations = stringOps.getTextBlock(ticketHTML, new RegExp(name, 'g'), disclosureStartRegExp);
        var affiliationsText = cleanHTML.onlyParagraphTags(affiliations.textBlock);
        
        // Chop off beginning of ticket;
        ticketHTML = ticketHTML.substring(affiliations.endIndex);

        // Get next contributor name regex
        contribNameRegExp = getNextRegex(ticketHTML, credentialRegexArray);
        // console.log("CONTRIB NAME REGEXP 2: ", contribNameRegExp);

        // Get next title regex 
        titleRegExp = getNextRegex(ticketHTML, titleRegexArray);

        // If there is another contributor
        var disclosureText = "";
        if (contribNameRegExp != -1) {
            contribNameRegExp = contribNameRegExp.symbol;
            // Get Disclosure textblock 
            disclosure = stringOps.getTextBlock(ticketHTML, disclosureStartRegExp, contribNameRegExp, false, false);
            disclosureText = disclosure.textBlock;
            ticketHTML = ticketHTML.substring(disclosure.endIndex);
        } else {
            var index = stringOps.regexIndexOf(ticketHTML, disclosureStartRegExp);
            disclosureText = ticketHTML.substring(index);
            ticketHTML = "";
        } 
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
    return "";
}


// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
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

    // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
    // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);
    return buildContributors(contributorBlock);
    // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
}

module.exports = exportObject;