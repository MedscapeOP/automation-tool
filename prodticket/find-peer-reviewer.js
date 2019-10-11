const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief 
// No Peer Reviewer!


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Peer Reviewer</strong>", "References");

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No peer reviewer info found in the prodticket");
    } else {  
        var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
        return `<h3>Peer Reviewer</h3><p>${result}</p>`;
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
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Peer Reviewer", "</a>Related links");

    // console.log("RAW PEER REVIEWER: ", textBlock);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No peer reviewer info found in the prodticket");
    } else {  
        var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
        return `<h3>Peer Reviewer</h3><p>${result}</p>`;
    }
}

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

module.exports = exportObject;