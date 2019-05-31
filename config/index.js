const languages = require('./languages');
const credentials = require('./credentials');
const dates = require('./dates');
const cmeAuthors = require('./cme-authors');
const collectionPages = require('./collection-pages');

const transcriptTypes = ["Slides", "Text"];

let programs = {
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
        hasTranscript: true, 
        transcriptType: transcriptTypes[0],
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
        hasTranscript: true, 
        transcriptType: transcriptTypes[0],
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    },
    videoLecture: {
        name: "Video Lecture",
        codeName: "video",
        profArticleType: "SlidePresentation",
        articleID: "902082",
        hasTranscript: true, 
        transcriptType: transcriptTypes[0],
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
        hasTranscript: true, 
        transcriptType: transcriptTypes[0],
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    },
    townHall: {
        name: "Town Hall",
        codeName: "townHall",
        profArticleType: "SlidePresentation",
        articleID: "903975",
        hasTranscript: true, 
        transcriptType: transcriptTypes[0],
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    },
    testAndTeach: {
        name: "Test and Teach",
        codeName: "testAndTeach",
        profArticleType: "Article",
        articleID: "902362",
        hasTranscript: true, 
        hasLLA: false,
        hasOUS: false, 
        hasPeerReviewer: false, 
        hasCollectionPage: false,
        hasSlideDeck: false, 
        hasForYourPatient: false, 
        hasInLanguage: false 
    }
};

let propertiesChecklist = {
    name: "Checklist for Producer D2 Properties",
    codeName: "townHall",
    articleID: "",
    codeName: null,
    questionnaire: null,
    bucketCollections: [],
    primaryCollection: null,
    publication: null 
}

let addOns = {    
    forYourPatient: false, 
    clinicianHandout: false
};

module.exports = {
    programs,
    addOns,
    languages,
    credentials,
    dates,
    propertiesChecklist,
    cmeAuthors,
    collectionPages,
    transcriptTypes
};