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
 * @param  {} outputFile
 * @param  {} completionMessage
 */
function completeGenerateAction(self, callback, functionOrArticle, outputFile, completionMessage) {
    try {
        // Build final output function from the command module
        if (functionOrArticle instanceof ProfArticle) {
            var finishedArticleObject = functionOrArticle;
        } else {
            var finishedArticleObject = functionOrArticle(self);
        }
        // Convert to XML from JS 
        var result = utils.xmlOps.objectToXMLString(finishedArticleObject.toObjectLiteral());
        result = utils.cleanHTML.cleanEntities(result);
        // Write the output file 
        utils.cliTools.writeOutputFile(outputFile, result, self, completionMessage, callback);
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
function basicArticleAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFile) {

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
    .then((finishedArticleObject) => {
        self.log(program);
        vorpal.emit('client_prompt_submit', program);
        var completionMessage = `${program.name} created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
        completeGenerateAction(self, callback, finishedArticleObject, outputFile(), completionMessage);   
    }) 
    .catch((err) => {
        self.log(err.message);
        callback();
    });
}

module.exports = {
    completeGenerateAction,
    basicArticleAction
}