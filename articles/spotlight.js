/*
    Main algorithm 
    - read in string file of prodticket
        - write functions to grab each important piece of the ticket.
        - plug in content programmatically via JS object properties. 
    - Grabbing pieces of the prod ticket (DONE **** )
        - get starting index of chunk using indexOf()
        - get ending index 
        - get substrings using indeces 
        - clean the html 
        - wrap the html 
        - turn string into JS object 
        - Take JS object and turn into xml
        - Take xml and write to file. 
    - Build Final XML file in one master function  
        - This function calls other functions that build each 
        section/subsection    
            - use get...() functions previously defined to get subsections 
        - Create instances of TOC elements as needed
            - Insert subsections and sections as needed
*/

const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement, OutputVersion} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* SLIDES / MAIN CONTENT 
-------------------------------------- */
function getSlidesTOC (ticket, program) {
    // Get Slide Component from prodticket.getSlides.
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    var slidesComponent = prodticket.getSlides(ticket, program)[0];

    if (program.hasLLA) {
        return articleUtils.buildSlidesTOC(slidesComponent, true, true, true);
    }
    return articleUtils.buildSlidesTOC(slidesComponent, false, false, true);
}


/* LLA PRE TOC   
-------------------------------------- */
function getLLAPreTOC(ticket, program) {
    var goalStatementMarkup = prodticket.getGoalStatement(ticket, program);
    return articleUtils.buildLLAPreTOC(goalStatementMarkup);
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
function buildSpotlight(ticket, program) {
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo, 
    slidesTOC, 
    preAssessmentTOC, 
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    slideDeckDiv,
    forYourPatientMarkup;

    title = prodticket.getTitle(ticket, program);
    byline = prodticket.getByline(ticket, program);
    if (program.hasPeerReviewer) {
        peerReviewer = prodticket.getPeerReviewer(ticket, program);
    } 
    if (program.hasCollectionPage) {
        collectionPageInfo = prodticket.getCollectionPage(ticket, program);
    }
    if (program.hasLLA) {
        preAssessmentTOC = getLLAPreTOC(ticket, program);
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }

    slidesTOC = getSlidesTOC(ticket, program); 
    var abbreviationsMarkup = prodticket.getAbbreviations(ticket, program);
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = prodticket.getReferences(ticket, program);
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);

    slideDeckDiv = snippets.downloadableSlides(program.articleID);
    

    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle("SlidePresentation");
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
    finalArticle.contrbtrByline = byline;
    // remove existing contrbtr_pre_content
    finalArticle.contrbtrPreContent = null;
    // insert peer reviewer
    finalArticle.contrbtrPostContent = peerReviewer;
    // insert collection page info - Banner image and Above title
    if (collectionPageInfo) {
        finalArticle.bannerImage = collectionPageInfo.bannerFileName;
        finalArticle.insertAboveTitleCA(collectionPageInfo.title, collectionPageInfo.advancesFileName);
    } 
          
    // Insert Main TOC Objects  
    finalArticle.insertTOCElement(preAssessmentTOC);
    finalArticle.insertTOCElement(slidesTOC);
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    finalArticle.insertTOCElement(abbreviationsTOC);
    finalArticle.insertTOCElement(referencesTOC);

    // Addons 
    if (program.hasForYourPatient) {
        forYourPatientMarkup = snippets.forYourPatient(program.articleID, "For Your Patient", `${program.articleID}_ForYourPatient.pdf`);        
    }
    
    return finalArticle;
};

module.exports = {
    getSlidesTOC,
    getLLAPreTOC,
    getLLAPostTOC,
    buildSpotlight
}
