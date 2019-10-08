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
    if (stringOps.isEmptyString(rawAbbreviations) || stringOps.isBlankOrWhiteSpace(rawAbbreviations) || rawAbbreviations.length < 5) {
        throw new Error("No abbreviations found in the prodticket");
    } else {
        rawAbbreviations = cleanHTML.singleLine(cleanHTML.abbreviations(rawAbbreviations)).trim();
        return '<p>' + stringOps.findLastAndReplace(rawAbbreviations, '<br/>', "") + '</p>';        
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

// TownHall Enduring  
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}


var abbreviationsRegexArray = [
    /<p>Abbreviations<\/p>/gi,    
    /<strong>Abbreviations/g
];

var endAbbreviationsRegexArray = [
    /<a name=".*"><\/a>Transcript/g,
    /<\/html>/g,
    /<a name=".*"><\/a>Disclaimer/g
];

// TownHall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    // var startRegExp = ticketHTML.match(/Abbreviations(?!Abbreviations)/i);
    // if (startRegExp.index) {
    //     startRegExp = stringOps.getNextRegex(ticketHTML.substring(startRegExp.index), abbreviationsRegexArray);
    // } else {
    //     throw new Error("No abbreviations found in the prodticket");
    // }
    var startRegExp = stringOps.getAllMatchesInOrder(ticketHTML, abbreviationsRegexArray);
    startRegExp = startRegExp[startRegExp.length - 1];
    
    var endRegExp = stringOps.getNextRegex(ticketHTML.substring(startRegExp.index), endAbbreviationsRegexArray);
    
    if (endRegExp != -1 && startRegExp != -1) {
        startRegExp = startRegExp.symbol;
        endRegExp = endRegExp.symbol;
        // console.log("START REGEX: ", startRegExp);
        var {textBlock: rawAbbreviations, label: abbrLabel} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
        // console.log("ABBREVIATIONS: ", (rawAbbreviations));
        if (stringOps.isEmptyString(rawAbbreviations) || stringOps.isBlankOrWhiteSpace(rawAbbreviations) || rawAbbreviations.length < 5) {
            throw new Error("No abbreviations found in the prodticket");
        } else {
            rawAbbreviations = cleanHTML.singleLine(cleanHTML.abbreviations(rawAbbreviations)).trim();
            return '<p>' + stringOps.findLastAndReplace(rawAbbreviations, '<br/>', "") + '</p>';        
        } 
    } else {
        throw new Error("No abbreviations found in the prodticket");
    }
}

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

module.exports = exportObject;