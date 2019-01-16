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
const {ProfArticle, TOCElement, SectionElement, SubsectionElement, SlideGroup, SpotlightChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* SLIDES / MAIN CONTENT 
-------------------------------------- */
function getSlidesTOC (slidesComponents, program) {
    // Assign slideComponent 
        // If slideComponents is truthy grab the first element in array 
        // If slideComponents is falsy assign the articleID 
        // buildSlidesTOC is able to use articleID instead 
    var slidesComponent = (slidesComponents ? slidesComponents[0] : program.articleID);
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    if (program.hasLLA) {
        return articleUtils.buildSlidesTOC(slidesComponent, true, true, true);
    }
    return articleUtils.buildSlidesTOC(slidesComponent, false, false, true);
}


/* LLA PRE TOC   
-------------------------------------- */
function getLLAPreTOC(goalStatementMarkup, program) {
    // var goalStatementMarkup = prodticket.getGoalStatement(ticket, program);
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
    /*
    var result = {
        title: null, 
        byline: null,
        learningObjectives: null,
        goalStatement: null,
        targetAudience: null,
        contributors: null, 
        peerReviewer: null,
        collectionPageInfo: null,
        slides: null,
        abbreviations: null,
        references: null,
        downloadableSlideDeck: null,
        contrbtrPreContent: null,
        cpyrtHolder: null,
        bkmtrFront: null 
    };
    Implement checklist...() functions. These should try to call the required prodticket get functions and assign the results to an ArticleChecklist instance. If an error is thrown set properties[prop].result to null. After finding results, call the instance's print method and output result.printHTML into .html file. Lastly, return the result.properties object that stores the results of these calls.  
    */
    var checklist = new SpotlightChecklist();

    // ABBREVIATIONS
    checklist.abbreviations.result = prodticket.getAbbreviations(ticket, program);
    
    // BACKMATTER FRONT PAGE      
    checklist.bkmtrFront.result = utils.wrapSubsectionContent(snippets.backmatter.backmatterFrontPage(program));

    // BYLINE
    checklist.byline.result = prodticket.getByline(ticket, program);

    // COLLECTION PAGE 
    if (program.hasCollectionPage) {
        checklist.collectionPageInfo.result = prodticket.getCollectionPage(ticket, program);
    }

    // CONTRIBUTOR PRE CONTENT (CONTENT ABOVE CONTRIBS)
    checklist.contrbtrPreContent.result = utils.wrapSubsectionContent(snippets.preContent.contrbtrPreContentMarkup(program));

    // COPYRIGHT HOLDER 
    checklist.cpyrtHolder.result = utils.wrapSubsectionContent(snippets.copyrightHolder.copyrightHolderMarkup(program));

    // CREDITS AVAILABLE 
    // <<<<<<<< PLACEHOLDER >>>>>>>>>

    // DOWNLOADABLE SLIDES 
    checklist.downloadableSlides.result = snippets.downloadableSlides(program.articleID);

    // GOAL STATEMENT
    checklist.goalStatement.result = prodticket.getGoalStatement(ticket, program);
    
    // LEARNING OBJECTIVES
    checklist.learningObjectives.result = prodticket.getLearningObjectives(ticket, program);

    // PEER REVIEWER 
    if (program.hasPeerReviewer) {
        checklist.peerReviewer.result = prodticket.getPeerReviewer(ticket, program);
    } 

    // REFERENCES
    checklist.references.result = prodticket.getReferences(ticket, program);

    // SUPPORTER
    // <<<<<<<< PLACEHOLDER >>>>>>>>>

    // TARGET AUDIENCE 
    checklist.targetAudience.result = prodticket.getTargetAudience(ticket, program);
    
    // TEASER
    // <<<<<<<< PLACEHOLDER >>>>>>>>>

    // TITLE 
    checklist.title.result = prodticket.getTitle(ticket, program);

    // SLIDES 
    checklist.slides.result = prodticket.getSlides(ticket, program);
    
    // CONTRIBUTORS
    checklist.contributors.result = prodticket.getContributors(ticket, program);

    return checklist.print();
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
    forYourPatientMarkup;

    var checklistResult = checklistSpotlight(ticket, program);

    // title = prodticket.getTitle(ticket, program);
    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");
    
    // byline = prodticket.getByline(ticket, program);
    byline = (checklistResult.properties.byline ? checklistResult.properties.byline.result : "");
    
    // if (program.hasPeerReviewer) {
    //     peerReviewer = prodticket.getPeerReviewer(ticket, program);
    // } 
    peerReviewer = (checklistResult.properties.peerReviewer ? checklistResult.properties.peerReviewer.result : "");


    if (program.hasLLA) {
        preAssessmentTOC = getLLAPreTOC(checklistResult.properties.goalStatement.result, program);
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }

    slidesTOC = getSlidesTOC(checklistResult.properties.slides.result, program); 

    var abbreviationsMarkup = (checklistResult.properties.abbreviations ? checklistResult.properties.abbreviations.result : "");
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = (checklistResult.properties.references ? checklistResult.properties.references.result : "");
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);
    
    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle("SlidePresentation", program.hasOUS);
    // Set article title (pass text)
    finalArticle.title = title;
    // Set article byline (pass text)
    finalArticle.contrbtrByline = byline;
    // insert peer reviewer
    finalArticle.contrbtrPostContent = peerReviewer;
    // set contrbtr_pre_content
    finalArticle.contrbtrPreContent = checklistResult.properties.contrbtrPreContent.result;
    // set copyright holder 
    finalArticle.cpyrtHolder = checklistResult.properties.cpyrtHolder.result;
    // set backmatter front page 
    finalArticle.bkmtrFront = checklistResult.properties.bkmtrFront.result;

    // insert collection page info - Banner image and Above title
    collectionPageInfo = (checklistResult.properties.collectionPageInfo ? checklistResult.properties.collectionPageInfo.result : null);
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
    
    return {
        finishedArticleObject: finalArticle,
        checklistHTML: checklistResult.printHTML  
    };
};

module.exports = {
    getSlidesTOC,
    getLLAPreTOC,
    getLLAPostTOC,
    buildSpotlight
}
