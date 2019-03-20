const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief 
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>CME Teaser", "<strong>Target Audience");

    textBlock = textBlock.replace(/\(.*\)/g, "");

    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        throw new Error("No teaser found in the prodticket")
    } else {
        return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
    }
}

// Spotlight 
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Teaser: &#953;", "Faculty/Author(s) Byline(s): &#953;");
    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        throw new Error("No teaser found in the prodticket")
    } else {
        return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
    }
}

// Curbside Consult
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
    var testRegExp = /Faculty\/Author\(s\) Byline\(s\)/g;

    var startRegExp = /Teaser \(140 characters max incl. spaces\)/g;
    var endRegExp = /<strong>Location\/map info:/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    // console.log("TEXT BLOCK TEASER: ", textBlock);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No teaser info found in the prodticket");
    } else {  
        var result = textBlock;
        var index = stringOps.regexIndexOf(result, testRegExp);
        if (index != -1) {
            result = result.replace(result.substring(index), "");
        }
        result = cleanHTML.onlyParagraphTags(result, removeFluff=false).trim();
        return result;
    }
};

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

module.exports = exportObject;