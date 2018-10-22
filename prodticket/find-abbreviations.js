const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// NO CLINICAL BRIEF ABBREVIATIONS 
// exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
//     return "";   
// }

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock: rawAbbreviations, label: abbrLabel} = stringOps.getTextBlock(ticketHTML, "Abbreviations", "Additional Resources");
    // console.log(cleanHTML.abbreviations(rawAbbreviations));
    // return "";
    rawAbbreviations = cleanHTML.singleLine(cleanHTML.abbreviations(rawAbbreviations)).trim();
    return '<p>' + stringOps.findLastAndReplace(rawAbbreviations, '<br/>', "") + '</p>';
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

module.exports = exportObject;