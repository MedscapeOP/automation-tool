const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "<strong>Tagging Info");
    textBlock = cleanHTML.references(textBlock).trim();
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
  
}

// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "</html>");
    textBlock = cleanHTML.references(textBlock).trim(); 
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
}

// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "</html>");
    textBlock = cleanHTML.references(textBlock).trim(); 
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
}


// First Response 
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "</html>");
    textBlock = cleanHTML.references(textBlock).trim(); 
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
}


// Town Hall  
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "</a>References (for enduring version only)", "</html>");
    textBlock = cleanHTML.references(textBlock).trim(); 
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
}

module.exports = exportObject;