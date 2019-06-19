const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');
const {Component} = require('../classes');

var exportObject = {};

/*
FUNCTION REQUIREMENTS:  
    Should return array of components. This will make building firstResponse/multi-component articles possible.

    1) Find general text block 
    - Start text: look for "Product-Specific Information and addons". (exclusive)
    - End text: look for "Learning Objectives and KMI Map" (exclusive)

    2) Break down into a more specific text block this will be the component 
    information
    - Start text: look for Component.* (inclusive)
    - End text: look for Content Type.* (inclusive)

    3) Capture each piece of component information
        - look for info using regexp and capture the info 
            - Then use string.replace() to return a new string that includes captured text 
        - Example: componentNumber
            - capture this (Component.*)
            - search the captured text for number and capture it ((?:\d){1,})
            - string.replace number capture and store it. 
    
    4) Instantiate Component with captured information 
*/

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML, program) {
    var {textBlock: productSpecificAddonsBlock} = stringOps.getTextBlock(
        ticketHTML, 
        "Product-Specific Information", 
        "Learning Objectives and KMI Map",
        true, 
        false
    );

    if (stringOps.isEmptyString(productSpecificAddonsBlock) || stringOps.isBlankOrWhiteSpace(productSpecificAddonsBlock) || productSpecificAddonsBlock.length < 10) {
        throw new Error("No component info found in the prodticket");
    } else {  
        var nextComponent = stringOps.regexIndexOf(productSpecificAddonsBlock, /Component.*/g);
        var currentIndex = 0;
        var componentNumberString = "";
        var componentNumber = 0;
        var titleString = "";
        var title = "";
        var teaserString = "";
        var teaser = "";
        var bylineString = "";
        var byline = "";
        var contentTypeString = "";
        var contentType = "";
        var components = [];
        while(nextComponent != -1) {
            var {textBlock, label} = stringOps.getTextBlock(
                productSpecificAddonsBlock,
                /\>Component.*/g,
                /Content Type.*/g,
                false,
                true
            );
            componentNumberString = textBlock.match(/(Component.*)/gi)[0];
            componentNumber = componentNumberString.match(/((?:\d){1,})/g)[0];
            componentNumber = parseInt(componentNumber, 10);
            
            // console.log("COMPONENT NUMBER: ", componentNumber);

            titleString = textBlock.match(/Title:.*/gi)[0];
            titleString = titleString.replace(/Title:(.*)/gi, "$1");
            title = cleanHTML.singleLine(cleanHTML.plainText(titleString)); 

            // console.log("TITLE: ", title);

            teaserString = textBlock.match(/Teaser:.*/gi)[0];
            teaserString = teaserString.replace(/Teaser:(.*)/gi, "$1");
            teaser = cleanHTML.singleLine(cleanHTML.plainText(teaserString));

            // console.log("TEASER: ", teaser);

            bylineString = textBlock.match(/Byline:.*/gi)[0];
            bylineString = bylineString.replace(/Byline:(.*)/gi, "$1");
            byline = cleanHTML.singleLine(cleanHTML.plainText(bylineString));
            
            // console.log("BYLINE: ", byline);

            contentTypeString = textBlock.match(/Content Type:.*/gi)[0];
            contentTypeString = contentTypeString.replace(/Content Type:(.*)/gi, "$1");
            contentType = cleanHTML.singleLine(cleanHTML.plainText(contentTypeString));

            // console.log("CONTENT TYPE: ", contentType);
            var component = new Component(componentNumber, title, teaser, byline, contentType, program.articleID); 
            
            components.push(component.toObjectLiteral());

            if (componentNumber == 1) {
                productSpecificAddonsBlock = productSpecificAddonsBlock.substring(nextComponent + 1);
                nextComponent = stringOps.regexIndexOf(productSpecificAddonsBlock, /\>Component.*/g);
                productSpecificAddonsBlock = productSpecificAddonsBlock.substring(nextComponent);
            } else {
                productSpecificAddonsBlock = productSpecificAddonsBlock.substring(textBlock.length);
                nextComponent = stringOps.regexIndexOf(productSpecificAddonsBlock, /\>Component.*/g);
                productSpecificAddonsBlock = productSpecificAddonsBlock.substring(nextComponent);
            }
            // if (componentNumber == 1) {
            //     console.log(productSpecificAddonsBlock);
            // }
        }
        return components;
    }
}

module.exports = exportObject;