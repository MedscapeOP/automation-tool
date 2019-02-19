const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, ProfActivity, TOCElement, SectionElement, SubsectionElement, SlideGroup, TownHallEnduringChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* MAIN CONTENT 
-------------------------------------- */
function buildContentTOC (articleComponent) {
    return new TOCElement();
}

function getMainContentTOCs (articleComponents, program) {

/* 
TT_Transcript: CREATE QUESTION TOC ELEMENTS (1 FOR: EACH QUESTION FORM); CREATE SUBSECTIONS FOR TEXT BLOCKS; CREATE SUBSECTIONS FOR TABLES AND FIGURES; POST ASSESSMENT; BLANK RESULTS PAGE; ABBREVIATIONS; REFERENCES; BACK MATTER; INSERT FIGURES; INSERT PATIENT CASE IMAGES; FORMAT AND INSERT HTML TABLES;
*/
    // Get Slide Component from prodticket.getSlides.
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    var mainTOCs = [];
    for (var i = 0; i < articleComponents.length; i++) {
        mainTOCs.push(buildContentTOC(articleComponents[i]));
    }

    return {
        mainTOCs: mainTOCs
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

/* ACTIVITY FUNCTION  
-------------------------------------- */
function activityTestAndTeach(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers) {
    // console.log("CME REVIEWERS: ", cmeReviewers);
    var activityInstance = new ProfActivity(title, program.hasOUS);
    activityInstance.targetAudience = targetAudience; // Text field

    learningObjectives = `<p><p>Upon completion of this activity, participants will:</p>` + learningObjectives + "</p>";

    activityInstance.learningObjectives =  learningObjectives; // unwrapped markup
    activityInstance.goalStatement = utils.cleanHTML.plainText(goalStatement);
    
    activityInstance.miscProviderStatement = snippets.activity.medscapeProviderStatement(program);

    activityInstance.creditInstructions = snippets.activity.instructionsForCredit(program);

    activityInstance.hardwareRequirements = snippets.activity.hardwareRequirements();

    activityInstance.additionalCreditAvailable = snippets.activity.additionalCreditAvailable();

    var contributorGroups = articleUtils.buildContributorGroups(cmeReviewers);

    for (var i = 0; i < contributorGroups.length; i++) {       
        activityInstance.insertContributorGroup(contributorGroups[i]);
    }

    return activityInstance.toFinalXML();
}

/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistTestAndTeach(ticket, program) {
    var checklist = new TestAndTeachChecklist();

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

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticket, program);

    return checklist.print();
}



/* MASTER FUNCTION 
-------------------------------------- */
function buildTestAndTeach(ticket, program) {
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
    audienceQATOC,
    targetAudience, 
    goalStatement,
    learningObjectives,
    cmeReviewers;

    var checklistResult = checklistTestAndTeach(ticket, program);

    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");
    byline = (checklistResult.properties.byline ? checklistResult.properties.byline.result : "");

    peerReviewer = (checklistResult.properties.peerReviewer ? checklistResult.properties.peerReviewer.result : "");

    targetAudience = (checklistResult.properties.targetAudience ? checklistResult.properties.targetAudience.result : "");

    goalStatement = (checklistResult.properties.goalStatement ? checklistResult.properties.goalStatement.result : "");

    learningObjectives = (checklistResult.properties.learningObjectives ? checklistResult.properties.learningObjectives.result : "");

    learningObjectives = utils.formatLearningObjectives(learningObjectives);    

    if (program.hasLLA) {
        preAssessmentTOC = getLLAPreTOC(goalStatement, program);
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

    cmeReviewers = (checklistResult.properties.cmeReviewers ? checklistResult.properties.cmeReviewers.result : "");
          
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

    var activityXML = activityTestAndTeach(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers);

    return {
        finishedArticleObject: finalArticle,
        checklistHTML: checklistResult.printHTML,
        activityXML: activityXML  
    };
};

module.exports = {
    getMainContentTOCs,
    getLLAPreTOC,
    getLLAPostTOC,
    buildTestAndTeach
}
