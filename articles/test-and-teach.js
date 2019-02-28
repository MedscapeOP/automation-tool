const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, ProfActivity, TOCElement, SectionElement, SubsectionElement, SlideGroup, TownHallEnduringChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');

/* 
Practice Article - 896014
*/

/* GET CONTENT COMPONENTS 
-------------------------------------- */
function getTables(contentBlockHTML, program) {
    var startRegexps = [
        /.*Table \d+\..*/gi
    ];

    var endRegexps = [
        /(?:&lt;){1,}end table.*(?:&gt;){1,}.*/gi
    ]

    var tables = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, false, true);

    for (var i = 0; i < tables.length; i++) {
        tables[i].textBlock = utils.cleanHTML.tableCleanup(tables[i].textBlock);
        tables[i].label = utils.cleanHTML.paragraph(tables[i].label, false, ['sup']);
        tables[i].type = "table";
    } 
    return tables;
}

function getFigures(contentBlockHTML, program) {
    var startRegexps = [
        /(?:&lt;){1,}insert figure \d.*(?:&gt;){1,}.*/gi
    ];

    var endRegexps = [
        /.*Figure \d\..*/g
    ];

    /* 
        Instead of grabbing the title from the label (as normal), we have to use the textblock to generate the label. 
    */
    var figures = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, true, true);

    for (var i = 0; i < figures.length; i++) {
        figures[i].label = utils.cleanHTML.paragraph(figures[i].textBlock, false, ['sup']);
        figures[i].type = "figure";
    } 
    return figures;
}

function getLevelOnes(contentBlockHTML, program) {
/*
    create regex array of possible matches for start and end
    call getAllTextBlocks
    add levelOne to the type of each object in the result  
*/
    var startRegexps = [
        /(?:&lt;){1,}level 1(?:&gt;){1,}.*/gi,
        /&lt;&lt;level 1&gt;&gt;.*/gi
    ];

    var endRegexps = [ 
        /<strong>Y\/N<\/strong>/g,
        // /(?:&lt;){1,}level 2(?:&gt;){1,}.*/gi,
        /&lt;&lt;level 2&gt;&gt;.*/gi,
        // /level 2&gt;&gt;.*Discussion/gi,
        /.*Table \d\..*/g
    ];

    var blocks = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, true, false);

    _.remove(blocks, function (block) {
        var testString = utils.cleanHTML.onlyParagraphTags(block.textBlock);
        if (testString.length < 30) {
            return true;
        } else {
            block.type = "levelOne";
            block.label = block.label.replace(/(?:&lt;){1,}level 1(?:&gt;){1,}/g, "");
            block.label = utils.cleanHTML.plainText(block.label).trim();
            block.textBlock = utils.cleanHTML.paragraph(block.textBlock);
            return false;
        }
    });

    return blocks;
}

function getContentBlockObjects(contentBlockHTML, program) {
/*
    Will call this get sections and subsection objects. 
    Level 2 is the most simple construct so we don't need to "look"
    - Instead we should look for everything else and call those     functions inside here. 
*/
    var startRegexps = [
        /(?:&lt;){1,}level 2(?:&gt;){1,}.*/gi,
        /&lt;&lt;level 2&gt;&gt;.*/gi
    ];

    var endRegexps = [ 
        /<strong>Y\/N<\/strong>/g,
        // /(?:&lt;){1,}insert figure \d+(?:&gt;){1,}.*/gi,
        /(?:&lt;){1,}level 1(?:&gt;){1,}.*/gi,
        /&lt;&lt;level 1&gt;&gt;.*/gi,
        // /(?:&lt;){1,}level 2(?:&gt;){1,}.*/gi,
        // /&lt;&lt;level 2&gt;&gt;.*/gi
        // /.*Table \d\..*/g
    ];

    var blocks = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, true, false);

    _.remove(blocks, function (block) {
        var testString = utils.cleanHTML.onlyParagraphTags(block.textBlock);
        if (testString.length < 30) {
            return true;
        } else {
            block.type = "levelTwo";
            block.label = block.label.replace(/(?:&lt;){1,}level 2(?:&gt;){1,}/g, "");
            block.label = utils.cleanHTML.plainText(block.label).trim();
            block.textBlock = utils.cleanHTML.paragraph(block.textBlock);
            return false;
        }
    });
    
    return blocks;
}

