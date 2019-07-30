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
let findCollectionPageInfo = require('./find-collection-page-info');
let findContributors = require('./find-contributors'); 
let findReferences = require('./find-references');
let findAbbreviations = require('./find-abbreviations');
let findPeerReviewer = require('./find-peer-reviewer');
let findSlides = require('./find-slides');
let findGoalStatement = require('./find-goal-statement');
let findTargetAudience = require('./find-target-audience');
let findLearningObjectives = require('./find-learning-objectives');
let findComponents = require('./find-components');
let findActivityOverview = require('./find-activity-overview');
let findTeaser = require('./find-teaser');
let findAccreditation = require('./find-accreditation-statement');
let findSupporter = require('./find-supporter');
let findCreditsAvailable = require('./find-credits-available');
let findCreditStatements = require('./find-credit-statements');
let findLocationInfo = require('./find-location-info');
let findDateTime = require('./find-date-time');
let findProgramDetails = require('./find-program-details');
let findAssociationDisclaimer = require('./find-association-disclaimer');
let findProductName = require('./find-product-name');
let findProjectId = require('./find-project-id');
let findCMEReviewers = require('./find-cme-reviewers');
let findArticleContent = require('./find-article-content');

function checkTicket(ticketHTML) {
    if (ticketHTML) {
        return true;
    } else {
        throw Error("Badly formed prodticket html!");
    }
}

function getTitle (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawTitle = findTitle[program.codeName](ticketHTML);
            return rawTitle;            
        } catch (error) {
            return error;
        }
    }
}

function getByline (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawByline = findByline[program.codeName](ticketHTML);
            return rawByline;
        } catch (error) {
            return error;
        }
    }
}

function getContributors(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawContributors = findContributors[program.codeName](ticketHTML);
            return rawContributors;
        } catch (error) {
            return error; 
        }
    }
}

function getCMEReviewers(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawReviewers = findCMEReviewers[program.codeName](ticketHTML, program);
            return rawReviewers;
        } catch (error) {
            return error; 
        }
    }
}

function getReferences (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawReferences = findReferences[program.codeName](ticketHTML);
            return rawReferences;
        } catch (error) {
            return error; 
        }
    }    
}

function getAbbreviations (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawAbbreviations = findAbbreviations[program.codeName](ticketHTML);
            return rawAbbreviations;
        } catch (error) {
            return error; 
        }
    }   
}

function getPeerReviewer (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawPeerReviewer = findPeerReviewer[program.codeName](ticketHTML);
            return `<div>${rawPeerReviewer}</div>`;
        } catch (error) {
            return error; 
        }
    }    
}

function getSlides (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var slideComponents = findSlides[program.codeName](ticketHTML, program);
            return slideComponents;            
        } catch (error) {
            return error;
        }
    }
}

function getGoalStatement (ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var goalStatement = findGoalStatement[program.codeName](ticketHTML, program);
            return goalStatement;            
        } catch (error) {
            return error;
        }
    }    
}

function getTargetAudience(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var targetAudience = findTargetAudience[program.codeName](ticketHTML, program);
            return targetAudience;
        } catch (error) {
            return error; 
        }
    }
}

function getLearningObjectives(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var learningObjectives = findLearningObjectives[program.codeName](ticketHTML, program);
            return learningObjectives;
        } catch (error) {
            return error;
        }
    }
}

function getCollectionPage(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var collectionPageObject = findCollectionPageInfo[program.codeName](ticketHTML, program);
            return collectionPageObject;
        } catch (error) {
            return error;
        }
    }
}

function getComponents(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var components = findComponents[program.codeName](ticketHTML, program);
            return components;
        } catch (error) {
            return error;
        }
    }
}

function getActivityOverview(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawActivityOverview = findActivityOverview[program.codeName](ticketHTML);
            return rawActivityOverview;
        } catch (error) {
            return error;
        }
    } 
}

function getTeaser(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {            
            var rawTeaser = findTeaser[program.codeName](ticketHTML);
            return rawTeaser;
        } catch (error) {
            return error;
        }
    } 
}

function getAccreditation(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawCreditStatement = findAccreditation[program.codeName](ticketHTML);
            return rawCreditStatement;
        } catch (error) {
            return error; 
        }
    } 
}

function getSupporter(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawSupporter = findSupporter[program.codeName](ticketHTML);
            return rawSupporter;
        } catch (error) {
            return error;
        }
    } 
}

function getCreditsAvailable(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawCreditsAvailable = findCreditsAvailable[program.codeName](ticketHTML);
            return rawCreditsAvailable;
        } catch (error) {
            return error;
        }
    } 
}

function getCreditStatements(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawCreditStatements = findCreditStatements[program.codeName](ticketHTML);
            return rawCreditStatements;
        } catch (error) {
            return error;
        }
    } 
}

function getLocationInfo(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawLocationInfo = findLocationInfo[program.codeName](ticketHTML);
            return rawLocationInfo;
        } catch (error) {
            return error;
        }
    } 
}

function getDateTime(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawDateTime = findDateTime[program.codeName](ticketHTML);
            return rawDateTime;
        } catch (error) {
            return error;
        }
    } 
}

function getProgramDetails(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawProgramDetails = findProgramDetails[program.codeName](ticketHTML);
            return rawProgramDetails;
        } catch (error) {
            return error;
        }
    } 
}

function getAssociationDisclaimer(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawDisclaimer = findAssociationDisclaimer[program.codeName](ticketHTML);
            return rawDisclaimer;
        } catch (error) {
            return error;
        }
    } 
}

function getProductType(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawProductName = findProductName[program.codeName](ticketHTML);
            return rawProductName;
        } catch (error) {
            return error; 
        }
    }
}

function getProjectId(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {
            var rawProjectId = findProjectId[program.codeName](ticketHTML);
            return rawProjectId;
        } catch (error) {
            return error;
        }
    }
}

function getArticleContent(ticketHTML, program) {
    if (checkTicket(ticketHTML)) {
        try {   
            var rawContent = findArticleContent[program.codeName](ticketHTML);
            return rawContent;
        } catch (error) {
            return error;
        }
    }
}

module.exports = {
    getTitle,
    getByline,
    getContributors,
    getCMEReviewers,
    getReferences,
    getAbbreviations,
    getPeerReviewer,
    getSlides,
    getGoalStatement,
    getTargetAudience, 
    getLearningObjectives,
    getCollectionPage,
    getComponents, 
    getActivityOverview,
    getTeaser,
    getAccreditation,
    getSupporter,
    getCreditsAvailable,
    getCreditStatements,
    getLocationInfo,
    getDateTime,
    getProgramDetails,
    getAssociationDisclaimer,
    getProductType,
    getProjectId,
    getArticleContent
}