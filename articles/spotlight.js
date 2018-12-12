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
const {ProfArticle, TOCElement, SectionElement, SubsectionElement, SlideGroup} = require("../classes");
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

/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistSpotlight(ticket, program) {
    var result = {
        title: null, 
        byline: null,
        peerReviewer: null,
        collectionPageInfo: null,
        slides: null,
        abbreviations: null,
        references: null,
        slideDeckDiv: null,
        forYourPatientMarkup: null
    };

    result.title = prodticket.getTitle(ticket, program);
    result.byline = prodticket.getByline(ticket, program);
    if (program.hasPeerReviewer) {
        result.peerReviewer = prodticket.getPeerReviewer(ticket, program);
    } 
    if (program.hasCollectionPage) {
        result.collectionPageInfo = prodticket.getCollectionPage(ticket, program);
    }
    /*
    CHECKLIST PRINT FUNCTION 
        For each property in result 
            - If property.result is instance of Error 
                - Make the output string = error.message 
            - Else             
                - Call the properties' print function (which uses the result). 
    */

    result.slides = prodticket.getSlides(ticket, program);
    result.abbreviations = prodticket.getAbbreviations(ticket, program);

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
    // set copyright holder 
    finalArticle.cpyrtHolder = utils.wrapSubsectionContent(snippets.copyrightHolder.copyrightHolderMarkup(program));
    // set backmatter front page 
    finalArticle.bkmtrFront = utils.wrapSubsectionContent(snippets.backmatter.backmatterFrontPage(program));
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
        // console.log("FINAL ARTICLE CHILD ELEMENTS: ", finalArticle._childElements[0]._childElements[0]);
        var forYourPatientSubsection = new SubsectionElement(true, false, false);
        
        if (program.hasLLA) {
            var slideGroup = new SlideGroup('', '', true, false);
            slideGroup.sectionImage = null;
            slideGroup.sectionLabel = null;
            slideGroup.sectionAltText = null;
            slideGroup.qnaForm = 3;
            forYourPatientSubsection.insertSlideGroup(slideGroup);
            finalArticle._childElements[0]._childElements[0]._childElements[0]._childElements = [];
        }

        forYourPatientSubsection.subsectionContent = utils.wrapSlideIntro(forYourPatientMarkup);

        finalArticle._childElements[0]._childElements[0].insertSubsectionElement(forYourPatientSubsection); 
    }
    
    return finalArticle;
}


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
    var finalArticle = new ProfArticle("SlidePresentation", program.hasOUS);
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
    finalArticle.contrbtrByline = byline;
    // insert peer reviewer
    finalArticle.contrbtrPostContent = peerReviewer;
    // set contrbtr_pre_content
    finalArticle.contrbtrPreContent = utils.wrapSubsectionContent(snippets.preContent.contrbtrPreContentMarkup(program));
    // set copyright holder 
    finalArticle.cpyrtHolder = utils.wrapSubsectionContent(snippets.copyrightHolder.copyrightHolderMarkup(program));
    // set backmatter front page 
    finalArticle.bkmtrFront = utils.wrapSubsectionContent(snippets.backmatter.backmatterFrontPage(program));
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
        // console.log("FINAL ARTICLE CHILD ELEMENTS: ", finalArticle._childElements[0]._childElements[0]);
        var forYourPatientSubsection = new SubsectionElement(true, false, false);
        
        if (program.hasLLA) {
            var slideGroup = new SlideGroup('', '', true, false);
            slideGroup.sectionImage = null;
            slideGroup.sectionLabel = null;
            slideGroup.sectionAltText = null;
            slideGroup.qnaForm = 3;
            forYourPatientSubsection.insertSlideGroup(slideGroup);
            finalArticle._childElements[0]._childElements[0]._childElements[0]._childElements = [];
        }

        forYourPatientSubsection.subsectionContent = utils.wrapSlideIntro(forYourPatientMarkup);

        finalArticle._childElements[0]._childElements[0].insertSubsectionElement(forYourPatientSubsection); 
    }
    
    return finalArticle;
};

module.exports = {
    getSlidesTOC,
    getLLAPreTOC,
    getLLAPostTOC,
    buildSpotlight
}
