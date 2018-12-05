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
const {ProfArticle, TOCElement} = require("../classes");
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
    textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.paragraph);
    // build the actual section element
    return articleUtils.buildSection(textBlock, label);
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
    textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.paragraph);
    // build the actual section element
    return articleUtils.buildSection(textBlock, label);
}


/* STUDY HIGHLIGHTS 
-------------------------------------- */
function getStudyHighlights (ticket) {
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket,
        "Study Highlights",
        "Clinical Implications"
    );
    textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.unorderedList);
    return articleUtils.buildSection(textBlock, label);
}


/* CLINICAL IMPLICATIONS
-------------------------------------- */
function getClinicalImplications(ticket) {
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket,
        "Clinical Implications",
        "CME Post Test Questions"
    );
    textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.unorderedList);
    return articleUtils.buildSection(textBlock, label);
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