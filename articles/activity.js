const _ = require("lodash");
const utils = require("../utils");
const stringOps = utils.stringOps;
const articleUtils = require('./article-utils');
const {ProfActivity} = require("../classes");
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


module.exports = {
    activityClinicalBrief
};