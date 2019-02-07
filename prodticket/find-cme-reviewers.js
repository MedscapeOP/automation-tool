const _ = require('lodash');
const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');


let cmeReviewers = config.cmeAuthors;

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


/* 

OLD ALGO 
    - Take the text block and program as params
    - use the program to set the proper CME object info from the config.   
    - Find the First Title in the text block 
    --- LOOP while (title) ---
        - Find the Next Title 
        - If Next Title   
            - Select the block of text from the First Title to the Next title
                - Take the substring from first title to the next title 
            - Search the substring For the ContribNames 
                - Loop through the cmeReviewers object 
                - var index = substring.search(new RegExp(reviewer.name)); 
                - if (index -1)
                    - continue 
                - else 
                    - Update the reviewer.title property with the current title symbol.              
        - Else (no next title)
            - Search the substring For the ContribNames 
                - Same as algorithm above
        - title = nextTitle

NEW ALGO: 
    - Take the text block in as param 
    - Create a utility function that returns an array of all of the titles 
    - loop through the array of titles
        - if the title index + 1 != array.length
            - grab title 1, grab title 2 
            - get a textblock between title 1 and 2 
                - Search the substring For the ContribNames 
                    - Loop through the cmeReviewers object 
                    - var index = substring.search(new RegExp(reviewer.name)); 
                    - if (index -1)
                        - continue 
                    - else 
                        - Update the reviewer.title property with the current title symbol.   
        - if the title index + 1 == array.length
            - Just use the title to the end as the block 

*/
function buildCMEReviewers(cmeReviewerBlock, program) {
    var reviewersResult = [];

    if (program.hasOUS) {
        var reviewersArray = cmeReviewers.ous;
    } else {
        var reviewersArray = cmeReviewers.usAndGlobal;
    }

    // Get the first title. 
    var title = stringOps.getNextRegex(cmeReviewerBlock, titleRegexArray);
    var nextTitle = null;
    var testSubstring = "";
    while (title != -1) {
        // Find the Next Title  
        testSubstring = cmeReviewerBlock.substring(title.index + 10);
        nextTitle = stringOps.getNextRegex(testSubstring, titleRegexArray);
        // console.log("TEST SUBSTRING 1: ", testSubstring);
        
        // If Next Title  
        if (nextTitle != -1) {
            console.log("CME REVIEWER BLOCK: ", cmeReviewerBlock);
            nextTitle.index = stringOps.regexIndexOf(cmeReviewerBlock, nextTitle.symbol);
            console.log("TITLE SYMBOL: ", title.symbol);
            console.log("TITLE INDEX: ", title.index);
            console.log("NEXT TITLE SYMBOL: ", nextTitle.symbol);
            console.log("NEXT TITLE INDEX: ", nextTitle.index);

            // Substring should be block of text from the First Title to the Next title
            testSubstring = cmeReviewerBlock.substring(title.index, nextTitle.index);
            // Cut off the beginning of the block 
            // Block should start where the next title begins  
            cmeReviewerBlock = cmeReviewerBlock.substring(nextTitle.index); stringOps.getTextBlock(cmeReviewerBlock, )
            // console.log("TEST SUBSTRING 2 A: ", testSubstring);
        } else {
            // otherwise just make substring be the remainder of the block 
            testSubstring = cmeReviewerBlock;
            // console.log("TEST SUBSTRING 2 B: ", testSubstring);
        }
        // Search the substring For the ContribNames
        var index = -1;
        var reviewer = null;
        var nameRegExp = null; 
        for (var i = 0; i < reviewersArray.length; i++) {
            reviewer = reviewersArray[i];
            // console.log("name regexp: ", nameRegExp);
            console.log("TEST SUBSTRING 3: ", testSubstring);
            console.log("REVIEWER: ", reviewer);
            index = testSubstring.indexOf(reviewer.name);
            if (index != -1) {
                // If there is an index then the contributor should now be associated with the current title 
                // Update the reviewer.title property with the current title symbol. 
                console.log("TITLE SYMBOL: ", title.symbol);
                console.log("REVIEWER MATCH: ", testSubstring.match(title.symbol));
                reviewer.title = testSubstring.match(title.symbol)[0];
                reviewersResult.push(reviewer);
            }
        } 
        title = nextTitle;
    }
    return reviewersResult;    
}

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML, program) {
    var {textBlock: cmeReviewerBlock} = stringOps.getTextBlock(ticketHTML, "CME Author", "CME ID#</strong>", false, false);
    if (stringOps.isBlankOrWhiteSpace(cmeReviewerBlock) || stringOps.isEmptyString(cmeReviewerBlock) || cmeReviewerBlock.length < 10) {
        throw new Error("No CME reviewers found in the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);

        cmeReviewerBlock = cleanHTML.cmeReviewerFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock, program);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML, program) {
    var {textBlock: additionalReviewerBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Additional Planners/Reviewers", '<strong>References', true, true);

    var peerReviewIndex = stringOps.regexIndexOf(additionalReviewerBlock, /Peer Reviewer/g);

    var endRegExp = /<\/table>/g; 
    if (peerReviewIndex != -1) {
        endRegExp = /Peer Reviewer/g;
    }

    var {textBlock: cmeReviewerBlock} = stringOps.getTextBlock(additionalReviewerBlock, /<table border=".*/g, endRegExp, true, false);
    
    // console.log("CME REVIEWER BLOCK: ", cmeReviewerBlock); --> OKAY 

    if (stringOps.isBlankOrWhiteSpace(cmeReviewerBlock) || stringOps.isEmptyString(cmeReviewerBlock) || cmeReviewerBlock.length < 10) {
        throw new Error("No CME reviewers found in the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);

        cmeReviewerBlock = cleanHTML.cmeReviewerFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock, program);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}


// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML , program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}

// Video Lecture 
exportObject[config.programs.videoLecture.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}

// Town Hall
exportObject[config.programs.townHall.codeName] = function (ticketHTML, program) {
    var {textBlock: additionalReviewerBlock} = stringOps.getTextBlock(ticketHTML, "</a>Additional Planners/Reviewers Information and Disclosure Statements", '</a>Related links', false, true);

    var peerReviewIndex = stringOps.regexIndexOf(additionalReviewerBlock, /Peer Reviewer/g);

    var endRegExp = /<\/a>Related links/g; 
    if (peerReviewIndex != -1) {
        endRegExp = /Peer Reviewer/g;
    }

    var {textBlock: cmeReviewerBlock} = stringOps.getTextBlock(additionalReviewerBlock, /<\/a>Additional Planners\/Reviewers Information and Disclosure Statements/g, endRegExp, true, false);
    
    if (stringOps.isBlankOrWhiteSpace(cmeReviewerBlock) || stringOps.isEmptyString(cmeReviewerBlock) || cmeReviewerBlock.length < 10) {
        throw new Error("No CME reviewers found in the prodticket");
    } else {
        // console.log("CONTRIBUTOR BLOCK: ", contributorBlock);
        // return JSON.stringify(buildContributors(contributorBlock), undefined, 2);

        cmeReviewerBlock = cleanHTML.cmeReviewerFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock, program);
        // return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
    }
}

module.exports = exportObject;