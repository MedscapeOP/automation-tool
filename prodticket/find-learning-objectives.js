const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};
/* 
Base Statement: CB 
<p>Upon completion of this activity, participants will be able to:</p>

Base Statement: SL, CC
Upon completion of this activity, participants will:
*/ 

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var startRegExp = /Upon completion of this activity.*/g;
    var endRegExp = /.*<strong>Clinical Context.*/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No learning objectives found in the prodticket");
    } else {  
        textBlock = cleanHTML.learningObjectives(textBlock);
        var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
        return result;
    }    
};

// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Upon completion of this activity.*/g;
    var endRegExp = /.*Questions \(Evaluations.*/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No learning objectives found in the prodticket");
    } else {  
        textBlock = cleanHTML.learningObjectives(textBlock);
        var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
        return result;
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
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Enduring
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Upon completion of this activity.*/g;
    var endRegExp = /<strong>Association Disclaimer Statement/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No learning objectives found in the prodticket");
    } else {  
        textBlock = cleanHTML.learningObjectives(textBlock);
        var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
        return result;
    }  
};

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

module.exports = exportObject;