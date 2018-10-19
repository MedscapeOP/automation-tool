/*
Module for retrieving info that is universal to every program.
    - find...() functions 
        - These are meant to find raw HTML of the section
    - getFormatted...() functions 
        - These are meant to format found sections into the HTML required by our programs. 
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

function getGoalStatement (ticketHTML, program) {
    var goalStatement = findGoalStatement[program.codeName](ticketHTML, program);
    return goalStatement;
}

function getTargetAudience(ticketHTML, program) {
    var targetAudience = findTargetAudience[program.codeName](ticketHTML, program);
    return targetAudience;
}

function getLearningObjectives(ticketHTML, program) {
    var learningObjectives = findLearningObjectives[program.codeName](ticketHTML, program);
    return learningObjectives;
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