function getQNANumber (contentBlockHTML, program) {

}

function getContentBlocks(ticketHTML, program) {
    var breakpoints = [
        /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
        /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi,
        /(?:<strong>){0,}Answer Explanation (?:&#953;){0,}:.*/g,
        /.*Answer Explanation:.*/g,
    ];
    /* 
        POSSIBLE BREAKPOINTS  
        --> Question Start
        --> Question End (Answer Explanation) 
        --> New Case                 
    */
    var {textBlock} = utils.stringOps.getTextBlock(ticketHTML, /<strong>Content/g, /<strong>Abbreviations/g, false, true);

    var result = utils.stringOps.sliceAtBreakpoints(textBlock, breakpoints);

    return result;
}

/* MAIN CONTENT 
-------------------------------------- */
function buildContentTOC (articleComponent) {
/* 
Algorithm Ideas

UTILITY FUNCTION: 
- Find all level 1s in order 
    - Look for: <<Level 1>>
- Find all level 2s in order 
    - Look for: <<Level 2>> 
- Find all Questions in order 
    - Start: QUESTION
    - End: at Next heading () 
    - Goal of this function would be to determine page
- Find all Tables in order 
    - Start: <<insert table (/d)>>
    - End: <<end table (/d)>>
- Find Figures 
    - Look for <<insert figure (/d)>>

- Main process is finding all relevant textblocks in order 
    - Need a new stringOps function --> getAllBlocksInOrder(textblock, startRegExpArray, endRegExpArray)

- Split total document into separate pages - each page object should include its QNA form # (if it has one).
    - tocElements = [];
    - For each page - Find all components in order 
        - tocInstance = new TOCElement(); 
        - currentSection = null; 
        - Flatten all component arrays into one 
        - order the component array by its index value
        - For each component in the array 
            - switch (component.type) 
                - case "level 1":
                    // Case where there is a new section
                    // Insert the current section and create a new one. 
                    - if currentSection
                        - tocInstance.insertSection(currentSection);
                    - currentSection = buildLevel1Section() 
                        - Function should test if level 1 text contains either "case 1" or "case 2"
                        - This should be the determining factor for if there is a Case image or not.                                                        
                - case "level 2": 
                    - buildLevel2Subsection
                    - if !currentSection 
                        - currentSection = create Section 
                    - insert level2Subsection into section 
                - case "table": 
                    - buildTableSubsection
                    - If !currentSection
                        - currentSection = create Section 
                    - insert tableSubsection into section 
                - case "figure":
                    - buildFigureSubsection 
                    - If !currentSection 
                        - currentSection = create Section 
                    - insert figureSubsection into section 
            if (lastComponent) {
                tocInstance.insertSection(currentSection);
            }
*/
    return new TOCElement();
}

function getMainContent(articleContent, program) {

/* 
TT_Transcript: CREATE QUESTION TOC ELEMENTS (1 FOR: EACH QUESTION FORM); CREATE SUBSECTIONS FOR TEXT BLOCKS; CREATE SUBSECTIONS FOR TABLES AND FIGURES; POST ASSESSMENT; BLANK RESULTS PAGE; ABBREVIATIONS; REFERENCES; BACK MATTER; INSERT FIGURES; INSERT PATIENT CASE IMAGES; FORMAT AND INSERT HTML TABLES;
*/
    // Get Slide Component from prodticket.getSlides.
    // Check if LLA 
    // If LLA build slides with Video embed AND Edu Impact challenge 
    var mainTOCs = [];
    for (var i = 0; i < articleComponents.length; i++) {
        mainTOCs.push(buildContentTOC(articleComponents[i]));
    }

    return {
        mainTOCs: mainTOCs
    }
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

/* ACTIVITY FUNCTION  
-------------------------------------- */
function activityTestAndTeach(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers) {
    // console.log("CME REVIEWERS: ", cmeReviewers);
    var activityInstance = new ProfActivity(title, program.hasOUS);
    activityInstance.targetAudience = targetAudience; // Text field

    learningObjectives = `<p><p>Upon completion of this activity, participants will:</p>` + learningObjectives + "</p>";

    activityInstance.learningObjectives =  learningObjectives; // unwrapped markup
    activityInstance.goalStatement = utils.cleanHTML.plainText(goalStatement);
    
    activityInstance.miscProviderStatement = snippets.activity.medscapeProviderStatement(program);

    activityInstance.creditInstructions = snippets.activity.instructionsForCredit(program);

    activityInstance.hardwareRequirements = snippets.activity.hardwareRequirements();

    activityInstance.additionalCreditAvailable = snippets.activity.additionalCreditAvailable();

    var contributorGroups = articleUtils.buildContributorGroups(cmeReviewers);

    for (var i = 0; i < contributorGroups.length; i++) {       
        activityInstance.insertContributorGroup(contributorGroups[i]);
    }

    return activityInstance.toFinalXML();
}

/* CHECKLIST FUNCTION  
-------------------------------------- */
function checklistTestAndTeach(ticket, program) {
    var checklist = new TestAndTeachChecklist();

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
    
    // SLIDES 
    checklist.slides.result = prodticket.getSlides(ticket, program);
 
    // CONTRIBUTORS
    checklist.contributors.result = prodticket.getContributors(ticket, program);

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticket, program);

    return checklist.print();
}



/* MASTER FUNCTION 
-------------------------------------- */
function buildTestAndTeach(ticket, program) {
    // <script type="text/javascript">var pfizFlag = "active";</script>
    var title, 
    byline, 
    peerReviewer, 
    collectionPageInfo, 
    slidesTOC, 
    preAssessmentTOC, 
    postAssessmentTOC, 
    blankResultsTOC, 
    abbreviationsTOC,
    referencesTOC,
    forYourPatientMarkup,
    audienceQATOC,
    targetAudience, 
    goalStatement,
    learningObjectives,
    cmeReviewers;

    var checklistResult = checklistTestAndTeach(ticket, program);

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

    var tocs = getMainContent(checklistResult.properties.articleContent.result, program);

    slidesTOC = tocs.slidesTOC;
    audienceQATOC = tocs.audienceQATOC; 

    var abbreviationsMarkup = (checklistResult.properties.abbreviations ? checklistResult.properties.abbreviations.result : "");
    abbreviationsTOC = articleUtils.buildAbbreviations(abbreviationsMarkup, program);

    var referencesMarkup = (checklistResult.properties.references ? checklistResult.properties.references.result : "");
    referencesTOC = articleUtils.buildReferences(referencesMarkup, program);
    

    // Build Main Article Object - Instantiate and Populate Article
    var finalArticle = new ProfArticle("SlidePresentation", program.hasOUS);
    // Set article title (pass text)
    finalArticle.title = title;
    // Set article byline (pass text)
    finalArticle.contrbtrByline = byline;
    // insert peer reviewer
    finalArticle.contrbtrPostContent = peerReviewer;
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
        finalArticle.insertAboveTitleCA(collectionPageInfo.title, collectionPageInfo.advancesFileName);
    } 

    cmeReviewers = (checklistResult.properties.cmeReviewers ? checklistResult.properties.cmeReviewers.result : "");
          
    // Insert Main TOC Objects  
    finalArticle.insertTOCElement(preAssessmentTOC);
    finalArticle.insertTOCElement(slidesTOC);
    finalArticle.insertTOCElement(postAssessmentTOC);
    finalArticle.insertTOCElement(blankResultsTOC);
    finalArticle.insertTOCElement(abbreviationsTOC);
    finalArticle.insertTOCElement(referencesTOC);
    finalArticle.insertTOCElement(audienceQATOC);

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

    var activityXML = activityTestAndTeach(program, title, targetAudience, goalStatement, learningObjectives, cmeReviewers);

    return {
        finishedArticleObject: finalArticle,
        checklistHTML: checklistResult.printHTML,
        activityXML: activityXML  
    };
};

module.exports = {
    getMainContent,
    getTables,
    getFigures,
    getLevelOnes,
    getContentBlockObjects,
    getQNANumber,
    getContentBlocks,
    buildTestAndTeach
}

