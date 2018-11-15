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
let findContributors = require('./find-contributors'); 
let findReferences = require('./find-references');
let findAbbreviations = require('./find-abbreviations');
let findPeerReviewer = require('./find-peer-reviewer');
let findSlides = require('./find-slides');
let findGoalStatement = require('./find-goal-statement');
let findTargetAudience = require('./find-target-audience');
let findLearningObjectives = require('./find-learning-objectives');
let findComponents = require('./find-components');

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
    } else {
        return "TITLE IS BAD";
    }
}

function getByline (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawByline = findByline[program.codeName](ticketHTML);
        return rawByline;
    }
}

function getContributors(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        var rawContributors = findContributors[program.codeName](ticketHTML);
        return rawContributors;
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
        return `<div>${rawPeerReviewer}</div>`;
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

function getCollectionPage(ticketHTML, program) {
    /* 
        Should return the collection page as an object 
        - APPROACH:
            - Check Prodticket for Is there a collection Page?
                - If yes move on otherwise return null 
            - Get the Type and URL from the Prodticket and update 
              result object.  
                - Check Prodticket for Is there a collection Page?
                - If yes move on otherwise return null 
            - Then complete the result object properties using one of the strategies below. 

            Strategy 1: Build internal database of collection pages that we pull from to extract data.  

            Strategy 2: Should request the collection page URL if there is one and extract necessary info (banner image filename, title, & type).
            - Make request using axios to the URL 
            - Take the response object and search it for: 
                - the first instance of <title> 
                    - This will be the title of the collection page.
            - Return a Promise object to handle async issues         

    */
    return {
        type: "Clinical Advances", 
        url: "https://www.medscape.org/sites/advances/anticoagulation-thrombosis",
        title: "Clinical Advances in Anticoagulation Management and Vascular Protection",
        bannerFileName: "33543-collection-header.png",
        advancesFileName: "anticoagulation-thrombosis" 
    };
}

function getComponents(ticketHTML, program) {
    var components = findComponents[program.codeName](ticketHTML, program);
    return components;
}

module.exports = {
    getTitle,
    getByline,
    getContributors,
    getReferences,
    getAbbreviations,
    getPeerReviewer,
    getSlides,
    getGoalStatement,
    getTargetAudience, 
    getLearningObjectives,
    getCollectionPage,
    getComponents
}