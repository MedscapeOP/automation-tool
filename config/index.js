const programs = {
    clinicalBrief: {
        name: "Clinical Brief",
        codeName: "brief",
        profArticleType: "Article",
        articleID: ""
    },
    spotlight: {
        name: "Spotlight",
        codeName: "spotlight",
        profArticleType: "SlidePresentation",
        articleID: "901602" 
    },
    curbsideConsult: {
        name: "Curbside Consult",
        codeName: "curbside",
        profArticleType: "SlidePresentation",
        articleID: "902082"
    },
    firstResponse: {
        name: "First Response",
        codeName: "firstResponse",
        profArticleType: "SlidePresentation",
        articleID: "900319"
    }
}

// USE CLIP INSTEAD OF CONFLUENCE TO BUILD OBJECT
// Put required code snippets inside of language object
var languages = {
    french: {
        expertCommentary: false, 
        downloadablePDF: false,
        transcriptPDF: false, 
        subtitles: false
    }
}

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