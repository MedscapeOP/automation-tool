const _ = require("lodash");
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const utils = require("../utils");
const buildSlides = require('./build-slides');
const {TOCElement, SectionElement, SubsectionElement, SlideGroup, SlideComponent, ContributorGroup, ContributorElement} = require("../classes");

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
function buildEarnCreditSection(qnaID) {
    // Return instance of section for use in master BUILD function
    var sectionInstance = new SectionElement();
    var subsectionInstance = new SubsectionElement(false, true, false);
    // subsectionInstance.subsectionContent = (subsectionContent);
    subsectionInstance.subsectionContent = utils.wrapSubsectionContent(snippets.earnCreditButton(qnaID));
    sectionInstance.insertSubsectionElement(subsectionInstance);
    return sectionInstance;
}

/* DONE */
function buildBlankTOC(isSlidePresentation=true) {
    if (isSlidePresentation) {
        var slideGroup = new SlideGroup("", "", true, false);
        slideGroup.sectionImage = null;
        slideGroup.sectionLabel = null;
        slideGroup.sectionAltText = null;
    
        var subsectionInstance = new SubsectionElement(true, false, false);
    
        subsectionInstance.insertSlideGroup(slideGroup);
    } else {
        var subsectionInstance = new SubsectionElement(false, true, false);
    }
    
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
    if ((typeof slidesComponent === 'string')) {
        var slidesSubsection = subsectionElement;
    } else {
        var slidesSubsection = buildSlides(slidesComponent.rawSlides, subsectionElement, slidesComponent.slidePath);        
    }

    // console.log("SLIDES SUBSECTION: ", slidesSubsection.toObjectLiteral().elements[0].elements[3].elements[3].elements);

    // Insert Video Embed - If necessary 
    if (videoEmbed) {
        if ((typeof slidesComponent === 'number') || (typeof slidesComponent === 'string')) {
            slidesSubsection.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(null, slidesComponent));
        } else {
            slidesSubsection.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(slidesComponent));
        }
    } 

    if (isLastComponent && typeof slidesComponent == 'object') {
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
        var eduImpactSubsection = buildEduImpactSubsection();
        slidesSection.insertSubsectionElement(eduImpactSubsection);
    }

    // INSERT: Main Section
    slidesTOC.insertSectionElement(slidesSection);
    return slidesTOC;
}

/* DONE */ 
function buildEmptySlidesTOC(slidesComponent, videoEmbed=true, isLastComponent=false) {
    // BUILD: Main TOC Element 
    var slidesTOC = new TOCElement();

    // BUILD: Main Section Element 
    var slidesSection = new SectionElement();

    // BUILD: Main Slides Subsection
    var slidesSubsection = new SubsectionElement(true, false, false);

    // Insert Video Embed - If necessary 
    if (videoEmbed) {
        slidesSubsection.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(slidesComponent));
    } 

    var slideGroup = null;
    for (var i = 0; i < slidesComponent.numberOfSlides; i++) {
        slideGroup = new SlideGroup(slidesComponent.slidePath, i+1);
        slidesSubsection.insertSlideGroup(slideGroup);
    }

    if (isLastComponent && typeof slidesComponent == 'object') {
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

    // INSERT: Main Section
    slidesTOC.insertSectionElement(slidesSection);
    return slidesTOC;
}


