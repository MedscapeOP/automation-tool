/*
    Main algorithm 
    - read in string file of prodticket
        - write functions to grab each important piece of the ticket.
        - plug in content programmatically via JS object properties. 
    - Pieces to grab from the prod ticket
        - Clinical Context (DONE **** )
        - Synopsis and Perspective (DONE **** )
        - Study Highlights
        - Clinical Implications 
    - Grabbing pieces of the prod ticket (DONE **** )
        - get starting index of chunk using indexOf()
        - get ending index 
        - get substrings using indeces 
        - clean the html 
        - wrap the html 
        - turn string into JS object 
        - Take JS object and turn into xml
        - Take xml and write to file. 
    - Build Final Prod Ticket 
        - Create one master function (TODO) 
        - Call factory function to generate TOC element (DONE **** ) 
        - This function calls other functions that build each 
        section/subsection (DONE **** )
            - Take the result of each of these sections/subsections and 
            push them onto the TOC element array. (DONE **** ) 
            - This way they go on into the correct order. (DONE **** )
*/
var fs = require('fs');
var _ = require("lodash");
var utils = require("../utils/utils");


/* CLINICAL CONTEXT 
-------------------------------------- */
function getClinicalContext(ticket) {
    // ticket.replace(/<\Sp>\\n.*<\Sli>/g, "</li>\\n</ul>");
    // ticket.replace(/<\Sp>\\n.*<p><tt>o\t<\Stt>/g, "</li><li>");
    // ticket.replace(/<p><tt>o\t<\Stt>/g,"<ul><li>");
    // ticket.replace(/<S+>&nbsp;<\S\S+>/g,"");
    var startIndex = ticket.indexOf("Clinical Context");
    var endIndex = ticket.indexOf("Study Synopsis");
    var mainBlock = ticket.substring(startIndex, endIndex);
    var mainLabel = mainBlock.match("Clinical Context");
    mainBlock = mainBlock.replace('Clinical Context','');
    mainBlock = "<subsec_content>" + utils.cleanHTML(mainBlock) + "</subsec_content>";
    return utils.xmlStringToJS(mainBlock);
}

// function buildClinicalContext(ccArray) {
//     var element = [];
//     var p;
//     for (var i = 0; i < ccArray.length; i++) {
//         p = {"p": [ccArray[i]]};
//         element.push(p);
//     }
//     return element;
// }


/* STUDY SYNOPSIS AND PERSPECTIVE  
-------------------------------------- */

/*
TODO: 
- Make the get functions insert the text directly into a subsection instance 
- Then return the entire subsection which can then be inserted into a section 
  parent. 
*/
function getSynopsisAndPerspective(ticket) {
    var startIndex = ticket.indexOf("Study Synopsis and Perspective");
    var endIndex = ticket.indexOf("Study Highlights");
    var mainBlock = ticket.substring(startIndex, endIndex);
    mainBlock = mainBlock.replace('Study Synopsis and Perspective','');
    mainBlock = "<subsec_content>" + utils.cleanHTML(mainBlock) + "</subsec_content>";
    // xml2js needs 1 root node 
    // To handle this, subsec_content is used around the main result string as wrapper.     
    return utils.xmlStringToJS(mainBlock);
}


module.exports = {
    getSynopsisAndPerspective,
    getClinicalContext
}