/*
Module for retrieving info that is universal to every program. 
Finding program-specific content and building the program XML will be 
in the corresponding article/program module. 
    - EXAMPLE: clinical-brief module 
        - finds "Clinical Context", "Study Highlights", etc.
        - Builds the appropriate XML transcript.  
*/

const _ = require("lodash");
const utils = require('../utils');
let findTitle = require('./find-title');
let findByline = require('./find-byline');
let findReferences = require('./find-references');
let findAbbreviations = require('./find-abbreviations');

function getProgramTitle (ticketHTML, program) {
    var rawTitle = findTitle[program.codeName](ticketHTML);
    return rawTitle;
}

function getProgramByline (ticketHTML, program) {
    var rawByline = findByline[program.codeName](ticketHTML);
    return rawByline;
}

function getProgramReferences (ticketHTML, program) {
    var rawReferences = findReferences[program.codeName](ticketHTML);
    return rawReferences;
}

function getProgramAbbreviations (ticketHTML, program) {
    var rawAbbreviations = findAbbreviations[program.codeName](ticketHTML);
    return rawAbbreviations;
}

function wrapSubsectionContent(textBlock, cleaningFn) {
    // Put together final string of XML. 
    if (cleaningFn) {
        return "<subsec_content>" + cleaningFn(textBlock) + "</subsec_content>";
    } else {
        return "<subsec_content>" + textBlock + "</subsec_content>";
    }       
}

module.exports = {
    getProgramTitle,
    getProgramByline,
    getProgramReferences,
    getProgramAbbreviations,
    wrapSubsectionContent
}