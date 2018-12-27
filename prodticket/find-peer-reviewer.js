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

// Town Hall
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Peer Reviewer", "</a>Related links");

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No peer reviewer info found in the prodticket");
    } else {  
        var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
        return `<h3>Peer Reviewer</h3><p>${result}</p>`;
    }
}

module.exports = exportObject;