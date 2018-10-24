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
Main sections to include: 
    1) TITLE - Built (ProfArticle)
    2) CONTRIBUTOR PAGE INFO - Built (ProfArticle)
    3) BANNER - Built (ProfArticle)
    4) CONTENT/SLIDES 
        - Built: 
            - Find and Extract from prodticket: prodticket.js 
            - Format slides and build subsection: utils
        - To Build:
            - buildSlidesTOC: (article-utils.js) 
    5) PRE/POST ASSESSMENT - Not Built (article-utils)
    6) BLANK RESULTS PAGE - Built (TOCElement)
    7) ABBREVIATIONS - Not built (article-utils)
    8) REFERENCES - Built (article-utils)
*/

const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, TOCElement} = require("../classes");
const prodticket = require('../prodticket');


/* SLIDES / MAIN CONTENT 
-------------------------------------- */
function getSlidesTOC (ticket, program) {
    // Get Slide Component from prodticket.getSlides.
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    var slidesComponent = prodticket.getSlides(ticket, program)[0];

    if (program.hasLLA) {
        return articleUtils.buildSlidesTOC(slidesComponent, true, true);
    }
    return articleUtils.buildSlidesTOC(slidesComponent, false, false);
}


/* SECTION FUNCTION  
-------------------------------------- */


/* SECTION FUNCTION2 
-------------------------------------- */


/* MASTER FUNCTION 
-------------------------------------- */
function buildSpotlight(ticket, program) {
    var clinicalContext, synopsisAndPerspective, studyHighlights, clinicalImplications, references, title, byline;
    
    // // Clinical Brief Sections
    // clinicalContext = getClinicalContext(ticket);
    // synopsisAndPerspective = getSynopsisAndPerspective(ticket);
    // studyHighlights = getStudyHighlights(ticket);
    // clinicalImplications = getClinicalImplications(ticket);
    // cmeTest = articleUtils.buildCMETestSection(3, "CME Test");

    // // Universal Info (Markup Strings)
    // references = prodticket.getReferences(ticket, program);
    // title = prodticket.getTitle(ticket, program);
    // byline = prodticket.getByline(ticket, program);
 
    // // Build Main TOC - Insert Brief Sections & Insert CME Test Section 
    // var mainTOCInstance = new TOCElement();
    // mainTOCInstance.insertSectionElement(clinicalContext);
    // mainTOCInstance.insertSectionElement(synopsisAndPerspective);
    // mainTOCInstance.insertSectionElement(studyHighlights);
    // mainTOCInstance.insertSectionElement(clinicalImplications);
    // mainTOCInstance.insertSectionElement(cmeTest);
    
    // // Build References TOC
    // var referencesTOC = articleUtils.buildReferences(references);


    // // Instantiate and Populate Article
    // var finalArticle = new ProfArticle("Article");
    // // Set article title (pass markup)
    // finalArticle.titleText = title;
    // // Set article byline (pass markup)
    // finalArticle.contrbtrByline = byline;
    // // remove existing contrbtr_pre_content
    // finalArticle.contrbtrPreContent = null;
          
    // // Insert Main TOC Object & Insert References TOC Object 
    // finalArticle.insertTOCElement(mainTOCInstance);
    // finalArticle.insertTOCElement(referencesTOC);
    return "finalArticle";
};

module.exports = {
    getSlidesTOC,
    buildSpotlight
}
