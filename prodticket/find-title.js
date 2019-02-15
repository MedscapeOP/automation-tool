/*
Functions should return title of program: 
- Should be a string 
- Should not include any tags 
- ProfArticle class requires plain text to set the title property.
*/

const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');


var exportObject = {};

// Clinical Brief 
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Activity Title", "Content Information");
    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        throw new Error("No title found in the prodticket")
    } else {
        return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
    }
}


// Spotlight 
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Title: &#953;", "Teaser: &#953;");
    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        throw new Error("No title found in the prodticket")
    } else {
        return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
    }
}


// Curbside Consult
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
    var {textBlock: title} = stringOps.getTextBlock(ticketHTML, "<strong>Title:", "<strong>Subtitle:", true, false);
    var {textBlock: subtitle} = stringOps.getTextBlock(ticketHTML, "Title + subtitle = 80 characters max, inc. spaces*</strong>", "<strong>Teaser", true, false);
    title = cleanHTML.singleLine(cleanHTML.plainText(title)).trim();
    subtitle = cleanHTML.singleLine(cleanHTML.plainText(subtitle)).trim();
    console.log("TEXTBLOCK TITLE: ", title);
    if (stringOps.isEmptyString(title)) {
        throw new Error("No title found in the prodticket");
    } else if (stringOps.isEmptyString(subtitle)) {
        return `${title}`;
    } else {
        return `${title}: ${subtitle}`;
    } 
}

module.exports = exportObject;