const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// NO CLINICAL BRIEF ABBREVIATIONS 
// exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
//     return "";   
// }


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock: rawAbbreviations, label: abbrLabel} = stringOps.getTextBlock(ticketHTML, "Abbreviations", "Additional Resources");
    // console.log(cleanHTML.abbreviations(rawAbbreviations));
    // return "";
    rawAbbreviations = cleanHTML.singleLine(cleanHTML.abbreviations(rawAbbreviations)).trim();
    return '<p>' + stringOps.findLastAndReplace(rawAbbreviations, '<br/>', "") + '</p>';
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

// TownHall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock: rawAbbreviations, label: abbrLabel} = stringOps.getTextBlock(ticketHTML, "Abbreviations", '<a name="Heading562"></a>Transcript');
    // console.log(cleanHTML.abbreviations(rawAbbreviations));
    // return "";
    rawAbbreviations = cleanHTML.singleLine(cleanHTML.abbreviations(rawAbbreviations)).trim();
    return '<p>' + stringOps.findLastAndReplace(rawAbbreviations, '<br/>', "") + '</p>';
}

module.exports = exportObject;