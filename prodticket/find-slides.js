const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');
const SlideComponent = require('../classes/slide_component');

var exportObject = {};

/*
FUNCTION REQUIREMENTS:  
    Should return array of slide components. This will make building slides 
    for firstResponse/multi-component articles possible.

    Look for end slides since this is in EVERY ticket. 
        - This will be the marker to end each component. 

    Make Object Literal for SlideComponent.
    slideComponent Properties: articleID, componentNumber, slidePath, rawSlides 

    update SlideGroup Class to use slidePath as opposed to articleID - DONE
    update buildSlides to take in slidePath as opposed to articleID - DONE

    - Goal is to loop through slideComponents and call buildSlides for each slideComponent 
    - This will build a subsection that we can then insert where necessary 
    
    Enduring - Slides are the same 
        - Make sure to update title, byline, add findSubtitle, No peer reviewer 
*/

let startSlideMatches = [
    /<p><strong>&lt;&lt;Component/g,
    /<p><strong>&lt;&lt;.*slide 1/g,
    /<p>&lt;&lt;.*slide 1/g,
    /<strong>Content<\/strong>/g
];
let endSlideMatches = [
    /.*end slides&gt;&gt;/g, 
    /<p>.*This content has been condensed for improved clarity.*<\/p>/g
];

function getUsableRegExp (ticketHTML, regexpArray) {
    var regexp = null;
    for (var i = 0; i < regexpArray.length; i++) {
        let index = stringOps.regexIndexOf(ticketHTML, regexpArray[i]);
        if (index != -1) {
            regexp = regexpArray[i];
            break;
        } else {
            continue;
        }  
    }
    return regexp;
}

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
    ticketHTML = cleanHTML.slidesInitial(ticketHTML);
    var startSlideRegExp = getUsableRegExp(ticketHTML, startSlideMatches);
    var endSlideRegExp = getUsableRegExp(ticketHTML, endSlideMatches);

    if (!startSlideRegExp && !endSlideRegExp) {
        return new Error("Regexp is not found in the prodticket");
    } else {
        var slideComponents = []; 
        var textBlockObject = stringOps.getTextBlock(ticketHTML, startSlideRegExp, endSlideRegExp, false); 
        var slideComponent = new SlideComponent(program.articleID, null, textBlockObject.textBlock);
        slideComponents.push(slideComponent.toObjectLiteral());
        // console.log(JSON.stringify(slideComponents, undefined, 2));
        return slideComponents;
    }    
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}

exportObject[config.programs.firstResponse.codeName] = function (ticketHTML, program) {
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
    ticketHTML = cleanHTML.slidesInitial(ticketHTML);
    // console.log(ticketHTML);
    var slideComponents = [];
    var slideComponent = null;
    var startIndex = 0;
    var textBlockObject; 
    for (var i = 0; startIndex != -1; i++) {
        textBlockObject = stringOps.getTextBlock(ticketHTML, "&lt;&lt;insert slide 1", "&lt;&lt;end slides&gt;&gt;"); 
        slideComponent = new SlideComponent(program.articleID, i + 1, textBlockObject.textBlock);
        slideComponents.push(slideComponent.toObjectLiteral());
        ticketHTML = ticketHTML.substring(0, textBlockObject.endIndex);
        // console.log(JSON.stringify(textBlockObject, undefined, 2));
        startIndex = textBlockObject.startIndex;
    }
    console.log(slideComponents);
    return slideComponents;
}

module.exports = exportObject;