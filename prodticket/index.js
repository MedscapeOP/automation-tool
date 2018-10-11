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
let findPeerReviewer = require('./find-peer-reviewer');
let findSlides = require('./find-slides');

function getTitle (ticketHTML, program) {
    var rawTitle = findTitle[program.codeName](ticketHTML);
    return rawTitle;
}

function getByline (ticketHTML, program) {
    var rawByline = findByline[program.codeName](ticketHTML);
    return rawByline;
}

function getReferences (ticketHTML, program) {
    var rawReferences = findReferences[program.codeName](ticketHTML);
    return rawReferences;
}

function getAbbreviations (ticketHTML, program) {
    var rawAbbreviations = findAbbreviations[program.codeName](ticketHTML);
    return rawAbbreviations;
}

function getPeerReviewer (ticketHTML, program) {
    var rawPeerReviewer = findPeerReviewer[program.codeName](ticketHTML);
    return rawPeerReviewer; 
}

function getSlides (ticketHTML, program) {
    var slideComponents = findSlides[program.codeName](ticketHTML, program);
    return slideComponents;
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
    getTitle,
    getByline,
    getReferences,
    getAbbreviations,
    getPeerReviewer,
    getSlides,
    wrapSubsectionContent
}