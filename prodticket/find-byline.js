const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var {textBlock: newsAuthor, label: newsAuthorLabel} = stringOps.getTextBlock(ticketHTML, "News Author", 'CME Author');

    var {textBlock: cmeAuthor, label: cmeAuthorLabel} = stringOps.getTextBlock(ticketHTML, "CME Author", 'Editor');
    
    newsAuthor = cleanHTML.singleLine(cleanHTML.plainText(newsAuthor)).trim();
    cmeAuthor = cleanHTML.singleLine(cleanHTML.plainText(cmeAuthor)).trim(); 

    if (stringOps.isEmptyString(newsAuthor) && stringOps.isEmptyString(cmeAuthor)) {
        throw new Error("No News Author or CME Author found in the prodticket");
    } else if (stringOps.isEmptyString(newsAuthor)) {
        throw new Error("No News Author found in the prodticket");
    } else if (stringOps.isEmptyString(cmeAuthor)) {
        throw new Error("No CME Author found in the prodticket");
    } else {
        return `${newsAuthorLabel}: ${newsAuthor}; ${cmeAuthorLabel}: ${cmeAuthor}`;
    }
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Faculty/Author(s) Byline(s): &#953;", "Indicate thumbnail URL");

    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        throw new Error("No byline found in the prodticket");
    } else {
        return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
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
var townHallStartRegExps = [
    /\(Names and degrees only, separated by semicolons\)/g,
    /<strong>Faculty Byline/g,
    /Faculty Byline.*/g
];

exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = stringOps.getNextRegex(ticketHTML, townHallStartRegExps);
    var endRegExp = /<strong>Location\/map info/g;
    if (startRegExp != -1) {
        var {textBlock: byline} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
        
        if (stringOps.isBlankOrWhiteSpace(byline) || stringOps.isEmptyString(byline)) {
            throw new Error("No byline found in the prodticket");
        } else {
            return cleanHTML.singleLine(cleanHTML.plainText(byline)).trim();
        }
    } else {
        throw new Error("No byline found in the prodticket");
    }
}

module.exports = exportObject;