/* DONE */
function buildEduImpactSubsection(
    articleType="SlidePresentation",
    statement=`<p>What did you learn from this activity? Please click on the "Next" button to proceed to a brief survey to see how your knowledge improved after the education. You can also see how your answers compare with those of your peers.</p>`
) {
    var eduImpactSubsection = new SubsectionElement(true, false, false);
    eduImpactSubsection.subsectionHeader = "Educational Impact Challenge";

    if (articleType == "SlidePresentation") {
        eduImpactSubsection.subsectionContent = utils.wrapSlideIntro(statement);
    } else {
        eduImpactSubsection.subsectionContent = utils.wrapSubsectionContent(statement);
    }
    return (eduImpactSubsection);
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
function buildEduImpactPostSection (qnaFormNumber, articleType="SlidePresentation") {
    if (articleType == "SlidePresentation") {
        // Set up slide group with QNA form #
        var slideGroup = new SlideGroup('', '', true, false);
        slideGroup.sectionImage = null;
        slideGroup.sectionLabel = null;
        slideGroup.sectionAltText = null;
        slideGroup.qnaForm = qnaFormNumber;    
    
        // Insert goal statement + "before you begin..."
        var subsection = new SubsectionElement(true, false, false);
        subsection.insertSlideGroup(slideGroup);
    } else {
        var subsection = new SubsectionElement(false, true, false);
        subsection.qnaForm = qnaFormNumber;
    }

    // Insert "Educational Impact Challenge" header 
    var eduImpactPostSection = new SectionElement(false, false);
    eduImpactPostSection.sectionHeader = "Educational Impact Challenge";
    
    eduImpactPostSection.insertSubsectionElement(subsection);
    return eduImpactPostSection;
}

/* DONE */
function buildLLAPreTOC(goalStatementMarkup) {
    var llaPreSection = buildEduImpactPreSection(3, goalStatementMarkup);

    var llaPreTOC = new TOCElement();
    llaPreTOC.insertSectionElement(llaPreSection);
    return llaPreTOC;
}

/* DONE */
function buildLLAPostTOC(qnaFormNumber=4, articleType="SlidePresentation") {
    var llaPostSection = buildEduImpactPostSection(qnaFormNumber, articleType);

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

/* DONE */
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

/* DONE */
function buildSidebarVideoTOC(slidesComponent, articleID="XXXXXX", tocLabel="Audience Q &amp; A", componentNumber=2) {
    // - It just has an extra Sidebar, Audience Q&A where you need to embed video code video code is provided in media info in custom forms
    // - Use a normal LLA-style video embed. 
   // BUILD: Main TOC Element 

   if (slidesComponent) {
       var newSlidesComponent = new SlideComponent(slidesComponent.articleID, componentNumber, "").toObjectLiteral();
   } else {
        var newSlidesComponent = new SlideComponent(articleID, componentNumber, "").toObjectLiteral();
   }

   // BUILD: Main TOC 
   var sidebarTOC = new TOCElement("Sidebar");
   sidebarTOC.tocLabel = tocLabel;

   // BUILD: Main Section Element 
   var sectionElement = new SectionElement();
   sectionElement.sectionHeader = tocLabel;

   // BUILD: Main Subsection
   var subsectionElement = new SubsectionElement(true, false, false);
   subsectionElement.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(newSlidesComponent));

   // INSERT: Subsection
   sectionElement.insertSubsectionElement(subsectionElement);

   // INSERT: Main Section
   sidebarTOC.insertSectionElement(sectionElement);
   return sidebarTOC;
}

/**
 * @description Returns an array of ContributorGroup instances.
 * @param {*} contributors 
 */
function buildContributorGroups(contributors) {
    var contributorGroups = [];
    var currentTitle = null;
    var currentContributorGroup = null;
    var contributor = null;
    var contributorElement = null;
    for (var i = 0; i < contributors.length; i++) {
        contributor = contributors[i];
        if (!currentTitle || (currentTitle != contributor.title)) {
            // case where you create a new contributor group
            // set the current title
            currentTitle = contributor.title;
            if (currentContributorGroup) {
                // not the first group --> push the old contributor group 
                contributorGroups.push(currentContributorGroup);
                // console.log("PUSH CONTRIB GROUP: ");
            }
            // instantiate a new contributor group
            currentContributorGroup = new ContributorGroup(currentTitle);
            // console.log("INSTANTIATE CONTRIB GROUP: ");
        }
        // Create a new contributor element
        if (contributor.chronicleid) {
            contributorElement = new ContributorElement("", false, false, contributor.chronicleid);    
        } else {
            contributorElement = new ContributorElement();
        }   

        // Fill out the properties of the element
        contributorElement.contrbtrNm = contributor.name;
        contributorElement.contrbtrTitle = contributor.affiliation;
        contributorElement.contrbtrDisclsr = contributor.disclosure;
        
        // push the element onto the current contributor group.
        // console.log("CONTRIBUTOR ELEMENT PUSH: ", contributorElement); 
        currentContributorGroup.insertContributorElement(contributorElement);
        if (i + 1 >= contributors.length) {
            contributorGroups.push(currentContributorGroup);
        }
    }
    return contributorGroups;
}

/**
 * Function that cleans transcript HTML and builds the sidebar TOC 
 * @param {*} transcript 
 * @param {*} label: Text used as sidebar label  
 */
function buildTranscriptTOC (transcript, label = "Activity Transcript") {
    var cleanTranscript = utils.cleanHTML.transcript(transcript);

    cleanTranscript += "\n\n<p><em>This transcript has been edited for style and clarity.</em></p>";

    var subsectionInstance = new SubsectionElement(true, false, false);

    subsectionInstance.subsectionContent = utils.wrapSubsectionContent(cleanTranscript);
    
    var sectionInstance = new SectionElement();
    sectionInstance.insertSubsectionElement(subsectionInstance);
    sectionInstance.sectionHeader = label;

    var tocInstance = new TOCElement("Sidebar");
    tocInstance.insertSectionElement(sectionInstance);
    tocInstance.tocLabel = label;
    return tocInstance;
}

/* DONE */
function buildVideoEmbedTOC(componentOrArticleID, hasEduImpactSubsection=false) {

/*
- Params => componentOrArticleID, eduImpactSubsection=false, isLastComponent=false
- if componentOrArticleID == string 
    - subsection.subsectionContent = snippets.videoEmbed(null, componentOrArticleID)
- else 
    - subsection.subsectionContent = snippets.videoEmbed(componentOrArticleID)
*/
    var subsection = new SubsectionElement(true, false, false);
    var section = new SectionElement(false, false);
    var tocElement = new TOCElement();
    if (typeof componentOrArticleID == 'string') {
        subsection.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(null, componentOrArticleID));
    } else {
        subsection.subsectionContent = utils.wrapSlideIntro(snippets.videoEmbed(componentOrArticleID));
    }
    section.insertSubsectionElement(subsection);
    if (hasEduImpactSubsection) {
        section.insertSubsectionElement(buildEduImpactSubsection());
    }
    tocElement.insertSectionElement(section);
    return tocElement;
}
 
module.exports = {
    buildSection,
    buildCMETestSection,
    buildEarnCreditSection, 
    buildBlankTOC,
    buildSlides,
    buildSlidesTOC,
    buildEmptySlidesTOC,
    buildEduImpactSubsection,
    buildEduImpactPreSection,
    buildEduImpactPostSection,
    buildLLAPreTOC,
    buildLLAPostTOC,
    buildReferences,
    buildAbbreviations,
    buildTableOfContentsTOC,
    buildSidebarVideoTOC,
    buildContributorGroups,
    buildTranscriptTOC,
    buildVideoEmbedTOC
};