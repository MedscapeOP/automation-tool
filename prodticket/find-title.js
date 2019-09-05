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
var townHallTitleRegExps = [
    /<strong>Title:/g,
    /<p>Title:/g,
    /.*Title.*/g
];

var townHallEndTitleRegExps = [
    /<strong>Subtitle:/g,
    /<p>Subtitle:/g,
    /.*Subtitle.*/g
];

var townHallSubtitleRegExps = [
    /<strong>\*Title \+ subtitle.*/g
]

var townHallEndSubtitleRegExps = [
    /<strong>Teaser/g
];
// Town Hall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var startRegExp = stringOps.getUsableRegExp(ticketHTML, townHallTitleRegExps);
    var endRegExp = stringOps.getUsableRegExp(ticketHTML, townHallEndTitleRegExps);
    // console.log("START REGEXP:", startRegExp);
    // console.log("END REGEXP:", endRegExp);

    if (startRegExp && endRegExp) {
        var {textBlock: title} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

        startRegExp = stringOps.getUsableRegExp(ticketHTML, townHallSubtitleRegExps);
        endRegExp = stringOps.getUsableRegExp(ticketHTML, townHallEndSubtitleRegExps);

        var {textBlock: subtitle} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

        title = cleanHTML.singleLine(cleanHTML.plainText(title)).trim();
        subtitle = cleanHTML.singleLine(cleanHTML.plainText(subtitle)).trim();
        if (stringOps.isEmptyString(title)) {
            throw new Error("No title found in the prodticket");
        } else if (stringOps.isEmptyString(subtitle)) {
            return `${title}`;
        } else {
            return `${title}: ${subtitle}`;
        } 
    } else {
        throw new Error("No title found in the prodticket");
    }
}

// TownHall Enduring 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};


// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

module.exports = exportObject;