const _ = require('lodash');
const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');


let cmeReviewers = config.cmeAuthors;

let disclosureRegexArray = [
    /(<p>Disclosure:.*)/gi,
    /(Disclosure:.*)/gi
];

let titleRegexArray = [
    /<strong>Editor\/CME Reviewer\/Nurse Planner.*/gi,
    /<strong>CE Reviewer \/ Nurse Planner.*/gi,
    /<strong>CME Author.*/gi,
    /<strong>CME Reviewer.*/gi,
    /<strong>Content Reviewer.*/gi,
    /<strong>CME\/Content Reviewer/gi,
    /<strong>Nurse Planner.*/gi,
    /<strong>CE Reviewer.*/gi,
    /<p>Editor\/CME Reviewer\/Nurse Planner.*/gi,
    /<p>CE Reviewer \/ Nurse Planner.*/gi,
    /<p>CME Author.*/gi,
    /<p>CME Reviewer.*/gi,
    /<p>Content Reviewer.*/gi,
    /<p>CME\/Content Reviewer/gi,
    /<p>Nurse Planner.*/gi,
    /<p>CE Reviewer.*/gi,
    /<\/a>Editor\/CME Reviewer\/Nurse Planner.*/gi,
    /<\/a>CE Reviewer \/ Nurse Planner.*/gi,
    /<\/a>CME Author.*/gi,
    /<\/a>CME Reviewer.*/gi,
    /<\/a>Content Reviewer.*/gi,
    /<\/a>CME\/Content Reviewer/gi,
    /<\/a>Nurse Planner.*/gi,
    /<\/a>CE Reviewer.*/gi,
    /.*Editor\/CME Reviewer\/Nurse Planner.*/gi,
    /.*CE Reviewer \/ Nurse Planner.*/gi
];


// function getAllMatchesInOrder(textBlock, regexArray)  {
//     // Create a utility function that returns an array of all of the titles
//     var resultArray = [];
//     var substring = textBlock.slice();
//     var foundMatch = null;
//     var searchStartIndex = 0;
//     var matchLength = 0;
//     while (substring) {
//         // console.log("SUBSTRING: ", substring);
//         foundMatch = stringOps.getNextRegex(substring, regexArray);        
//         // console.log("FOUND MATCH: ", foundMatch);
//         if (!foundMatch.isInString) {
//             substring = null;
//         } else {
//             matchLength = substring.match(foundMatch.symbol)[0].length;
//             searchStartIndex = (textBlock.length - substring.length) + foundMatch.index + matchLength; // foundMatch.symbol.toString().length + 1;    
//             substring = textBlock.substring(searchStartIndex);
//             resultArray.push({
//                 symbol: foundMatch.symbol,
//                 index: searchStartIndex - matchLength
//             });
//             // console.log("INDEX CHOP: ", textBlock.substring(searchStartIndex, searchStartIndex + 20));
//             // console.log("INDEX CHOP: ", textBlock.substring(39, 261));
//         }
//     }
//     return resultArray;
// }

function buildCMEReviewers(cmeReviewerBlock, program) {
    var reviewersResult = [];
    
    if (program.hasOUS) {
        var reviewersArray = cmeReviewers.ous;
    } else {
        var reviewersArray = cmeReviewers.usAndGlobal;
    }

    // Get the first title. 
    var title = null;
    var nextTitle = null;
    var testSubstring = "";
    // Search the substring For the ContribNames
    var index = 0;
    var reviewer = null;
    var nameRegExp = null; 

    /*
    - Take the text block in as param 
    - Create a utility function that returns an array of all of the titles - DONE
    */
    var titleMatchArray = stringOps.getAllMatchesInOrder(cmeReviewerBlock, titleRegexArray);

    // Loop through the array of titleMatches 
    for (var i = 0; i < titleMatchArray.length; i++) {
        title = titleMatchArray[i];
        /* 
        - if the title index + 1 !> array.length
            - set title 2 
            - get a textblock between title 1 and 2 
        */
        if ((i + 1) <= titleMatchArray.length - 1) {
            nextTitle = titleMatchArray[i + 1];
            // console.log("NEXT TITLE: ", nextTitle);
            testSubstring = cmeReviewerBlock.substring(title.index, nextTitle.index);
        } else {
            /* 
            - Otherwise 
            - get remainder of textblock starting at title index 
            */
            nextTitle = null;
            testSubstring = cmeReviewerBlock.substring(title.index);
            // console.log("TITLE: ", title);
            // console.log("TEST SUBSTRING: ", testSubstring);
        }
        /* 
        - Search the substring For the ContribNames 
            - Loop through the cmeReviewers object 
            - var index = substring.search(new RegExp(reviewer.name)); 
            - if (index -1)
                - continue 
            - else 
                - Update the reviewer.title property with the current title symbol.   
        */
        var nameSearch = null;
        var rawTitle = null;
        for (var x = 0; x < reviewersArray.length; x++) {
            reviewer = reviewersArray[x];
            // console.log("name regexp: ", nameRegExp);
            nameSearch = reviewer.name.substring(0, reviewer.name.indexOf(','));
            index = testSubstring.indexOf(nameSearch);
            if (index != -1) {
                // If there is an index then the contributor should now be associated with the current title 
                // Update the reviewer.title property with the current title symbol. 
                rawTitle = testSubstring.match(title.symbol)[0];
                reviewer.title = cleanHTML.plainText(cleanHTML.removeEntities(rawTitle)).trim();
                reviewersResult.push(reviewer);
            }
        } 
    }

    // console.log("REVIEWERS RESULT: ", reviewersResult);
    return reviewersResult; 
}

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML, program) {
    var {textBlock: cmeReviewerBlock} = stringOps.getTextBlock(ticketHTML, /.*CME Author.*/g, /CME ID#<\/strong>/g, false, false);
    if (stringOps.isBlankOrWhiteSpace(cmeReviewerBlock) || stringOps.isEmptyString(cmeReviewerBlock) || cmeReviewerBlock.length < 10) {
        throw new Error("No CME reviewers found in the prodticket");
    } else {
        // console.log("CME REVIEWER BLOCK: ", cmeReviewerBlock);

        cmeReviewerBlock = cleanHTML.cmeReviewerFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock, program);
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
    
    // console.log("CME REVIEWER BLOCK: ", cmeReviewerBlock); // --> OKAY 

    if (stringOps.isBlankOrWhiteSpace(cmeReviewerBlock) || stringOps.isEmptyString(cmeReviewerBlock) || cmeReviewerBlock.length < 10) {
        throw new Error("No CME reviewers found in the prodticket");
    } else {
        // console.log("CME REVIEWER BLOCK: ", cmeReviewerBlock);

        cmeReviewerBlock = cleanHTML.cmeReviewerFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock, program);
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
        // console.log("CME REVIEWER BLOCK: ", cmeReviewerBlock);

        cmeReviewerBlock = cleanHTML.cmeReviewerFluff(cmeReviewerBlock);
        return buildCMEReviewers(cmeReviewerBlock, program);
    }
}

module.exports = exportObject;