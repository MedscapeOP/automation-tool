const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    throw new Error("No Collection Pages in Clinical Briefs!");
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    return '';
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
var townHallStartRegExps = [
    /\(Names and degrees only, separated by semicolons\)/g,
    /<strong>Faculty Byline/g,
    /Faculty Byline.*/g,
    /<strong>Faculty\/Author\(s\)/g
];

exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return '';
    // var startRegExp = stringOps.getUsableRegExp(ticketHTML, townHallStartRegExps);
    // var endRegExp = /<strong>Location\/map info/g;
    // if (startRegExp != -1) {
    //     var {textBlock: byline} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
        
    //     if (stringOps.isBlankOrWhiteSpace(byline) || stringOps.isEmptyString(byline)) {
    //         throw new Error("No byline found in the prodticket");
    //     } else {
    //         return cleanHTML.singleLine(cleanHTML.plainText(byline)).trim();
    //     }
    // } else {
    //     throw new Error("No byline found in the prodticket");
    // }
}

// Test and Teach 
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

module.exports = exportObject;