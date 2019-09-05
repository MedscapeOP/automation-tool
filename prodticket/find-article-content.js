const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};
/* 
ARTICLE CONTENT CAN BE EITHER A TRANSCRIPT OR MAINCONTENT 
- Checklist should either store this information as "transcript" 
  or as "mainContent"

Base Statement: CB 
<p>Upon completion of this activity, participants will be able to:</p>

Base Statement: SL, CC
Upon completion of this activity, participants will:
*/ 

var contentRegexArray = [
    /<strong>Content.*/g,
    /<p>The following cases.*/g    
];

var endContentRegexArray = [
    /<strong>Abbreviations/g
];


// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    return '';
};

// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var startRegExp = stringOps.getNextRegex(ticketHTML, contentRegexArray);
    var endRegExp = stringOps.getNextRegex(ticketHTML, endContentRegexArray);    

    if (endRegExp != -1 && startRegExp != -1) {
        startRegExp = startRegExp.symbol;
        endRegExp = endRegExp.symbol;
        var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, false, true);

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No content section found in the prodticket");
        } else {
            return textBlock;
        }
    } else {
        throw new Error("No content section found in the prodticket");
    }
};

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
    var componentTextBlock = stringOps.getTextBlock(ticketHTML, /.*<strong>Product-Specific Information.*/g, /.*<strong>Learning Objectives and KMI Map.*/g);
    var ticketSubstring = ticketHTML.substring(0, componentTextBlock.startIndex) + ticketHTML.substring(componentTextBlock.endIndex);

    var startRegExp = stringOps.getNextRegex(ticketSubstring, contentRegexArray);
    var endRegExp = stringOps.getNextRegex(ticketSubstring, endContentRegexArray);    

    if (endRegExp != -1 && startRegExp != -1) {
        startRegExp = startRegExp.symbol;
        endRegExp = endRegExp.symbol;
        var {textBlock} = stringOps.getTextBlock(ticketSubstring, startRegExp, endRegExp, false, true);

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No content section found in the prodticket");
        } else {
            return textBlock;
        }
    } else {
        throw new Error("No content section found in the prodticket");
    }
}

// Town Hall Enduring  
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

// Town Hall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    // Add logic to look at prodticket for Event Statement. 
    return 'This certificate page is associated with a Medscape Education event.';
};


var contentRegexArrayTT = [
    /<strong>Content.*/g,
    /<p>The following cases.*/g    
];

var endContentRegexArrayTT = [
    /<strong>Abbreviations/g
];
// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {

    var startRegExp = stringOps.getNextRegex(ticketHTML, contentRegexArrayTT);
    var endRegExp = stringOps.getNextRegex(ticketHTML, endContentRegexArrayTT);    

    if (endRegExp != -1 && startRegExp != -1) {
        startRegExp = startRegExp.symbol;
        endRegExp = endRegExp.symbol;
        var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, false, true);

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No content section found in the prodticket");
        } else {
            return textBlock;
        }
    } else {
        throw new Error("No content section found in the prodticket");
    }
};

module.exports = exportObject;