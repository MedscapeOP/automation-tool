const _ = require("lodash");
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const utils = require("../utils");
const buildSlides = require('./build-slides');
const {TOCElement, SectionElement, SubsectionElement, SlideGroup, SlideComponent} = require("../classes");

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


/* DONE */
function buildSlidesTOC(slidesComponent, videoEmbed=false, eduImpactSubsection=false, isLastComponent=false) {
    // BUILD: Main TOC Element 
    var slidesTOC = new TOCElement();

    // BUILD: Main Section Element 
    var slidesSection = new SectionElement();

    // BUILD: Main Slides Subsection
    var subsectionElement = new SubsectionElement(true, false, false);
    var slidesSubsection = buildSlides(slidesComponent.rawSlides, subsectionElement, slidesComponent.slidePath);

    // console.log("SLIDES SUBSECTION: ", slidesSubsection.toObjectLiteral().elements[0].elements[3].elements[3].elements);

    // Insert Video Embed - If necessary 
    if (videoEmbed) {
        slidesSubsection.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(slidesComponent));
    } 

    if (isLastComponent) {
        var lastSlideGroup = new SlideGroup(slidesComponent.slidePath, "undefined");
        lastSlideGroup.sectionImage = null;
        lastSlideGroup.sectionLabel = null;
        lastSlideGroup.sectionAltText = null;
        lastSlideGroup.sectionText = `<p><em>This content has been condensed for improved clarity.</em></p>`;

        // Push last slide_grp onto subsection element 
        slidesSubsection.insertSlideGroup(lastSlideGroup);
    }

    // INSERT: Main Slides Subsection
    slidesSection.insertSubsectionElement(slidesSubsection);

    // INSERT: Educational Impact Subsection - If necessary 
    if (eduImpactSubsection) {
        var eduImpactSubsection = new SubsectionElement(true, false, false);
        eduImpactSubsection.subsectionHeader = "Educational Impact Challenge";
        eduImpactSubsection.subsectionContent = utils.wrapSlideIntro(`<p>What did you learn from this activity? Please click on the “Next” button to proceed to a brief survey to see how your knowledge improved after the education. You can also see how your answers compare with those of your peers.</p>`);
        slidesSection.insertSubsectionElement(eduImpactSubsection);
    }

    // INSERT: Main Section
    slidesTOC.insertSectionElement(slidesSection);
    return slidesTOC;
}

/* DONE */
function buildEduImpactPreSection (qnaFormNumber, goalStatementMarkup) {
    // Set up slide group with QNA form #
    var slideGroup = new SlideGroup('', '', true, false);
    slideGroup.sectionImage = null;
    slideGroup.sectionLabel = null;
    slideGroup.sectionAltText = null;
    slideGroup.qnaForm = qnaFormNumber;    

    // Insert goal statement + "before you begin..."
    var subsection = new SubsectionElement(true, false, false);
    subsection.subsectionContent =  utils.wrapSubsectionContent(`${goalStatementMarkup}<p>Before you begin this activity, please assess your clinical knowledge by completing this brief survey. Answering these questions again after the activity will allow you to see what you learned and to compare your answers with those of your peers.</p>`);

    // Insert "Educational Impact Challenge" header 
    var eduImpactPreSection = new SectionElement(false, false);
    eduImpactPreSection.sectionHeader = "Educational Impact Challenge";

    subsection.insertSlideGroup(slideGroup);
    eduImpactPreSection.insertSubsectionElement(subsection);
    return eduImpactPreSection;
}

/* DONE */
function buildEduImpactPostSection (qnaFormNumber) {
    // Set up slide group with QNA form #
    var slideGroup = new SlideGroup('', '', true, false);
    slideGroup.sectionImage = null;
    slideGroup.sectionLabel = null;
    slideGroup.sectionAltText = null;
    slideGroup.qnaForm = qnaFormNumber;    

    // Insert goal statement + "before you begin..."
    var subsection = new SubsectionElement(true, false, false);

    // Insert "Educational Impact Challenge" header 
    var eduImpactPreSection = new SectionElement(false, false);
    eduImpactPreSection.sectionHeader = "Educational Impact Challenge";

    subsection.insertSlideGroup(slideGroup);
    eduImpactPreSection.insertSubsectionElement(subsection);
    return eduImpactPreSection;
}

/* DONE */
function buildLLAPreTOC(goalStatementMarkup) {
    var llaPreSection = buildEduImpactPreSection(3, goalStatementMarkup);

    var llaPreTOC = new TOCElement();
    llaPreTOC.insertSectionElement(llaPreSection);
    return llaPreTOC;
}

