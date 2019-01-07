const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement, SectionElement, SubsectionElement, SlideGroup, PropertiesChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/*
Properties to Include: 
1) ArticleID - command arg 
2) Title - ticket
3) Window Title Override - ticket 
4) User Description - ticket 
5) Meta Description - ticket 
6) Questionnaire - prompt 
7) Product Name - ticket 
8) Project ID - ticket (first "Activity SF#")
9) Bucket Collections - prompt 
10) Primary Collections - prompt 
11) Supporter - ticket 
12) Publication - prompt 
*/
/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistProducer(ticket, program) {
    var checklist = new PropertiesChecklist();
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

    // LOCATION INFO 
    // <<<<<<<< PLACEHOLDER >>>>>>>>>

    // PEER REVIEWER 
    if (program.hasPeerReviewer) {
        checklist.peerReviewer.result = prodticket.getPeerReviewer(ticket, program);        
    } 

    // REFERENCES
    checklist.references.result = prodticket.getReferences(ticket, program);

    // TARGET AUDIENCE 
    checklist.targetAudience.result = prodticket.getTargetAudience(ticket, program);
    
    // TEASER
    // <<<<<<<< PLACEHOLDER >>>>>>>>>
    
    // TITLE 
    checklist.title.result = prodticket.getTitle(ticket, program);

    // COMPONENTS 
    checklist.components.result = prodticket.getComponents(ticket, program);

    // SLIDES 
    checklist.slides.result = prodticket.getSlides(ticket, program);

    // CONTRIBUTORS
    checklist.contributors.result = prodticket.getContributors(ticket, program);

    return checklist.print();
}



/* MASTER FUNCTION 
-------------------------------------- */
function buildFirstResponse(ticket, program) {
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo,
    componentsArray, 
    tableOfContentsTOC,
    slidesTOCs, 
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    forYourPatientMarkup;

    var checklistResult = checklistFirstResponse(ticket, program);

    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");
    byline = (checklistResult.properties.byline ? checklistResult.properties.byline.result : "");
    
    componentsArray = (checklistResult.properties.components ? checklistResult.properties.components.result : []);
    // BUILD TOCs 
    tableOfContentsTOC = getTableOfContentsTOC(componentsArray, program);

    // if (program.hasPeerReviewer) {
    //     peerReviewer = prodticket.getPeerReviewer(ticket, program);
    // }
    peerReviewer = (checklistResult.properties.peerReviewer ? checklistResult.properties.peerReviewer.result : "");

    if (program.hasLLA) {
        tableOfContentsTOC.insertSectionElement(getLLAPreSection(checklistResult.properties.goalStatement.result, program));
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }

    slidesTOCs = getSlidesTOCs(checklistResult.properties.slides.result, program);

    var abbreviationsMarkup = (checklistResult.properties.abbreviations ? checklistResult.properties.abbreviations.result : "");
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = (checklistResult.properties.references ? checklistResult.properties.references.result : "");
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);

    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle("SlidePresentation", program.hasOUS);
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
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
    
    return {
        finishedArticleObject: finalArticle,
        checklistHTML: checklistResult.printHTML  
    };
};

module.exports = {
    getSlidesTOCs,
    getLLAPreSection,
    getLLAPostTOC,
    buildFirstResponse
}
