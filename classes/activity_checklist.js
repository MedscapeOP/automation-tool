const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const {stripIndent} = require('common-tags');
const ArticleChecklist = require("./article_checklist");

class ActivityChecklist extends ArticleChecklist{
    constructor() {  
        super();
        // this.creditsAvailable = {result: null, printFn: printFunctions.printStringProp, printName: "CREDITS AVAILABLE"};
        this.goalStatement = {result: null, printFn: printFunctions.printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printFunctions.printLearningObjectives, printName: "LEARNING OBJECTIVES"};       
        this.targetAudience = {result: null , printFn: printFunctions.printStringProp, printName: "TARGET AUDIENCE"};
        this.title = {result: null , printFn: printFunctions.printStringProp, printName: "ACTIVITY TITLE"};

        // SPECIAL SECTIONS (JSON)
        this.cmeReviewers = {result: null, printFn: printFunctions.printContributors, printName: "CME REVIEWER DISCLOSURES"}; 
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //--------------------------------
}

module.exports = ActivityChecklist;