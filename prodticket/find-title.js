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
    return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
}


// Spotlight 
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Title: &#953;", "Teaser: &#953;");
    return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
}


// Curbside Consult
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Title: &#953;", "Teaser: &#953;");
    return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    var {textBlock} = stringOps.getTextBlock(ticketHTML, "Title: &#953;", "Teaser: &#953;");
    return cleanHTML.singleLine(cleanHTML.plainText(textBlock)).trim();
}

// Town Hall
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock: title} = stringOps.getTextBlock(ticketHTML, "<strong>Title:", "<strong>Subtitle:", true, false);
    var {textBlock: subtitle} = stringOps.getTextBlock(ticketHTML, "Title + subtitle = 80 characters max, inc. spaces*</strong>", "<strong>Teaser", true, false);
    title = cleanHTML.singleLine(cleanHTML.plainText(title)).trim();
    subtitle = cleanHTML.singleLine(cleanHTML.plainText(subtitle)).trim();
    if (subtitle.length > 2) {
        return `${title}: ${subtitle}`;
    } else {
        return `${title}`;
    }
}

module.exports = exportObject;