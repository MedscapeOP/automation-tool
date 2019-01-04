/*
Make Ability to Do Variations of Headlines 
- Known Variants: 
    - Clinical Context --> ''
    - Study Synopsis and Perspective --> Synopsis and Perspective
    - Study Highlights --> Recommendation Highlights
    - Clinical Implications --> ''
*/

const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement, BriefChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/* CLINICAL CONTEXT 
-------------------------------------- */
function getClinicalContext(ticket) {
    // Get XML string from prod ticket.
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket, 
        "Clinical Context", 
        "Study Synopsis"
    );

    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        return new Error("Clinical Context not found in the prodticket");
    } else {
        textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.paragraph);
        // build the actual section element
        return articleUtils.buildSection(textBlock, label);
    }
}


/* STUDY SYNOPSIS AND PERSPECTIVE  
-------------------------------------- */
function getSynopsisAndPerspective(ticket) {
    // Get XML string from prod ticket.
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket, 
        "Study Synopsis and Perspective", 
        "Study Highlights"
    );
    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        return new Error("Synopsis and Perspective not found in the prodticket");
    } else {
        textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.paragraph);
        // build the actual section element
        return articleUtils.buildSection(textBlock, label);
    }
}


/* STUDY HIGHLIGHTS 
-------------------------------------- */
function getStudyHighlights (ticket) {
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket,
        "Study Highlights",
        "Clinical Implications"
    );
    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        return new Error("Study Highlights not found in the prodticket");
    } else {
        textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.unorderedList);
        return articleUtils.buildSection(textBlock, label);
    }
}


/* CLINICAL IMPLICATIONS
-------------------------------------- */
function getClinicalImplications(ticket) {
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket,
        "Clinical Implications",
        "CME Post Test Questions"
    );
    if (stringOps.isBlankOrWhiteSpace(textBlock) || stringOps.isEmptyString(textBlock)) {
        return new Error("Clinical Implications not found in the prodticket");
    } else {
        textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.unorderedList);
        return articleUtils.buildSection(textBlock, label);
    }
}


/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistClinicalBrief(ticket, program) {
    var checklist = new BriefChecklist();
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
    
    // GOAL STATEMENT
    checklist.goalStatement.result = prodticket.getGoalStatement(ticket, program);
    
    // LEARNING OBJECTIVES
    checklist.learningObjectives.result = prodticket.getLearningObjectives(ticket, program);
    
    // REFERENCES
    checklist.references.result = prodticket.getReferences(ticket, program);
    
    // SUPPORTER
    // <<<<<<<< PLACEHOLDER >>>>>>>>>
    
    // TEASER
    // <<<<<<<< PLACEHOLDER >>>>>>>>> 
    
    // TARGET AUDIENCE 
    checklist.targetAudience.result = prodticket.getTargetAudience(ticket, program);
    
    // TITLE 
    checklist.title.result = prodticket.getTitle(ticket, program);

    // CLINICAL CONTEXT
    checklist.clinicalContext.result = getClinicalContext(ticket);

    // SYNOPSIS AND PERSPECTIVE 
    checklist.synopsisAndPerspective.result = getSynopsisAndPerspective(ticket);

    // STUDY HIGHLIGHTS 
    checklist.studyHighlights.result = getStudyHighlights(ticket);

    // CLINICAL IMPLICATIONS 
    checklist.clinicalImplications.result = getClinicalImplications(ticket);

    return checklist.print();
}


/* MASTER FUNCTIONS 
-------------------------------------- */
function buildClinicalBrief(ticket, program) {
    var clinicalContext, synopsisAndPerspective, studyHighlights, clinicalImplications, references, title, byline;
    
    // Clinical Brief Sections
    clinicalContext = getClinicalContext(ticket);
    synopsisAndPerspective = getSynopsisAndPerspective(ticket);
    studyHighlights = getStudyHighlights(ticket);
    clinicalImplications = getClinicalImplications(ticket);
    cmeTest = articleUtils.buildCMETestSection(3, "CME Test");

    // Universal Info (Markup Strings)
    references = prodticket.getReferences(ticket, program);
    title = prodticket.getTitle(ticket, program);
    byline = prodticket.getByline(ticket, program);
 
    // Build Main TOC - Insert Brief Sections & Insert CME Test Section 
    var mainTOCInstance = new TOCElement();
    mainTOCInstance.insertSectionElement(clinicalContext);
    mainTOCInstance.insertSectionElement(synopsisAndPerspective);
    mainTOCInstance.insertSectionElement(studyHighlights);
    mainTOCInstance.insertSectionElement(clinicalImplications);
    mainTOCInstance.insertSectionElement(cmeTest);
    
    // Build References TOC
    var referencesTOC = articleUtils.buildReferences(references, program);


    // Instantiate and Populate Article
    var finalArticle = new ProfArticle("Article", program.hasOUS);
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
    finalArticle.contrbtrByline = byline;
    // set contrbtr_pre_content
    finalArticle.contrbtrPreContent = utils.wrapSubsectionContent(snippets.preContent.contrbtrPreContentMarkup(program));
    // set copyright holder 
    finalArticle.cpyrtHolder = utils.wrapSubsectionContent(snippets.copyrightHolder.copyrightHolderMarkup(program));
    // set backmatter front page 
    finalArticle.bkmtrFront = utils.wrapSubsectionContent(snippets.backmatter.backmatterFrontPage(program));
          
    // Insert Main TOC Object & Insert References TOC Object 
    finalArticle.insertTOCElement(mainTOCInstance);
    finalArticle.insertTOCElement(referencesTOC);
    return finalArticle;
};

module.exports = {
    getSynopsisAndPerspective,
    getClinicalContext,
    getStudyHighlights,
    getClinicalImplications,
    buildClinicalBrief
}