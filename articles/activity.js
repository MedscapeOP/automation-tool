const _ = require("lodash");
const utils = require("../utils");
const stringOps = utils.stringOps;
const articleUtils = require('./article-utils');
const {ProfActivity, ActivityChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* ACTIVITY FUNCTION CLINICAL BRIEF 
-------------------------------------- */
function activityClinicalBrief(program, title, targetAudience, learningObjectives, cmeReviewers) {
    var activityInstance = new ProfActivity(title, program.hasOUS);
    activityInstance.targetAudience = targetAudience; // Text field

    learningObjectives = `<p><p>Upon completion of this activity, participants will be able to:</p>` + learningObjectives + "</p>";

    activityInstance.learningObjectives =  learningObjectives; // unwrapped markup
    activityInstance.goalStatement = snippets.activity.goalStatementCB();
    
    activityInstance.miscProviderStatement = snippets.activity.medscapeProviderStatement(program);

    activityInstance.creditInstructions = snippets.activity.instructionsForCredit(program);

    activityInstance.hardwareRequirements = snippets.activity.hardwareRequirements();

    activityInstance.additionalCreditAvailable = snippets.activity.additionalCreditAvailable();

    var contributorGroups = articleUtils.buildContributorGroups(cmeReviewers);

    for (var i = 0; i < contributorGroups.length; i++) {       
        activityInstance.insertContributorGroup(contributorGroups[i]);
    }

    return activityInstance.toFinalXML();
}


/* ACTIVITY FUNCTION  
-------------------------------------- */
function activity(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers) {
    // console.log("CME REVIEWERS: ", cmeReviewers);
    var activityInstance = new ProfActivity(title, program.hasOUS);
    activityInstance.targetAudience = targetAudience; // Text field

    learningObjectives = `<p><p>Upon completion of this activity, participants will:</p>` + learningObjectives + "</p>";

    activityInstance.learningObjectives =  learningObjectives; // unwrapped markup
    activityInstance.goalStatement = utils.cleanHTML.plainText(goalStatement);
    
    activityInstance.miscProviderStatement = snippets.activity.medscapeProviderStatement(program);

    activityInstance.creditInstructions = snippets.activity.instructionsForCredit(program);

    activityInstance.hardwareRequirements = snippets.activity.hardwareRequirements();

    activityInstance.additionalCreditAvailable = snippets.activity.additionalCreditAvailable();

    var contributorGroups = articleUtils.buildContributorGroups(cmeReviewers);

    for (var i = 0; i < contributorGroups.length; i++) {       
        activityInstance.insertContributorGroup(contributorGroups[i]);
    }

    return activityInstance.toFinalXML();
}


/* ACTIVITY BUILDER  
-------------------------------------- */
function buildActivity(ticketHTML, program) {
    var checklist = new ActivityChecklist();

    // TITLE 
    checklist.title.result = prodticket.getTitle(ticketHTML, program);

    // TARGET AUDIENCE 
    checklist.targetAudience.result = prodticket.getTargetAudience(ticketHTML, program);
    
    // GOAL STATEMENT 
    checklist.goalStatement.result = prodticket.getGoalStatement(ticketHTML, program);
    
    // LEARNING OBJECTIVES 
    checklist.learningObjectives.result = prodticket.getLearningObjectives(ticketHTML, program);

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticketHTML, program);

    var checklistResult = checklist.print();

    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");

    targetAudience = (checklistResult.properties.targetAudience ? checklistResult.properties.targetAudience.result : "");

    goalStatement = (checklistResult.properties.goalStatement ? checklistResult.properties.goalStatement.result : "");

    learningObjectives = (checklistResult.properties.learningObjectives ? checklistResult.properties.learningObjectives.result : "");

    learningObjectives = utils.formatLearningObjectives(learningObjectives); 

    cmeReviewers = (checklistResult.properties.cmeReviewers ? checklistResult.properties.cmeReviewers.result : "");

    return activity(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers);
}


/* CLINICAL BRIEF ACTIVITY BUILDER  
-------------------------------------- */
function buildActivityCB(ticketHTML, program) {
    var checklist = new ActivityChecklist();

    // TITLE 
    checklist.title.result = prodticket.getTitle(ticketHTML, program);

    // TARGET AUDIENCE 
    checklist.targetAudience.result = prodticket.getTargetAudience(ticketHTML, program);
    
    // LEARNING OBJECTIVES 
    checklist.learningObjectives.result = prodticket.getLearningObjectives(ticketHTML, program);

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticketHTML, program);

    var checklistResult = checklist.print();

    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");

    targetAudience = (checklistResult.properties.targetAudience ? checklistResult.properties.targetAudience.result : "");

    goalStatement = (checklistResult.properties.goalStatement ? checklistResult.properties.goalStatement.result : "");

    learningObjectives = (checklistResult.properties.learningObjectives ? checklistResult.properties.learningObjectives.result : "");

    learningObjectives = utils.formatLearningObjectives(learningObjectives); 

    cmeReviewers = (checklistResult.properties.cmeReviewers ? checklistResult.properties.cmeReviewers.result : "");

    return activityClinicalBrief(program, title, targetAudience, learningObjectives, cmeReviewers);
}

module.exports = {
    activityClinicalBrief,
    activity,
    buildActivity, 
    buildActivityCB 
};