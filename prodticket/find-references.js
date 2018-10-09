const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "<strong>Tagging Info");
    textBlock = cleanHTML.references(textBlock).trim();
    return ("<ol>" + cleanHTML.singleLine(textBlock) + "</ol>");
  
}

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "</html>");
    textBlock = cleanHTML.references(textBlock).trim(); 
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "<strong>References", "</html>");
    textBlock = cleanHTML.references(textBlock).trim(); 
    return "<ol>" + cleanHTML.singleLine(textBlock) + "</ol>";
}

module.exports = exportObject;