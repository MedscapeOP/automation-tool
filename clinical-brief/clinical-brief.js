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
const {ProfArticle, TOCElement, SectionElement, SubsectionElement} = require("../classes");
const prodticket = require('../prodticket');


function buildSection(textBlock, label) {
    // Use package to convert XML string to JS object
    // var subsectionContent = utils.xmlOps.xmlStringToJS(textBlock);

    var subsectionContent = textBlock;

    // Return instance of section for use in master BUILD function
    var sectionInstance = new SectionElement();
    var subsectionInstance = new SubsectionElement();
    sectionInstance.sectionHeader = label;
    subsectionInstance.subsectionContent = (subsectionContent);
    sectionInstance.insertSubsectionElement(subsectionInstance);
    return sectionInstance;
}

function buildCMETestSection(qnaFormNumber, label) {
    // Return instance of section for use in master BUILD function
    var sectionInstance = new SectionElement();
    var subsectionInstance = new SubsectionElement(false, true);
    sectionInstance.sectionHeader = label;
    // subsectionInstance.subsectionContent = (subsectionContent);
    subsectionInstance.qnaForm = qnaFormNumber;
    sectionInstance.insertSubsectionElement(subsectionInstance);
    return sectionInstance;
}

function buildReferences(referencesMarkup) {
    var referencesSubsection = new SubsectionElement(false, true, false);
    referencesSubsection.subsectionContent = utils.wrapSubsectionContent(referencesMarkup);
    
    var referencesSection = new SectionElement();
    referencesSection.insertSubsectionElement(referencesSubsection);
    
    var referencesTOC = new TOCElement("References");
    referencesTOC.insertSectionElement(referencesSection);
    return referencesTOC;
}

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
    return buildSection(textBlock, label);
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
    return buildSection(textBlock, label);
}

function getStudyHighlights (ticket) {
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket,
        "Study Highlights",
        "Clinical Implications"
    );
    textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.unorderedList);
    return buildSection(textBlock, label);
}

function getClinicalImplications(ticket) {
    var {textBlock, label} = utils.stringOps.getTextBlock(
        ticket,
        "Clinical Implications",
        "CME Post Test Questions"
    );
    textBlock = utils.wrapSubsectionContent(textBlock, utils.cleanHTML.unorderedList);
    return buildSection(textBlock, label);
}

function buildClinicalBrief(ticket, program) {
    var clinicalContext, synopsisAndPerspective, studyHighlights, clinicalImplications, references, title, byline;
    
    // Clinical Brief Sections
    clinicalContext = getClinicalContext(ticket);
    synopsisAndPerspective = getSynopsisAndPerspective(ticket);
    studyHighlights = getStudyHighlights(ticket);
    clinicalImplications = getClinicalImplications(ticket);
    cmeTest = buildCMETestSection(3, "CME Test");

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
    var referencesTOC = buildReferences(references);


    // Instantiate and Populate Article
    var finalArticle = new ProfArticle("Article");
    // Set article title (pass markup)
    finalArticle.titleText = title;
    // Set article byline (pass markup)
    finalArticle.contrbtrByline = byline;
    // remove existing contrbtr_pre_content
    finalArticle.contrbtrPreContent = null;
          
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