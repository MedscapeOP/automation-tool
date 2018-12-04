const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement, SectionElement, SubsectionElement, SlideGroup} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* TABLE OF CONTENTS TOC   
-------------------------------------- */
function getTableOfContentsTOC(ticket, program) {
    var componentsArray = prodticket.getComponents(ticket, program);
    return articleUtils.buildTableOfContentsTOC(componentsArray, program);
}


/* SLIDES / MAIN CONTENT 
-------------------------------------- */
/**
 * @description - Get Slide Component from prodticket.getSlides.
 * Check's if LLA 
 * If LLA --> builds slides with Video embed AND Edu Impact challenge 
 * @param {*} ticket 
 * @param {*} program 
 */
function getSlidesTOCs (ticket, program) {
    var slidesComponents = prodticket.getSlides(ticket, program);

    var slideTOCs = [];
    
    var hasEduImpact = program.hasLLA;

    for (var i = 0; i < slidesComponents.length; i++) {            
        if (i == slidesComponents.length - 1) {
            slideTOCs.push(articleUtils.buildSlidesTOC(slidesComponents[i], true, hasEduImpact, true));
        } else {
            slideTOCs.push(articleUtils.buildSlidesTOC(slidesComponents[i], true, false, false));
        }
    }
    return slideTOCs;
}


/* LLA PRE TOC   
-------------------------------------- */
function getLLAPreSection(ticket, program) {
    var goalStatementMarkup = prodticket.getGoalStatement(ticket, program);
    return articleUtils.buildEduImpactPreSection(3, goalStatementMarkup);
}


/* LLA POST TOC  
-------------------------------------- */
function getLLAPostTOC(ticket, program) {
    return articleUtils.buildLLAPostTOC();
}


/*
Main sections to include: 
    1) TITLE - COMPLETE         
    2) CONTRIBUTOR PAGE INFO - COMPLETE 
        - BYLINE: 
        - CONTRIBUTOR POST CONTENT / Peer Reviewer:             
    3) BANNER - INCOMPLETE    
    4) SLIDES CONTENT - COMPLETE  
    5) PRE/POST ASSESSMENT - COMPLETE
    6) BLANK RESULTS PAGE - COMPLETE
    7) ABBREVIATIONS - COMPLETE
    8) REFERENCES - COMPLETE 
*/
/* MASTER FUNCTION 
-------------------------------------- */
function buildFirstResponse(ticket, program) {
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo, 
    tableOfContentsTOC,
    slidesTOCs, 
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    slideDeckDiv,
    forYourPatientMarkup;

    title = prodticket.getTitle(ticket, program);
    byline = prodticket.getByline(ticket, program);
    
    
    // BUILD TOCs 
    tableOfContentsTOC = getTableOfContentsTOC(ticket, program);

    if (program.hasPeerReviewer) {
        peerReviewer = prodticket.getPeerReviewer(ticket, program);
    } 
    if (program.hasCollectionPage) {
        collectionPageInfo = prodticket.getCollectionPage(ticket, program);
    }
    if (program.hasLLA) {
        tableOfContentsTOC.insertSectionElement(getLLAPreSection(ticket, program));
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }


    slidesTOCs = getSlidesTOCs(ticket, program); 
    var abbreviationsMarkup = prodticket.getAbbreviations(ticket, program);
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = prodticket.getReferences(ticket, program);
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);

    slideDeckDiv = snippets.downloadableSlides(program.articleID);
    

    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle("SlidePresentation", program.hasOUS);
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
    finalArticle.contrbtrByline = byline;
    // insert peer reviewer
    finalArticle.contrbtrPostContent = peerReviewer;
    // set contrbtr_pre_content
    finalArticle.contrbtrPreContent = utils.wrapSubsectionContent(snippets.preContent.contrbtrPreContentMarkup(program));
    // insert collection page info - Banner image and Above title
    if (collectionPageInfo) {
        finalArticle.bannerImage = collectionPageInfo.bannerFileName;
        finalArticle.insertAboveTitleCA(collectionPageInfo.title, collectionPageInfo.advancesFileName);
    } 
          
    // Insert Main TOC Objects  
    finalArticle.insertTOCElement(tableOfContentsTOC);
    for (var i = 0; i < slidesTOCs.length; i++) {
        finalArticle.insertTOCElement(slidesTOCs[i]);
    }
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    finalArticle.insertTOCElement(abbreviationsTOC);
    finalArticle.insertTOCElement(referencesTOC);

    // Addons 
    if (program.hasForYourPatient) {
        forYourPatientMarkup = snippets.forYourPatient(program.articleID, "For Your Patient", `${program.articleID}_ForYourPatient.pdf`);
        // console.log("FINAL ARTICLE CHILD ELEMENTS: ", finalArticle._childElements[0]._childElements[0]);
        var forYourPatientSubsection = new SubsectionElement(true, false, false);
        
        if (program.hasLLA) {
            // if LLA and for your patient 
            // create empty slide group with qna form 3 
            var slideGroup = new SlideGroup('', '', true, false);
            slideGroup.sectionImage = null;
            slideGroup.sectionLabel = null;
            slideGroup.sectionAltText = null;
            slideGroup.qnaForm = 3;
            forYourPatientSubsection.insertSlideGroup(slideGroup);

            // Remove the qna slide group from the EduImpactSubsection
            // The LLA qna is now going to be with the PDF subsection.
            finalArticle._childElements[0]._childElements[0]._childElements[0]._childElements = [];
        }         
        forYourPatientSubsection.subsectionContent = utils.wrapSlideIntro(forYourPatientMarkup);

        finalArticle._childElements[0]._childElements[0].insertSubsectionElement(forYourPatientSubsection); 
    }
    
    return finalArticle;
};

module.exports = {
    getSlidesTOCs,
    getLLAPreSection,
    getLLAPostTOC,
    buildFirstResponse
}
