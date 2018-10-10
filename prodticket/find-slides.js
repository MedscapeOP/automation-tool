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
        - Goal is to loop through slideComponents and call buildSlides for each slideComponent 
        - This will build a subsection that we can then insert where 
        necessary 
    
    Enduring - Slides are the same 
        - Make sure to update title, byline, add findSubtitle, No peer reviewer 
*/

exportObject[config.programs.spotlight.codeName] = function (ticketHTML, program) {
    // while startIndex != -1;
    // get textBlock from &lt;&lt;.*slide 1 to &lt;&lt;end slides
    // instantiate SlideComponent 
    // Store info in slideComponent object 
        // componentNumber should be the loop index
        // slidePath will be a computed property that uses the component number 
        // rawSlides should be the textBlock extracted
    // Push slideComponent object onto slideComponents array 
    // reassign inputString to be inputString.substring(from 0 to endIndex)
    // continue loop
    // return slideComponents 
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

exportObject[config.programs.firstResponse.codeName] = function (ticketHTML, program) {
    return "";
}

module.exports = exportObject;