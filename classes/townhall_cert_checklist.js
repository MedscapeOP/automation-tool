const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const ArticleChecklist = require('./article_checklist');


class TownHallCertChecklist extends ArticleChecklist {
    constructor() {
        super();
        this.abbreviations = {result: null, printFn: printFunctions.printStringProp, printName: "ABBREVIATIONS"};
        this.bkmtrFront = {result: null, printFn: printFunctions.printStringProp, printName: "BACK MATTER FRONT PAGE"};
        this.byline = {result: null, printFn: printFunctions.printStringProp, printName: "CONTRIBUTOR BYLINE"};
        this.contrbtrPreContent = {result: null, printFn: printFunctions.printStringProp, printName: "CONTENT ABOVE CONTRIBUTORS"};
        this.cpyrtHolder = {result: null, printFn: printFunctions.printStringProp, printName: "COPYRIGHT HOLDER"};
        this.goalStatement = {result: null, printFn: printFunctions.printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printFunctions.printLearningObjectives, printName: "LEARNING OBJECTIVES"};
        this.peerReviewer = {result: null , printFn: printFunctions.printStringProp, printName: "PEER REVIEWER"};
        this.targetAudience = {result: null , printFn: printFunctions.printStringProp, printName: "TARGET AUDIENCE"};
        this.title = {result: null , printFn: printFunctions.printStringProp, printName: "TITLE"};

        // SPECIAL PRINT FUNCTIONS  
        this.contributors = {result: null, printFn: printFunctions.printContributors, printName: "CONTRIBUTOR DISCLOSURES AND AFFILIATIONS"}; 
        this.cmeReviewers = {result: null, printFn: printFunctions.printContributors, printName: "CME REVIEWER DISCLOSURES"};

    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 

    //--------------------------------
    // METHODS 
    //-------------------------------- 
}

// const propertyNames = Object.getOwnPropertyNames(ArticleChecklist.prototype);

module.exports = TownHallCertChecklist;

/*
*/