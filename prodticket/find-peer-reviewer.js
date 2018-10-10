const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Peer Reviewer</strong>", "References");
    var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
    return `<h3>Peer Reviewer</h3>${result}`;
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

module.exports = exportObject;