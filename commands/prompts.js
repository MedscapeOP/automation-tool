// ------------------------------------------------------------
// PROMPTS 
// ------------------------------------------------------------

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

let productTypePrompt = function (self, programNames) { 
    return self.prompt({
        type: 'list',
        name: 'productType',
        message: `Choose the product type?`,
        choices: programNames
    }); 
};

let qnaPrompt = function (self) { 
    return self.prompt({
        type: 'input',
        name: 'questionnaire',
        message: `Enter the questionnaire ID:`
    }); 
};

let bucketCollectionPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'bucketCollections',
        message: 'Enter bucket collections (comma delimited):'
    });
};

let primaryCollectionPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'primaryCollection',
        message: 'Enter the primary collection:'
    });
};

let publicationPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'publication',
        message: "Fill Publication (None for Pat Ed, Medscape, specialty. No bots for OUS):"
    });
};


module.exports = {
    llaPrompt,
    ousPrompt,
    peerReviewerPrompt,
    collectionPagePrompt,
    slideDeckPrompt,
    forYourPatientPrompt,
    productTypePrompt,
    qnaPrompt,
    bucketCollectionPrompt,
    primaryCollectionPrompt,
    publicationPrompt
}