/* DONE */
function buildLLAPostTOC() {
    var llaPostSection = buildEduImpactPostSection(4);

    var llaPostTOC = new TOCElement();
    llaPostTOC.insertSectionElement(llaPostSection);
    return llaPostTOC;
}

/* DONE */
function buildReferences(referencesMarkup, program) {
    if (program.profArticleType == "SlidePresentation") {
        var referencesSubsection = new SubsectionElement(true, false, false);
        referencesSubsection.subsectionContent = utils.wrapSlideIntro(referencesMarkup);
    } else {
        var referencesSubsection = new SubsectionElement(false, false, false);
        referencesSubsection.subsectionContent = utils.wrapSubsectionContent(referencesMarkup);
    }
    
    var referencesSection = new SectionElement();
    referencesSection.insertSubsectionElement(referencesSubsection);
    
    var referencesTOC = new TOCElement("References");
    referencesTOC.insertSectionElement(referencesSection);
    return referencesTOC;
}

/* DONE */
function buildAbbreviations(abbreviationsMarkup, program) {
    // console.log("ABBRV MARKUP: ", abbreviationsMarkup);
    if (program.profArticleType == "SlidePresentation") {
        var abbreviationsSubsection = new SubsectionElement(true, false, false);
        abbreviationsSubsection.subsectionContent = utils.wrapSlideIntro(abbreviationsMarkup);
    } else {
        var abbreviationsSubsection = new SubsectionElement(false, false, false);
        abbreviationsSubsection.subsectionContent = utils.wrapSubsectionContent(abbreviationsMarkup);
    }
    // console.log("ABBRV MARKUP: ", utils.wrapSubsectionContent(abbreviationsMarkup));

    var abbreviationsSection = new SectionElement();
    abbreviationsSection.sectionHeader = "Abbreviations";

    var abbreviationsTOC = new TOCElement("Sidebar");
    abbreviationsTOC.tocLabel = "Abbreviations";

    abbreviationsSection.insertSubsectionElement(abbreviationsSubsection);
    abbreviationsTOC.insertSectionElement(abbreviationsSection);
    return abbreviationsTOC;
}

function buildTableOfContentsTOC(componentsArray, program) {
    // BUILD: Main TOC Element 
    var tableOfContentsTOC = new TOCElement();

    // BUILD: Main Section Element 
    var tableOfContentsSection = new SectionElement();

    // BUILD: Main Subsection
    var subsectionElement = new SubsectionElement(true, false, false);
    var mainContent = utils.wrapSlideIntro(snippets.tableOfContents(componentsArray, program.articleID));

    // console.log("MAIN CONTENT: ", mainContent);
    subsectionElement.subsectionContent = mainContent;

    if (program.hasOUS) {
        subsectionElement.subsectionHeader = 'Contents of This CPD Activity';
    } else {
        subsectionElement.subsectionHeader = 'Contents of This CME Activity';
    }

    // console.log("SLIDES SUBSECTION: ", slidesSubsection.toObjectLiteral().elements[0].elements[3].elements[3].elements);

    // INSERT: Main Slides Subsection
    tableOfContentsSection.insertSubsectionElement(subsectionElement);

    // INSERT: Main Section
    tableOfContentsTOC.insertSectionElement(tableOfContentsSection);
    return tableOfContentsTOC;    
} 

function buildAudienceQATOC(slidesComponent) {
    // - It just has an extra Sidebar, Audience Q&A where you need to embed video code video code is provided in media info in custom forms
    // - Use a normal LLA-style video embed. 
   // BUILD: Main TOC Element 

   var newSlidesComponent = new SlideComponent(slidesComponent.articleID, 2, "").toObjectLiteral();

   // BUILD: Main TOC 
   var audienceQATOC = new TOCElement("Sidebar");
   audienceQATOC.tocLabel = "Audience Q &amp; A";

   // BUILD: Main Section Element 
   var sectionElement = new SectionElement();
   sectionElement.sectionHeader = "Audience Q &amp; A";

   // BUILD: Main Subsection
   var subsectionElement = new SubsectionElement(true, false, false);
   subsectionElement.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(newSlidesComponent));

   // INSERT: Subsection
   sectionElement.insertSubsectionElement(subsectionElement);

   // INSERT: Main Section
   audienceQATOC.insertSectionElement(sectionElement);
   return audienceQATOC;
}

module.exports = {
    buildSection,
    buildCMETestSection,
    buildBlankTOC,
    buildSlides,
    buildSlidesTOC,
    buildEduImpactPreSection,
    buildEduImpactPostSection,
    buildLLAPreTOC,
    buildLLAPostTOC,
    buildReferences,
    buildAbbreviations,
    buildTableOfContentsTOC,
    buildAudienceQATOC
};