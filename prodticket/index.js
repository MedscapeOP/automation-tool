/*
Module for retrieving info that is universal to every program.
    - find...() functions 
        - These are meant to find raw HTML of the section (DONE)
    - get...() functions 
        - These are meant to proxy to the appropriate find function given a program object. (DONE) 
        - These functions also perform input validation and throw appropriate errors
            - Will help users understand where they went wrong.  
    - getPlain...() functions 
        - These are meant to format found sections into plain text 
        usable by Producers in the checklist log. 

Program-specific content and also building final XML will be 
in the articles module. 
    - EXAMPLE: articles.clinicalBrief module 
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
let findGoalStatement = require('./find-goal-statement');
let findTargetAudience = require('./find-target-audience');
let findLearningObjectives = require('./find-learning-objectives');

function checkTicket(ticketHTML) {
    if (ticketHTML) {
        return true;
    } else {
        throw Error("Badly formed prodticket html!");
    }
}

function getTitle (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawTitle = findTitle[program.codeName](ticketHTML);
        return rawTitle;
    }
}

function getByline (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawByline = findByline[program.codeName](ticketHTML);
        return rawByline;
    }
}

function getReferences (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawReferences = findReferences[program.codeName](ticketHTML);
        return rawReferences;
    }    
}

function getAbbreviations (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawAbbreviations = findAbbreviations[program.codeName](ticketHTML);
        return rawAbbreviations;
    }   
}

function getPeerReviewer (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawPeerReviewer = findPeerReviewer[program.codeName](ticketHTML);
        return rawPeerReviewer;
    }    
}

function getSlides (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var slideComponents = findSlides[program.codeName](ticketHTML, program);
        return slideComponents;
    }
}

function getGoalStatement (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var goalStatement = findGoalStatement[program.codeName](ticketHTML, program);
        return goalStatement;
    }    
}

function getTargetAudience(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var targetAudience = findTargetAudience[program.codeName](ticketHTML, program);
        return targetAudience;
    }
}

function getLearningObjectives(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var learningObjectives = findLearningObjectives[program.codeName](ticketHTML, program);
        return learningObjectives;
    }
}

module.exports = {
    getTitle,
    getByline,
    getReferences,
    getAbbreviations,
    getPeerReviewer,
    getSlides,
    getGoalStatement,
    getTargetAudience, 
    getLearningObjectives
}