const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {ProfArticle, ProfActivity, TOCElement, SectionElement, SubsectionElement, SlideGroup, TestAndTeachChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');

/* 
Practice Article - 896014
*/

/* GET CONTENT COMPONENTS 
-------------------------------------- */
function getTables(contentBlockHTML, program) {
    var startRegexps = [
        /<p><strong>Table \d+\..*/gi
    ];

    var endRegexps = [
        /(?:&lt;){1,}end table.*(?:&gt;){1,}.*/gi
    ]

    var tables = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, false, true);

    for (var i = 0; i < tables.length; i++) {
        tables[i].textBlock = utils.cleanHTML.tableCleanup(tables[i].textBlock);
        tables[i].textBlock = utils.cleanHTML.insertEntityPlaceholders(tables[i].textBlock);
        tables[i].label = utils.cleanHTML.paragraph(tables[i].label, false, ['sup']);
        tables[i].type = "table";
    } 
    return tables;
}

function getFigures(contentBlockHTML, program) {
    var startRegexps = [
        /.*Figure \d\..*/g
        // /(?:&lt;){1,}insert figure \d.*(?:&gt;){1,}.*/gi
    ];

    var endRegexps = [
        /.*(?:&lt;){1,}level 2(?:&gt;){1,}.*/gi,
        /.*&lt;&lt;level 2&gt;&gt;.*/gi,
        /.*<strong>Y\/N<\/strong>/g,
        // /(?:&lt;){1,}insert figure \d+(?:&gt;){1,}.*/gi,
        /.*(?:&lt;){1,}level 1(?:&gt;){1,}.*/gi,
        /.*&lt;&lt;level 1&gt;&gt;.*/gi,
        // /.*Figure \d\..*/g
    ];

    /* 
        Instead of grabbing the title from the label (as normal), we have to use the textblock to generate the label. 
    */
    var figures = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, true, false);

    // console.log("FIGURES BEFORE CLEAN: ", figures);

    for (var i = 0; i < figures.length; i++) {
        var textBlock = figures[i].textBlock;
        figures[i].label = utils.cleanHTML.paragraph(figures[i].label, false, ['sup']);
        textBlock = textBlock.replace(/.*<img .*/g, 'IMAGE---PLACEHOLDER');
        // console.log("FIGURES BLOCK AFTER REPLACE: ", textBlock);
        textBlock = utils.cleanHTML.paragraph(textBlock);
        figures[i].textBlock = textBlock.replace(/IMAGE---PLACEHOLDER/g, '<img alt="REPLACE THIS IMAGE WITH FIGURE" />');
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

function getLevelTwos(contentBlockHTML, program) {
/*
    Will call this get sections and subsection objects. 
    Level 2 is the most simple construct so we don't need to "look"
    - Instead we should look for everything else and call those     functions inside here. 
*/
    var startRegexps = [
        /(?:&lt;){1,}level 2(?:&gt;){1,}.*/gi,
        /&lt;&lt;level 2&gt;&gt;.*/gi,
        /(?:&lt;){1,}end table.*(?:&gt;){1,}.*/gi
    ];

    var endRegexps = [ 
        /<strong>Y\/N<\/strong>/g,
        /(?:&lt;){1,}insert figure \d+(?:&gt;){1,}.*/gi,
        /(?:&lt;){1,}level 1(?:&gt;){1,}.*/gi,
        /&lt;&lt;level 1&gt;&gt;.*/gi,
        // /(?:&lt;){1,}level 2(?:&gt;){1,}.*/gi,
        // /&lt;&lt;level 2&gt;&gt;.*/gi
        /.*Table \d\..*/g
    ];

    var blocks = utils.stringOps.getAllBlocksInOrder(contentBlockHTML, startRegexps, endRegexps, true, false);

    _.remove(blocks, function (block) {
        var testString = utils.cleanHTML.onlyParagraphTags(block.textBlock);
        if (testString.length < 30) {
            // console.log("RETURNING TRUE: ")
            return true;
        } else {
            block.type = "levelTwo";
            block.label = block.label.replace(/(?:&lt;){1,}level 2(?:&gt;){1,}/g, "");
            block.label = utils.cleanHTML.plainText(block.label).trim();
            // console.log("BLOCK BEFORE CLEAN: ", block.textBlock);
            block.textBlock = utils.cleanHTML.paragraph(block.textBlock);
            return false;
        }
    });
    return blocks;
}

function hasQNANumber (contentBlockHTML) {
/*
- Search to see if the contentBlockHTML contains a Question 
- If it does return true
*/
    var questionRegexArray = [
        /.*Question \d.*/gi,
        /.*Answer choices &\#953;.*/gi
    ];

    var nextRegex = utils.stringOps.getNextRegex(contentBlockHTML, questionRegexArray);

    if (nextRegex != -1) {
        return true;
    }
    return false;
}

function getContentBlockObjects (ticketHTML, program) {
    var breakpoints = [
        {
            symbol: /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
            inclusive: true
        },
        {
            symbol: /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi, 
            inclusive: true
        },
        {
            symbol: /(?:<strong>){0,}Answer Explanation (?:&#953;){0,}:.*/g,
            inclusive: false
        },
        {
            symbol: /.*Answer Explanation:.*/g, 
            inclusive: false
        }
    ];
    /* 
        POSSIBLE BREAKPOINTS  
        --> Question Start
        --> Question End (Answer Explanation) 
        --> New Case                 
    */
    var {textBlock} = utils.stringOps.getTextBlock(ticketHTML, /<strong>Content/g, /<strong>Abbreviations/g, false, true);

    // console.log("CONTENT HTML: ", textBlock);

    var result = [];
    var strings = utils.stringOps.sliceAtBreakpoints(textBlock, breakpoints);
    var currentBlock = null;
    var qnaNumber = 3;
    for (var i = 0; i < strings.length; i++) {
        // console.log("FUNCTION LOOP 1: ");
        currentBlock = {
            string: strings[i],
            qnaNumber: null
        };
        if (hasQNANumber(currentBlock.string)) {
            currentBlock.qnaNumber = qnaNumber;
            qnaNumber++;
        }
        result.push(currentBlock);
    }
    return result;
}

function getContentBlockComponents (contentBlockObject, program) {
    /*
    UTILITY FUNCTION: 
    - Find all level 1s in order - Look for: <<Level 1>>
    - Find all level 2s in order - Look for: <<Level 2>> 
    - Find all Tables in order - Start: <<insert table (/d)>> - End: <<end table (/d)>>
    - Find Figures - Look for <<insert figure (/d)>>
    - Flatten all component arrays into one 
    - order the component array by its index value
        string: strings[i],
        qnaNumber: null
    */ 
    // console.log("COMPONENTS FUNCTION: ");
    var tables, figures, levelOnes, levelTwos;
    tables = getTables(contentBlockObject.string, program);
    figures = getFigures(contentBlockObject.string, program);
    levelOnes = getLevelOnes(contentBlockObject.string, program);
    levelTwos = getLevelTwos(contentBlockObject.string, program);

    var components = [tables, figures, levelOnes, levelTwos];     
    return {
        objects: _.sortBy(_.flatten(components), [function(o) { return o.startIndex; }]),
        qnaNumber: contentBlockObject.qnaNumber
    };    
}


/* MAIN CONTENT 
-------------------------------------- */
function buildTableSubsection (componentObject, program) {
    componentObject.label = `<p><strong>${componentObject.label}</strong></p>`;
    return buildLevel2Subsection(componentObject);
}

function buildFigureSubsection (componentObject, program) {
    componentObject.label = `<p><strong>${componentObject.label}</strong></p>`;
    return buildLevel2Subsection(componentObject);
}

function buildLevel1Section (componentObject, program) {
/*
- Function should test if level 1 text contains either "case 1" or "case 2"
- This should be the determining factor for if there is a Case image or not. 
*/
    var isNewCase = false;
    var caseNumber = 0;
    var newCaseRegex = /Case (\d):.*/g; 
    if (utils.stringOps.regexIndexOf(componentObject.label, newCaseRegex) != -1) {
        isNewCase = true;
        caseNumber = parseInt(componentObject.label.replace(newCaseRegex, "$1").trim());
        // console.log("CASE NUMBER: ", caseNumber);
    }


    var levelOneSection = new SectionElement();
    levelOneSection.sectionHeader = componentObject.label;
    
    var removeRegex =  /.*(?:&lt;){1,}level 1(?:&gt;){1,}.*/gi;
    componentObject.textBlock = componentObject.textBlock.replace(removeRegex, "");
    
    
    var levelOneSubsection = new SubsectionElement();
    
    if (isNewCase) {
        var content = utils.wrapSubsectionContent(snippets.caseImage(program.articleID, componentObject.textBlock, caseNumber));
        // console.log("STUFF: ", content);
        levelOneSubsection.subsectionContent = utils.cleanHTML.insertEntityPlaceholders(content);
        // console.log("BUILD LEVEL 1 BLOCK: ", componentObject.textBlock);
    } else {
        levelOneSubsection.subsectionContent = utils.wrapSubsectionContent(componentObject.textBlock);
    }

    return {
        sectionElement: levelOneSection,
        subsectionElement: levelOneSubsection
    };
}

function buildLevel2Subsection (componentObject, program) {
    var levelTwoSubsection = new SubsectionElement();

    // var clean = componentObject.textBlock.slice(); 
    // console.log("BEFORE CLEAN: ", clean);

    // clean = utils.formatList.formatUlItems(clean, null, utils.formatList.formatUlItems);
    // clean = utils.formatList.wrapUls(false, clean, utils.formatList.wrapUls);

    // console.log("AFTER CLEAN: ", clean);

    // var ttRegExp = new RegExp('</tt>', 'g');
    // clean = clean.replace(ttRegExp, "");
    if (componentObject.type == "table") {
        componentObject.textBlock = utils.cleanHTML.unorderedList(componentObject.textBlock, false, true, [ 'ul', 'li', 'em', 'strong', 'sup', 'sub', 'tt' , 'table', 'th', 'td']); 
    } else if (componentObject.type == "figure") {
        componentObject.textBlock = utils.cleanHTML.unorderedList(componentObject.textBlock, false, true, [ 'ul', 'li', 'em', 'strong', 'sup', 'sub', 'tt' , 'p']);        
    } else {
        componentObject.textBlock = utils.cleanHTML.unorderedList(componentObject.textBlock, true, true, [ 'ul', 'li', 'em', 'strong', 'sup', 'sub', 'tt' , 'p']);        
    }
 
    levelTwoSubsection.subsectionContent = utils.wrapSubsectionContent(componentObject.textBlock);
    if (componentObject.type == "table" || componentObject.type == "figure") {
        levelTwoSubsection.subsectionHeaderMarkup = componentObject.label;
    } else {        
        var removeRegex = /(?:&lt;){1,}end table.*(?:&gt;){1,}/gi;
        levelTwoSubsection.subsectionHeader = componentObject.label.replace(removeRegex, "").trim();
    }
    return levelTwoSubsection;
}

function buildContentTOC (contentBlockComponents, program) {
    /* 
        Psuedocode/Algorithm
            - tocInstance = new TOCElement(); 
            - currentSection = null; 
            - For each component in the contentBlockObjects 
                - switch (component.type) 
                    - case "level 1":
                        // Case where there is a new section
                        // Insert the current section and create a new one
                    - case "level 2": 
                        // buildLevel2Subsection()
                    - case "table": 
                        // buildTableSubsection()
                        - case "figure":
                        - buildFigureSubsection 
                        - If !currentSection 
                        - currentSection = create Section 
                        - insert figureSubsection into section 
                - insert created subsection into current section 
                if (lastComponent) {
                    tocInstance.insertSection(currentSection);
                }
    */
    var components = contentBlockComponents.objects;
    var tocInstance = new TOCElement(); 
    var currentSection = null;
    var currentSubsection = null;
    for (var i = 0; i < components.length; i++) {
        switch (components[i].type) {
            case "levelOne":
            /* 
                // Case where there is a new section
                // Insert the current section and create a new one. 
            */
                // console.log("LEVEL ONE SWITCH COMPONENT: ", components[i]);
                if (currentSection) {
                    tocInstance.insertSectionElement(currentSection);
                } 
                var levelOne = buildLevel1Section(components[i], program);
                currentSection = levelOne.sectionElement;
                currentSubsection = levelOne.subsectionElement;
                break;
            case "figure":
                currentSubsection = buildFigureSubsection(components[i], program);
                break;
            case "table":
                currentSubsection = buildTableSubsection(components[i], program);
                // console.log("TABLE SUBSECTION: ", utils.xmlOps.objectToXMLString(currentSubsection.toObjectLiteral()));
                break;
            default: 
                currentSubsection = buildLevel2Subsection(components[i], program);
                break;
        }
        if (!currentSection) {
            currentSection = new SectionElement();
        }
      
        if (i + 1 == components.length) {
            if (contentBlockComponents.qnaNumber) {
                // currentSection.childElements[childElements.length - 1].qnaForm = contentBlockComponents.qnaNumber;
                currentSubsection.qnaForm = contentBlockComponents.qnaNumber;
            } 
            currentSection.insertSubsectionElement(currentSubsection);
            tocInstance.insertSectionElement(currentSection);
        } else {
            currentSection.insertSubsectionElement(currentSubsection);
        }
    } 
    // console.log("BUILD TOC: ", utils.xmlOps.objectToXMLString(tocInstance.toObjectLiteral()));              
    return tocInstance;
}

function getMainContentTOCs (articleContent, program) {
    /* 
        Requirements for getMainContentTOCs: 
        1) Use buildContentTOC for the following TOCs
            1a) CREATE QUESTION TOC ELEMENTS (1 FOR: EACH QUESTION FORM); 
            1b) CREATE SUBSECTIONS FOR TEXT BLOCKS; 
            1c) CREATE SUBSECTIONS FOR TABLES AND FIGURES; 
        2) Use buildLLAPostTOC() for: 
            POST ASSESSMENT - buildContentTOC(qnaFormNumber, "Article"); 

        Algorithm Ideas
        - Split content section into separate pages -> getContentBlockObjects(contentHTML) 
        latestQnaNumber = 0;
        - For each page/contentBlockObject create a TOCElement 
            - getContentBlockComponents(contentBlockObject)
            - latestQnaNumber = content.qnaNumber
            - buildContentTOC(content)
        - After looping through each contentBlockObject 
            - Attach EduImpactSubsection 
    */
    var mainTOCs = [];
    var contentBlockObjects = getContentBlockObjects(articleContent, program);
    var contentBlockComponents = null;
    var latestQnaNumber = null;
    for (var i = 0; i < contentBlockObjects.length; i++) {
        // console.log("FUNCTION LOOP 2: ");
        contentBlockComponents = getContentBlockComponents(contentBlockObjects[i], program);
        latestQnaNumber = contentBlockComponents.qnaNumber;
        mainTOCs.push(buildContentTOC(contentBlockComponents, program));
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
    
    // SLIDES ---> No Slides necessary for this one.  
    // checklist.slides.result = prodticket.getSlides(ticket, program);
 
    // CONTRIBUTORS
    checklist.contributors.result = prodticket.getContributors(ticket, program);

    // CME REVIEWERS 
    checklist.cmeReviewers.result = prodticket.getCMEReviewers(ticket, program);

    return checklist.print();
}



/* MASTER FUNCTION 
-------------------------------------- */
function buildTestAndTeach(ticket, program) {
    /*
        Function requirements for buildTestAndTeach:
        1) CHECKLIST CREATION 
            1A) BUILD ALL MAIN CONTENT TOCs 
        2) BLANK RESULTS PAGE - buildBlankTOC(); 
        3) ABBREVIATIONS - buildAbbreviations(abbreviationsMarkup, program); 
        4) REFERENCES - buildReferences(referencesMarkup, program); 
        5) BACK MATTER - ; 
    */
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

    var tocs = getMainContentTOCs(checklistResult.properties.articleContent.result, program);

    // slidesTOC = tocs.slidesTOC;
    // audienceQATOC = tocs.audienceQATOC; 

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
    getMainContentTOCs,
    getTables,
    getFigures,
    getLevelOnes,
    getLevelTwos,
    getContentBlockComponents,
    getContentBlockObjects,
    hasQNANumber,
    buildContentTOC,
    buildTestAndTeach
}

