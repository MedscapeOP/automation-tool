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
    /<p><strong>&lt;&lt;component/gi,
    /<p>&lt;&lt;component/gi,
    /&lt;&lt;slide 1/gi,
    /&lt;&lt;insert slide 1/gi,
    /<strong>Content<\/strong>/gi
];
let endSlideMatches = [
    /.*end slides&gt;&gt;.*/g, 
    /<p>.*This content has been condensed for improved clarity.*<\/p>/g
];


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML, program) {
    ticketHTML = cleanHTML.slidesInitial(ticketHTML);
    var startSlideRegExp = stringOps.getUsableRegExp(ticketHTML, startSlideMatches);
    var endSlideRegExp = stringOps.getUsableRegExp(ticketHTML, endSlideMatches);

    if (!startSlideRegExp || !endSlideRegExp) {
        throw new Error("No slides found in the prodticket");
    } else {
        var slideComponents = []; 
        var textBlockObject = stringOps.getTextBlock(ticketHTML, startSlideRegExp, endSlideRegExp, false); 
        var textBlock = textBlockObject.textBlock;

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No slides found in the prodticket");
        } else {
            var slideComponent = new SlideComponent(program.articleID, null, textBlockObject.textBlock);
            slideComponents.push(slideComponent.toObjectLiteral());
            // console.log(JSON.stringify(slideComponents, undefined, 2));
            return slideComponents;
        }
    }    
}

// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}

// Video Lecture
exportObject[config.programs.videoLecture.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}


// First Response 
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
    // console.log("CLEAN TICKET", ticketHTML);
    var startSlideRegExp = stringOps.getUsableRegExp(ticketHTML, startSlideMatches);
    var endSlideRegExp = stringOps.getUsableRegExp(ticketHTML, endSlideMatches);
    // console.log("START REGEXP: ", startSlideRegExp);
    // console.log("END REGEXP: ", endSlideRegExp);
    if (!startSlideRegExp || !endSlideRegExp) {
        throw new Error("No slides found in the prodticket");
    } else {
        var slideComponents = [];
        var slideComponent = null;
        var textBlockObject = stringOps.getTextBlock(ticketHTML, startSlideRegExp, endSlideRegExp, false, true);  
        
        var textBlock = textBlockObject.textBlock;
    
        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No slides found in the prodticket");
        } else {
            for (var i = 0; textBlockObject.endIndex != -1; i++) {         
                slideComponent = new SlideComponent(program.articleID, i + 1, textBlockObject.textBlock);
                slideComponents.push(slideComponent.toObjectLiteral());
                ticketHTML = ticketHTML.substring(textBlockObject.endIndex);
                textBlockObject = stringOps.getTextBlock(ticketHTML, startSlideRegExp, endSlideRegExp, false, true);
                // console.log(JSON.stringify(textBlockObject, undefined, 2));
            }
            // console.log(slideComponents);
            return slideComponents;
        }
    }
}

// Town Hall Enduring
exportObject[config.programs.townHall.codeName] = function (ticketHTML, program) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML, program);
}

// Town Hall Cert Page
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML, program) {
    ticketHTML = cleanHTML.slidesInitial(ticketHTML);
    var startSlideRegExp = stringOps.getUsableRegExp(ticketHTML, startSlideMatches);
    var endSlideRegExp = stringOps.getUsableRegExp(ticketHTML, endSlideMatches);

    if (!startSlideRegExp || !endSlideRegExp) {
        throw new Error("No slides found in the prodticket");
    } else {
        var slideComponents = []; 
        var textBlockObject = stringOps.getTextBlock(ticketHTML, startSlideRegExp, endSlideRegExp, false); 

        var textBlock = textBlockObject.textBlock;

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No slides found in the prodticket");
        } else {
            // Slide Component should have a component number set to 1 
            // This will make slide path in this format: 000/000/000000_2 
            var slideComponent = new SlideComponent(program.articleID, 1, textBlockObject.textBlock);
    
            slideComponents.push(slideComponent.toObjectLiteral());
            // console.log(JSON.stringify(slideComponents, undefined, 2));
            return slideComponents;
        }
    }    
}

module.exports = exportObject;