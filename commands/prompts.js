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

module.exports = {
    llaPrompt,
    ousPrompt,
    peerReviewerPrompt,
    collectionPagePrompt,
    slideDeckPrompt,
    forYourPatientPrompt
}