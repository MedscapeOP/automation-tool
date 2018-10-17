const _ = require("lodash");
const utils = require("../utils");
const {TOCElement, SectionElement, SubsectionElement, SlideGroup} = require("../classes");

/* DONE */
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

/* DONE */
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

/* DONE */
function buildBlankTOC() {
    var slideGroup = new SlideGroup("", "", true, false);
    slideGroup.sectionImage = null;
    slideGroup.sectionLabel = null;
    slideGroup.sectionAltText = null;

    var subsectionInstance = new SubsectionElement(true, false, false);

    subsectionInstance.insertSlideGroup(slideGroup);
    
    var sectionInstance = new SectionElement();
    sectionInstance.insertSubsectionElement(subsectionInstance);

    var tocInstance = new TOCElement();
    tocInstance.insertSectionElement(sectionInstance);
    return tocInstance;
}

function buildSlidesTOC() {

}

function buildEduImpactPreSection () {

}

function buildEduImpactPostSection () {
    
}

function buildLLAPreTOC() {
    var llaPreSubsection = new SubsectionElement(false, true, false);
    
    var llaPreSection = new SectionElement();
    llaPreSection.insertSubsectionElement(llaPreSubsection);

    var llaPreTOC = new TOCElement();
    llaPreTOC.insertSectionElement(llaPreSection);
    return llaPreTOC;
}

function buildLLAPostTOC() {
    var llaPostSubsection = new SubsectionElement(false, true, false);
    
    var llaPostSection = new SectionElement();
    llaPostSection.insertSubsectionElement(llaPostSubsection);

    var llaPostTOC = new TOCElement();
    llaPostTOC.insertSectionElement(llaPostSection);
    return llaPostTOC;
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

function buildAbbreviations(abbreviationsMarkup) {

}

module.exports = {
    buildSection,
    buildCMETestSection,
    buildBlankTOC,
    buildSlidesTOC,
    buildEduImpactPreSection,
    buildEduImpactPostSection,
    buildLLAPreTOC,
    buildLLAPostTOC,
    buildReferences,
    buildAbbreviations
};