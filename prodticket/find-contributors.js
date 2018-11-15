const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    return ``;
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    return "";
}


// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}


// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var {textBlock: byline} = stringOps.getTextBlock(ticketHTML, "\(Names and degrees only, separated by semicolons\)", '<strong>Location/map info', true, false);

    // console.log("BYLINE: ", byline);

    if(byline.length < 4) {
        return `<p>Byline not found in the prodticket!</p>`;
    }

    return "<p>" + cleanHTML.singleLine(cleanHTML.plainText(byline)).trim() + "</p>";
}

module.exports = exportObject;