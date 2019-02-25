const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};
/* 
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
    return '';
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
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return '';
};

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {

    var startRegExp = stringOps.getNextRegex(ticketHTML, contentRegexArray);
    var endRegExp = stringOps.getNextRegex(ticketHTML, endContentRegexArray);

    console.log("START REGEX: ", startRegExp);

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