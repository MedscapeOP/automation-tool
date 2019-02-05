const _ = require('lodash');
const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');


let disclosureRegexArray = [
    /(<p>Disclosure:.*)/gi,
    /(Disclosure:.*)/gi
];

let titleRegexArray = [
    /.*Editor\/CME Reviewer\/Nurse Planner.*/gi,
    /.*CE Reviewer \/ Nurse Planner.*/gi,
    /.*CME Author.*/gi,
    /.*CME Reviewer.*/gi,
    /.*Content Reviewer.*/gi,
    /.*Nurse Planner.*/gi,
    /.*CE Reviewer.*/gi
];

function buildCMEReviewers(ticketHTML) {
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
    /* 
        Take the text block 
        - Find the First Title
        - Find the Next Title 
        - If Next Title   
            - Select the block of text from the First Title to the Next title 
            - Search the block For the ContribNames 
            - For each contrib name 
                - Find the corresponding Contrib in the config object
                - Clone that object and update the clone to have the proper title.
        - Else (no next title)
            - Search the block For the ContribNames 
                - For each contrib name 
                    - Find the corresponding Contrib in the config object
                    - Clone that object and update the clone to have the proper title.
    */

    return ticketHTML;
    // return contributors;
}

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    return ``;
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock: additionalReviewerBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Additional Planners/Reviewers", '<strong>References', true, true);

    var peerReviewIndex = stringOps.regexIndexOf(additionalReviewerBlock, /Peer Reviewer/g);

    var endRegExp = /<\/table>/g; 
    if (peerReviewIndex != -1) {
        endRegExp = /Peer Reviewer/g;
    }

    var {textBlock: cmeReviewerBlock} = stringOps.getTextBlock(additionalReviewerBlock, /<table border=".*/g, endRegExp, true, false);
    
    if (stringOps.isBlankOrWhiteSpace(cmeReviewerBlock) || stringOps.isEmptyString(cmeReviewerBlock) || cmeReviewerBlock.length < 10) {
        throw new Error("No CME reviewers found in the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);

        cmeReviewerBlock = cleanHTML.contributorFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock);
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
        contributorBlock = cleanHTML.contributorFluff(contributorBlock);
        return buildContributors(contributorBlock);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}

module.exports = exportObject;