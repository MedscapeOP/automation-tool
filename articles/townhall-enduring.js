const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement, SectionElement, SubsectionElement, SlideGroup, TownHallEnduringChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* SLIDES / MAIN CONTENT 
-------------------------------------- */
function getSlidesTOC (slidesComponents, program) {
    // Get Slide Component from prodticket.getSlides.
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    var slidesComponent = (slidesComponents ? slidesComponents[0] : program.articleID);

    if (program.hasLLA) {
        return {
            slidesTOC: articleUtils.buildSlidesTOC(slidesComponent, true, true, true),
            audienceQATOC: articleUtils.buildAudienceQATOC(slidesComponent)
        }
    }
    return {
        slidesTOC: articleUtils.buildSlidesTOC(slidesComponent, false, false, true),
        audienceQATOC: articleUtils.buildAudienceQATOC(slidesComponent)
    }
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
MAIN CCE: TITLE, CONTRIBUTOR PAGE INFO; TRANSCRIPT: SLIDES (TH USES DIFFERENT THUMBNAIL PATH - SEE NOTES); ABBREVIATIONS; REFERENCES; BACK MATTER; UPLOAD/LINK SLIDE DECK; AUDIENCE QNA SIDEBAR;

Main sections to include: 
    1) TITLE - COMPLETE         
    2) CONTRIBUTOR PAGE INFO - COMPLETE 
        - BYLINE: 
        - CONTRIBUTOR POST CONTENT / Peer Reviewer:             
    3) BANNER - INCOMPLETE    
    4) SLIDES CONTENT - COMPLETE  
        - CHECK SLIDE PATH - COMPLETE 
    5) PRE/POST ASSESSMENT - COMPLETE
    6) BLANK RESULTS PAGE - COMPLETE
    7) ABBREVIATIONS - COMPLETE
    8) REFERENCES - COMPLETE 
    9) AUDIENCE QNA SIDEBAR - COMPLETE  
*/
/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistTownHallEnduring(ticket, program) {
    var checklist = new TownHallEnduringChecklist();

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
function buildTownHallEnduring(ticket, program) {
    // <script type="text/javascript">var pfizFlag = "active";</script>
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
    forYourPatientMarkup,
    audienceQATOC;

    var checklistResult = checklistTownHallEnduring(ticket, program);

    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");
    byline = (checklistResult.properties.byline ? checklistResult.properties.byline.result : "");

    peerReviewer = (checklistResult.properties.peerReviewer ? checklistResult.properties.peerReviewer.result : "");

    if (program.hasLLA) {
        preAssessmentTOC = getLLAPreTOC(checklistResult.properties.goalStatement.result, program);
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }

    var tocs = getSlidesTOC(checklistResult.properties.slides.result, program);
    slidesTOC = tocs.slidesTOC;
    audienceQATOC = tocs.audienceQATOC; 

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
    finalArticle.insertTOCElement(preAssessmentTOC);
    finalArticle.insertTOCElement(slidesTOC);
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    finalArticle.insertTOCElement(abbreviationsTOC);
    finalArticle.insertTOCElement(referencesTOC);
    finalArticle.insertTOCElement(audienceQATOC);

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
    buildTownHallEnduring
}
