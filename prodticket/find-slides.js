const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

/*
FUNCTION REQUIREMENTS:  
    Should return array of slide components. This will make building slides 
    for firstResponse/multi-component articles possible.

    slideComponent Properties: articleID, componentNumber, slidePath, rawSlides 

    update SlideGroup Class to use slidePath as opposed to articleID
    update buildSlides to take in slidePath as opposed to articleID 
*/

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>Peer Reviewer</strong>", "References");
    var result = cleanHTML.singleLine(cleanHTML.peerReviewer(textBlock)).trim();
    return result;
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return "";
}

module.exports = exportObject;