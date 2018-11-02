// ------------------------------------------------------------
// PROMPTS 
// ------------------------------------------------------------
const utils = require('../utils');
const {ProfArticle} = require('../classes');

let llaPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'hasLLA',
        message: 'Is Program LLA?'                  
    });
};

let ousPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'hasOUS',
        message: `Is Program OUS?`                    
    });
};

let peerReviewerPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'hasPeerReviewer',
        message: `Has Peer Reviewer?`                    
    });
};

let collectionPagePrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'hasCollectionPage',
        message: `Has Collection Page?`                    
    });
};

let slideDeckPrompt = function (self) { 
    return self.prompt({
        type: 'confirm',
        name: 'hasSlideDeck',
        message: `Has Downloadable Slide Deck?`
    }); 
};

let forYourPatientPrompt = function (self) { 
    return self.prompt({
        type: 'confirm',
        name: 'hasForYourPatient',
        message: `Has For Your Patient PDF?`
    }); 
};

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

module.exports = {
    llaPrompt,
    ousPrompt,
    peerReviewerPrompt,
    collectionPagePrompt,
    slideDeckPrompt,
    forYourPatientPrompt,
    completeGenerateAction
}