const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, ProfActivity, TOCElement, SectionElement, SubsectionElement, SlideGroup, TownHallEnduringChecklist, SlideComponent} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const config = require('../config');
const activity = require('./activity').activity;


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
            fullAudioSidebarTOC: articleUtils.buildSidebarVideoTOC(slidesComponent, "XXXXXX", "Full Live Event Audio", 2)
        }
    }
    return {
        slidesTOC: articleUtils.buildSlidesTOC(slidesComponent, false, false, true),
        fullAudioSidebarTOC: articleUtils.buildSidebarVideoTOC(slidesComponent, "XXXXXX", "Full Live Event Audio", 2)
    }
}

function getVideoTOC (componentOrArticleID, program) {
    return {
        videoTOC: articleUtils.buildVideoEmbedTOC(componentOrArticleID, program.hasLLA),
        fullAudioSidebarTOC: articleUtils.buildSidebarVideoTOC(null, program.articleID, "Full Live Event Audio", 2)
    }
}

function getTranscriptTOC (transcript, program) {
    return articleUtils.buildTranscriptTOC(transcript);
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
    
    // SLIDES / TRANSCRIPT  
    if (program.hasTranscript) {
        if (program.transcriptType === config.transcriptTypes[0]) {
            checklist.slides.result = prodticket.getSlides(ticket, program);
        } else if (program.transcriptType === config.transcriptTypes[1]) {
            checklist.transcript.result = prodticket.getArticleContent(ticket, program);
        }
    }

 
    // CONTRIBUTORS
    checklist.contributors.result = prodticket.getContributors(ticket, program);

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticket, program);

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
    contentTOC,
    transcriptTOC,
    preAssessmentTOC, 
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    forYourPatientMarkup,
    fullAudioSidebarTOC,
    targetAudience, 
    goalStatement,
    learningObjectives,
    cmeReviewers;

    var checklistResult = checklistTownHallEnduring(ticket, program);

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

    var tocs = null; 
    var mainVideoComponent = new SlideComponent(program.articleID, 1, "").toObjectLiteral();
    // console.log(mainVideoComponent);
    if (checklistResult.properties.slides) {
        // Put SlidesTOC (which includes video) As Content
        // Also build AudienceQA
        // No Transcript Sidebar
        tocs = getSlidesTOC(checklistResult.properties.slides.result, program);
        // slidesTOC = tocs.slidesTOC;
        contentTOC = tocs.slidesTOC; 
        fullAudioSidebarTOC = tocs.fullAudioSidebarTOC; 
        transcriptTOC = null;
    } else if (checklistResult.properties.transcript) {
        // Put VideoTOC As Content
        // Also build AudienceQA
        // Also build Transcript Sidebar
        tocs = getVideoTOC(mainVideoComponent, program);
        contentTOC = tocs.videoTOC;  
        fullAudioSidebarTOC = tocs.fullAudioSidebarTOC;
        transcriptTOC = getTranscriptTOC(checklistResult.properties.transcript.result, program);
    } else {
        // Put VideoTOC As Content
        // Also build AudienceQA
        // No Transcript Sidebar
        tocs = getVideoTOC(mainVideoComponent, program);
        contentTOC = tocs.videoTOC;  
        fullAudioSidebarTOC = tocs.fullAudioSidebarTOC;
        transcriptTOC = null;
    }
    

    var abbreviationsMarkup = (checklistResult.properties.abbreviations ? checklistResult.properties.abbreviations.result : "");
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = (checklistResult.properties.references ? checklistResult.properties.references.result : "");
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);
    

    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle(program.profArticleType, program.hasOUS);
    // Set article title (pass text)
    finalArticle.title = title;
    // Set article byline (pass text)
    finalArticle.contrbtrByline = byline;
    // insert peer reviewer and disclosure 
    // set contrbtr_post_content with Medscape disclosure
    peerReviewer = peerReviewer.replace("<div>", "");
    finalArticle.contrbtrPostContent = `<div>${snippets.activity.medscapeDisclosure()} ${peerReviewer}`;
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
        finalArticle.insertAboveTitleCollection(collectionPageInfo);
    } 

    cmeReviewers = (checklistResult.properties.cmeReviewers ? checklistResult.properties.cmeReviewers.result : "");
          
    // Insert Main TOC Objects  
    finalArticle.insertTOCElement(preAssessmentTOC);
    finalArticle.insertTOCElement(contentTOC);
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    if (transcriptTOC) {
        finalArticle.insertTOCElement(transcriptTOC);
    }
    finalArticle.insertTOCElement(abbreviationsTOC);
    finalArticle.insertTOCElement(referencesTOC);
    finalArticle.insertTOCElement(fullAudioSidebarTOC);

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

    var activityXML = activity(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers);

    return {
        finishedArticleObject: finalArticle,
        checklistHTML: checklistResult.printHTML,
        activityXML: utils.cleanHTML.cleanEntities(activityXML)    
    };
};

module.exports = {
    getTranscriptTOC,
    getSlidesTOC,
    getLLAPreTOC,
    getLLAPostTOC,
    buildTownHallEnduring
}
