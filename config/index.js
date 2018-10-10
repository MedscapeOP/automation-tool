const programs = {
    clinicalBrief: {
        name: "Clinical Brief",
        codeName: "brief",
        profArticleType: "Article"
    },
    spotlight: {
        name: "Spotlight",
        codeName: "spotlight",
        profArticleType: "SlidePresentation" 
    },
    curbsideConsult: {
        name: "Curbside Consult",
        codeName: "curbside",
        profArticleType: "SlidePresentation"
    },
    firstResponse: {
        name: "First Response",
        codeName: "firstResponse",
        profArticleType: "SlidePresentation"
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