const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const {stripIndent} = require('common-tags');
const ArticleChecklist = require("./article_checklist");

class BriefChecklist extends ArticleChecklist{
    constructor() {  
        super();
        
        this.bkmtrFront = {result: null, printFn: printFunctions.printStringProp, printName: "BACK MATTER FRONT PAGE"};
        this.byline = {result: null, printFn: printFunctions.printStringProp, printName: "CONTRIBUTOR BYLINE"};
        this.collectionPageInfo = {result: null, printFn: printFunctions.printJSONProp, printName: "COLLECTION PAGE INFO"};
        this.contrbtrPreContent = {result: null, printFn: printFunctions.printStringProp, printName: "CONTENT ABOVE CONTRIBUTORS"};
        this.cpyrtHolder = {result: null, printFn: printFunctions.printStringProp, printName: "COPYRIGHT HOLDER"};
        // this.creditsAvailable = {result: null, printFn: printFunctions.printStringProp, printName: "CREDITS AVAILABLE"};
        this.goalStatement = {result: null, printFn: printFunctions.printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printFunctions.printLearningObjectives, printName: "LEARNING OBJECTIVES"};       
        this.references = {result: null , printFn: printFunctions.printStringProp, printName: "REFERENCES"};
        this.supporterGrantAttr = {result: null , printFn: printFunctions.printStringProp, printName: "GRANT ATTRIBUTIONS"};
        this.teaser = {result: null , printFn: printFunctions.printStringProp, printName: "CME TEASER"};
        this.targetAudience = {result: null , printFn: printFunctions.printStringProp, printName: "TARGET AUDIENCE"};
        this.title = {result: null , printFn: printFunctions.printStringProp, printName: "ACTIVITY TITLE"};

        // SPECIAL SECTIONS (JSON)
        this.cmeReviewers = {result: null, printFn: printFunctions.printContributors, printName: "CME REVIEWER DISCLOSURES"}; 

        // SPECIAL SECTIONS (XML)  
        this.clinicalContext = {result: null, printFn: printFunctions.printXMLProp, printName: "CLINICAL CONTEXT"};
        this.synopsisAndPerspective = {result: null, printFn: printFunctions.printXMLProp, printName: "STUDY SYNOPSIS AND PERSPECTIVE"};
        this.studyHighlights = {result: null, printFn: printFunctions.printXMLProp, printName: "STUDY HIGHLIGHTS"};
        this.clinicalImplications = {result: null, printFn: printFunctions.printXMLProp, printName: "CLINICAL IMPLICATIONS"};
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //--------------------------------
}

module.exports = BriefChecklist;