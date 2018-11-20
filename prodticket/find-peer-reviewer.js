const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief 
// No Peer Reviewer!


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Peer Reviewer</strong>", "References");
    var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
    return `<h3>Peer Reviewer</h3><p>${result}</p>`;
}

// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Peer Reviewer", "</a>Related links");
    var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
    return `<h3>Peer Reviewer</h3><p>${result}</p>`;
}

module.exports = exportObject;