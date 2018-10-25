const languages = require('./languages');

const programs = {
    clinicalBrief: {
        name: "Clinical Brief",
        codeName: "brief",
        profArticleType: "Article",
        articleID: "",
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    },
    spotlight: {
        name: "Spotlight",
        codeName: "spotlight",
        profArticleType: "SlidePresentation",
        articleID: "901602",
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false  
    },
    curbsideConsult: {
        name: "Curbside Consult",
        codeName: "curbside",
        profArticleType: "SlidePresentation",
        articleID: "902082",
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    },
    firstResponse: {
        name: "First Response",
        codeName: "firstResponse",
        profArticleType: "SlidePresentation",
        articleID: "900319",
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    }
};

var addOns = {
    inLanguage: {
        hasTranslations: false, 
        languages: []
    },
    pdfLinks: {
        forYourPatient: false, 
        clinicianHandout: false
    }
};

module.exports = {
    programs,
    addOns,
    languages
};