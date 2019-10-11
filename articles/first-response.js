const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, ProfActivity, TOCElement, SectionElement, SubsectionElement, SlideGroup, FirstResponseChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const config = require('../config');
const activity = require('./activity').activity;


/* TABLE OF CONTENTS TOC   
-------------------------------------- */
function getTableOfContentsTOC(componentsArray, program) {
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
function getSlidesTOCs (slidesComponents, program, components) {
    var slideTOCs = [];
    
    var hasEduImpact = program.hasLLA;

    for (var i = 0; i < slidesComponents.length; i++) {            
        if (i == slidesComponents.length - 1) { 
            slideTOCs.push(articleUtils.buildSlidesTOC(slidesComponents[i], true, hasEduImpact, true));
        } else {
            slideTOCs.push(articleUtils.buildSlidesTOC(slidesComponents[i], true, false, false));
        }
    }
    
    for (var i = 0; i < components.length; i++) {
        // Insert Section Header here
        slideTOCs[i]._childElements[0].sectionHeader = components[i].title;
    }
    return slideTOCs;
}

function getVideoTOCs (components, program) {
    var videoTOCs = [];

    var hasEduImpact = program.hasLLA;

    var videoTOC = null;
    for (var i = 0; i < components.length; i++) {
        if (i == components.length - 1) {
            // Insert Section Header here
            videoTOC = articleUtils.buildVideoEmbedTOC(components[i], hasEduImpact);
            videoTOC._childElements[0].sectionHeader = components[i].title;
            videoTOCs.push(videoTOC);
        } else {
            // Insert Section Header here
            videoTOC = articleUtils.buildVideoEmbedTOC(components[i], false);
            videoTOC._childElements[0].sectionHeader = components[i].title;
            // console.log(videoTOC._childElements[0]);
            videoTOCs.push(videoTOC);
        }
    }
    return videoTOCs;
}

function getTranscriptTOC (transcript, program) {
    return articleUtils.buildTranscriptTOC(transcript);
}


/* LLA PRE TOC   
-------------------------------------- */
function getLLAPreSection(goalStatementMarkup, program) {
    return articleUtils.buildEduImpactPreSection(3, goalStatementMarkup);
}


/* LLA POST TOC  
-------------------------------------- */
function getLLAPostTOC(ticket, program) {
    return articleUtils.buildLLAPostTOC();
}


/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistFirstResponse(ticket, program) {
    var checklist = new FirstResponseChecklist();
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
function buildFirstResponse(ticket, program) {
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo,
    componentsArray, 
    tableOfContentsTOC,
    contentTOCs,
    transcriptTOC,  
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    forYourPatientMarkup,
    targetAudience, 
    goalStatement,
    learningObjectives,
    cmeReviewers;

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

    targetAudience = (checklistResult.properties.targetAudience ? checklistResult.properties.targetAudience.result : "");

    goalStatement = (checklistResult.properties.goalStatement ? checklistResult.properties.goalStatement.result : "");

    learningObjectives = (checklistResult.properties.learningObjectives ? checklistResult.properties.learningObjectives.result : "");

    learningObjectives = utils.formatLearningObjectives(learningObjectives);

    if (program.hasLLA) {
        tableOfContentsTOC.insertSectionElement(getLLAPreSection(goalStatement, program));
        postAssessmentTOC = getLLAPostTOC(ticket, program);
        blankResultsTOC = articleUtils.buildBlankTOC();
    }

    
    if (checklistResult.properties.slides) {
        contentTOCs = getSlidesTOCs(checklistResult.properties.slides.result, program, componentsArray); 
        transcriptTOC = null;
    } else if (checklistResult.properties.transcript) {
        contentTOCs = getVideoTOCs(componentsArray, program);
        transcriptTOC = getTranscriptTOC(checklistResult.properties.transcript.result, program);
    } else {
        contentTOCs = getVideoTOCs(componentsArray, program);
        transcriptTOC = null;
    }

    /* DEBUGGING */
    // var slideTOCMarkup = "";

    // for (var i = 0; i < slidesTOCs.length; i++) {
    //     slideTOCMarkup += utils.xmlOps.objectToXMLString(slidesTOCs[i].toObjectLiteral());
    // }
    // // console.log("SLIDES TOCS: ", slideTOCMarkup);
    /* END DEBUGGING */ 

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
    finalArticle.insertTOCElement(tableOfContentsTOC);
    for (var i = 0; i < contentTOCs.length; i++) {
        finalArticle.insertTOCElement(contentTOCs[i]);
    }
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    if (transcriptTOC) {
        finalArticle.insertTOCElement(transcriptTOC);
    }
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
    

    var activityXML = activity(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers);

    return {
        finishedArticleObject: finalArticle,
        checklistHTML: checklistResult.printHTML,
        activityXML: utils.cleanHTML.cleanEntities(activityXML)  
    };
};

module.exports = {
    getSlidesTOCs,
    getTranscriptTOC,
    getLLAPreSection,
    getLLAPostTOC,
    buildFirstResponse
}
