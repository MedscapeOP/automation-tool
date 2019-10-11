const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, ProfActivity, TOCElement, SectionElement, SubsectionElement, SlideGroup, TownHallCertChecklist, SlideComponent} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const config = require('../config');
const activity = require('./activity').activity;


/* SLIDES / MAIN CONTENT 
-----------------------------------t--- */
function getContentTOC (articleContent, program) {
    var contentTOC, contentSection, contentSubsection;
    contentTOC = new TOCElement();
    contentSection = new SectionElement();
    contentSubsection = new SubsectionElement();
    contentSubsection.subsectionContent = utils.wrapSubsectionContent(articleContent);
    contentSection.insertSubsectionElement(contentSubsection)
    contentTOC.insertSectionElement(contentSection);
    return contentTOC;
}

/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistTownHallCert(ticket, program) {
    var checklist = new TownHallCertChecklist();

    // ABBREVIATIONS -> N/A 
    // checklist.abbreviations.result = prodticket.getAbbreviations(ticket, program);

    // BACKMATTER FRONT PAGE      
    checklist.bkmtrFront.result = utils.wrapSubsectionContent(snippets.backmatter.backmatterFrontPage(program));

    // BYLINE
    checklist.byline.result = prodticket.getByline(ticket, program);

    // COLLECTION PAGE -> N/A
    
    // CONTRIBUTOR PRE CONTENT (CONTENT ABOVE CONTRIBS)
    // checklist.contrbtrPreContent.result = utils.wrapSubsectionContent(snippets.preContent.contrbtrPreContentMarkup(program));

    // COPYRIGHT HOLDER 
    checklist.cpyrtHolder.result = utils.wrapSubsectionContent(snippets.copyrightHolder.copyrightHolderMarkup(program));

    // CREDITS AVAILABLE - N/A 

    // DOWNLOADABLE SLIDES 
    // checklist.downloadableSlides.result = snippets.downloadableSlides(program.articleID);

    // GOAL STATEMENT
    checklist.goalStatement.result = prodticket.getGoalStatement(ticket, program);

    // LEARNING OBJECTIVES
    checklist.learningObjectives.result = prodticket.getLearningObjectives(ticket, program);

    // PEER REVIEWER 
    if (program.hasPeerReviewer) {
        checklist.peerReviewer.result = prodticket.getPeerReviewer(ticket, program);        
    } 

    // REFERENCES - N/A

    // SUPPORTER
    // <<<<<<<< PLACEHOLDER >>>>>>>>>

    // TARGET AUDIENCE 
    checklist.targetAudience.result = prodticket.getTargetAudience(ticket, program);

    // TEASER
    // <<<<<<<< PLACEHOLDER >>>>>>>>>

    // TITLE 
    checklist.title.result = prodticket.getTitle(ticket, program);
    
    // SLIDES / TRANSCRIPT - N/A
 
    // CONTRIBUTORS
    checklist.contributors.result = prodticket.getContributors(ticket, program);

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticket, program);

    return checklist.print();
}


/* MASTER FUNCTION 
-------------------------------------- */
function buildTownHallCert(ticket, program) {
    // <script type="text/javascript">var pfizFlag = "active";</script>
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo, 
    contentTOC,
    abbreviationsTOC,
    referencesTOC,
    forYourPatientMarkup,
    targetAudience, 
    goalStatement,
    learningObjectives,
    cmeReviewers;

    var checklistResult = checklistTownHallCert(ticket, program);

    title = (checklistResult.properties.title ? checklistResult.properties.title.result : "");
    byline = (checklistResult.properties.byline ? checklistResult.properties.byline.result : "");

    peerReviewer = (checklistResult.properties.peerReviewer ? checklistResult.properties.peerReviewer.result : "");

    targetAudience = (checklistResult.properties.targetAudience ? checklistResult.properties.targetAudience.result : "");

    goalStatement = (checklistResult.properties.goalStatement ? checklistResult.properties.goalStatement.result : "");

    learningObjectives = (checklistResult.properties.learningObjectives ? checklistResult.properties.learningObjectives.result : "");

    learningObjectives = utils.formatLearningObjectives(learningObjectives);    
    

    // var abbreviationsMarkup = (checklistResult.properties.abbreviations ? checklistResult.properties.abbreviations.result : "");
    // console.log("ABBREVIATIONS MARKUP: ", abbreviationsMarkup);
    // abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    // var referencesMarkup = (checklistResult.properties.references ? checklistResult.properties.references.result : "");
    // referencesTOC = articleUtils.buildReferences(referencesMarkup, program);

    var contentMarkup = "<p>" + prodticket.getArticleContent(ticket, program) + "</p>";
    contentTOC = getContentTOC(contentMarkup, program);
    

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
    // finalArticle.contrbtrPreContent = checklistResult.properties.contrbtrPreContent.result;
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
    finalArticle.insertTOCElement(contentTOC);
    // finalArticle.insertTOCElement(abbreviationsTOC);
    // finalArticle.insertTOCElement(referencesTOC);

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
    buildTownHallCert
}
