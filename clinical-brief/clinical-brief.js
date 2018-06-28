/*
    Main algorithm 
    - read in string file of prodticket
        - write functions to grab each important piece of the ticket.
        - plug in content programmatically via JS object properties. 
    - Grabbing pieces of the prod ticket (DONE **** )
        - get starting index of chunk using indexOf()
        - get ending index 
        - get substrings using indeces 
        - clean the html 
        - wrap the html 
        - turn string into JS object 
        - Take JS object and turn into xml
        - Take xml and write to file. 
    - Build Final XML file in one master function  
        - This function calls other functions that build each 
        section/subsection    
            - use get...() functions previously defined to get subsections 
        - Create instances of TOC elements as needed
            - Insert subsections and sections as needed
*/

const _ = require("lodash");
const utils = require("../utils");
const SubsectionElement = require('../classes/subsec_element');
const SectionElement = require('../classes/sec_element');
const TOCElement = require("../classes/toc_element");


function getSubsectionText(ticket, startText, endText) {
    var startIndex = ticket.indexOf(startText);
    var endIndex = ticket.indexOf(endText);
    var mainBlock = ticket.substring(startIndex, endIndex);
    var mainLabel = mainBlock.match(startText)[0];
    mainBlock = mainBlock.replace(mainLabel,'');

    // Put together final string of XML. 
    mainBlock = "<subsec_content>" + utils.cleanHTML.paragraph(mainBlock) + "</subsec_content>";
    return {
        mainLabel,
        mainBlock
    }
}

function buildSection(mainBlock, mainLabel) {
    // Use package to convert XML string to JS object
    var subsectionContent = utils.xmlStringToJS(mainBlock); 

    // Return instance of section for use in master BUILD function
    var sectionInstance = new SectionElement();
    var subsectionInstance = new SubsectionElement();
    sectionInstance.sectionHeader = mainLabel;
    subsectionInstance.insertSubsectionContent(subsectionContent);
    sectionInstance.insertSubsectionElement(subsectionInstance);
    return sectionInstance;
}

/* CLINICAL CONTEXT 
-------------------------------------- */
function getClinicalContext(ticket) {
    // Get XML string from prod ticket.
    var {mainBlock, mainLabel} = getSubsectionText(ticket, "Clinical Context", "Study Synopsis");
    // build the actual section element
    return buildSection(mainBlock, mainLabel);
}


/* STUDY SYNOPSIS AND PERSPECTIVE  
-------------------------------------- */
function getSynopsisAndPerspective(ticket) {
    // Get XML string from prod ticket.
    var {mainBlock, mainLabel} = getSubsectionText(ticket, "Study Synopsis and Perspective", "Study Highlights");
    // build the actual section element
    return buildSection(mainBlock, mainLabel);
}

function getStudyHighlights (ticket) {
    // Have to clean up bullets into proper unordered lists
    // ticket.replace(/<\Sp>\\n.*<\Sli>/g, "</li>\\n</ul>");
    // ticket.replace(/<\Sp>\\n.*<p><tt>o\t<\Stt>/g, "</li><li>");
    // ticket.replace(/<p><tt>o\t<\Stt>/g,"<ul><li>");
    // ticket.replace(/<S+>&nbsp;<\S\S+>/g,"");
}

function getClinicalImplications(ticket) {
    // Have to clean up bullets into proper unordered lists
    // ticket.replace(/<\Sp>\\n.*<\Sli>/g, "</li>\\n</ul>");
    // ticket.replace(/<\Sp>\\n.*<p><tt>o\t<\Stt>/g, "</li><li>");
    // ticket.replace(/<p><tt>o\t<\Stt>/g,"<ul><li>");
    // ticket.replace(/<S+>&nbsp;<\S\S+>/g,"");
}

module.exports = {
    getSynopsisAndPerspective,
    getClinicalContext,
    getStudyHighlights,
    getClinicalImplications
}