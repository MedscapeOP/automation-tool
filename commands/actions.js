const utils = require('../utils');
const {ProfArticle} = require('../classes');
let prompts = require('./prompts');
let callbacks = require('./callbacks');

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
function completeGenerateAction(self, callback, functionOrArticle, checklistHTML, outputFiles, completionMessages) {
    try {
        // Build final output function from the command module
        if (functionOrArticle instanceof ProfArticle) {
            var finishedArticleObject = functionOrArticle;
        } else {
            var {finishedArticleObject, checklistHTML} = functionOrArticle(self);
        }
        // Convert to XML from JS 
        var resultXML = utils.xmlOps.objectToXMLString(finishedArticleObject.toObjectLiteral());
        resultXML = utils.cleanHTML.cleanEntities(resultXML);
        
        // Write the output XML 
        utils.cliTools.writeOutputFile(outputFiles.xmlFile, resultXML, self, completionMessages.xmlFile, callback);

        // Write the output Checklist 
        utils.cliTools.writeOutputFile(outputFiles.checklist, checklistHTML, self, completionMessages.checklist, callback);
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

        completeGenerateAction(self, callback, buildResult.finishedArticleObject, buildResult.checklistHTML, outputFiles(), completionMessages);   
    }) 
    .catch((err) => {
        self.log(err);
        callback();
    });
}

module.exports = {
    completeGenerateAction,
    basicArticleAction
}