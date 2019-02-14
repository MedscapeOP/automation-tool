const utils = require('../utils');
const {ProfArticle, ArticleChecklist, ProfActivity} = require('../classes');
let prompts = require('./prompts');
let callbacks = require('./callbacks');
const _ = require('lodash');

// ------------------------------------------------------------
// ACTION TEMPLATES   
// ------------------------------------------------------------
/**
 * @description - Completion logic for 'generate <program>' commmand actions 
 * @param  {} self
 * @param  {} callback
 * @param  {} functionOrArticle
 * @param  {} outputFiles
 * @param  {} completionMessage
 */
function completeGenerateAction(self, callback, functionOrArticle, checklistHTML, activityXML, outputFiles, completionMessages) {
    try {
        // Build final output function from the command module
        if (functionOrArticle instanceof ProfArticle) {
            var finishedArticleObject = functionOrArticle;
        } else if (functionOrArticle instanceof ArticleChecklist) {
            var finishedArticleObject = functionOrArticle;
        } else if (functionOrArticle instanceof ProfActivity) {
            var finishedArticleObject = functionOrArticle;
        } else {
            // CASE FOR CLINICAL BRIEF COMMAND 
            var {finishedArticleObject, checklistHTML, activityXML} = functionOrArticle(self);
        }
        
        // Write the output XML
        if (outputFiles.xmlFile) {
            // Convert to XML from JS 
            var resultXML = utils.xmlOps.objectToXMLString(finishedArticleObject.toObjectLiteral());
            resultXML = utils.cleanHTML.cleanEntities(resultXML);
            utils.cliTools.writeOutputFile(outputFiles.xmlFile, resultXML, self, completionMessages.xmlFile, callback);
        } 

        // Write the output Checklist
        if (outputFiles.checklist) {
            utils.cliTools.writeOutputFile(outputFiles.checklist, checklistHTML, self, completionMessages.checklist, callback);
        } 

        // Write the output Activity 
        if (outputFiles.activity) {
            utils.cliTools.writeOutputFile(outputFiles.activity, activityXML, self, completionMessages.activity, callback);
        }
    } catch (error) {
        self.log(error);
        callback(); 
    }  
}

/**
 * @description Full action logic using the following prompt chain: 
 * LLA -> OUS -> Peer Reviewer -> Collection Page -> Slide Deck, FYP, Build Function
 * @param  {} vorpal
 * @param  {} self
 * @param  {} callback
 * @param  {} chalk
 * @param  {} program
 * @param  {} buildFinalOutput
 * @param  {} outputFile
 */
function basicArticleAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles) {

    // Has LLA? 
    prompts.llaPrompt(self)
    .then((answers) => {
        // Has OUS?
        return callbacks.promiseCallback(self, callback, program, answers, "hasLLA", prompts.ousPrompt);
    })
    .then((answers) => {
        // Has Peer Reviewer?
        return callbacks.promiseCallback(self, callback, program, answers, "hasOUS", prompts.peerReviewerPrompt);
    })
    .then((answers) => {
        // Has Collection Page?
        return callbacks.promiseCallback(self, callback, program, answers, "hasPeerReviewer", prompts.collectionPagePrompt);
    })
    .then((answers) => {
        // Has Downloadable Slide Deck?
        return callbacks.promiseCallback(self, callback, program, answers, "hasCollectionPage", prompts.slideDeckPrompt);
    })
    .then((answers) => {
        // Has For Your Patient PDF?
        return callbacks.promiseCallback(self, callback, program, answers, "hasSlideDeck", prompts.forYourPatientPrompt);
    })
    .then((answers) => {
        // Build Final Output
        return callbacks.promiseCallback(self, callback, program, answers, "hasForYourPatient", buildFinalOutput);
    })
    .then((buildResult) => {
        self.log(program);
        vorpal.emit('client_prompt_submit', program);
        var completionMessages = {};
        completionMessages.xmlFile = `${program.name} XML created successfully! Check your output folder for the file: ${chalk.cyan(outputFiles().xmlFile)}`;
        completionMessages.checklist = `${program.name} Checklist created successfully! Check your output folder for the file: ${chalk.cyan(outputFiles().checklist)}`;
        completionMessages.activity = `${program.name} Activity created successfully! Check your output folder for the file: ${chalk.cyan(outputFiles().activity)}`;

        completeGenerateAction(self, callback, buildResult.finishedArticleObject, buildResult.checklistHTML, buildResult.activityXML, outputFiles(), completionMessages);   
    }) 
    .catch((err) => {
        self.log(err);
        callback();
    });
}

function checklistAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles, programOptions) {

    // Has LLA? 
    prompts.productTypePrompt(self, _.keys(programOptions))
    .then((answers) => {
        // Has OUS?

        return callbacks.promiseCallback(self, callback, program, answers, "productType", prompts.qnaPrompt);
    })
    .then((answers) => {
        // Has Peer Reviewer?
        program.codeName = programOptions[program.productType];
        return callbacks.promiseCallback(self, callback, program, answers, "qna", prompts.bucketCollectionPrompt);
    })
    .then((answers) => {
        // Has Collection Page?
        return callbacks.delimitedAnswerCallback(self, callback, program, answers, "bucketCollections", prompts.primaryCollectionPrompt);
    })
    .then((answers) => {
        // Has Downloadable Slide Deck?
        return callbacks.promiseCallback(self, callback, program, answers, "primaryCollection", prompts.publicationPrompt);
    })
    .then((answers) => {
        // Has For Your Patient PDF?
        return callbacks.promiseCallback(self, callback, program, answers, "publication", buildFinalOutput);
    })
    .then((buildResult) => {
        self.log(program);
        vorpal.emit('client_prompt_submit', program);
        var completionMessages = {};
        completionMessages.xmlFile = ``;
        completionMessages.checklist = `${program.name} Checklist created successfully! Check your output folder for the file: ${chalk.cyan(outputFiles().checklist)}`;

        completeGenerateAction(self, callback, buildResult.finishedArticleObject, buildResult.checklistHTML, "", outputFiles(), completionMessages);   
    }) 
    .catch((err) => {
        self.log(err);
        callback();
    });
}


module.exports = {
    completeGenerateAction,
    basicArticleAction,
    checklistAction
}