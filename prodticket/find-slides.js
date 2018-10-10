const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

/*
FUNCTION REQUIREMENTS:  
    Should return array of slide components. This will make building slides 
    for firstResponse/multi-component articles possible.

    Look for end slides since this is in EVERY ticket. 
        - This will be the marker to end each component. 

    slideComponent Properties: articleID, componentNumber, slidePath, rawSlides 

    update SlideGroup Class to use slidePath as opposed to articleID
    update buildSlides to take in slidePath as opposed to articleID
    
    Enduring - Slides are the same 
        - Make sure to update title, byline, add findSubtitle, No peer reviewer 
*/

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    // 
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return "";
}

module.exports = exportObject;