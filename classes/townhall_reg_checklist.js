const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const ArticleChecklist = require('./article_checklist');

class TownHallRegChecklist extends ArticleChecklist {
    constructor() {
        super();

        this.accreditationStatement = {result: null, printFn: printFunctions.printStringProp, printName: "ACCREDITATION STATEMENT"};
        this.activityOverview = {result: null, printFn: printFunctions.printStringProp, printName: "ACTIVITY OVERVIEW"};
        this.associationDisclaimer = {result: null, printFn: printFunctions.printStringProp, printName: "ASSOCIATION DISCLAIMER STATEMENT"};
        this.byline = {result: null, printFn: printFunctions.printStringProp, printName: "CONTRIBUTOR BYLINE"};    
        this.creditsAvailable = {result: null, printFn: printFunctions.printStringProp, printName: "CREDITS AVAILABLE"};
        this.downloadableSlides = {result: null, printFn: printFunctions.printStringProp, printName: "DOWNLOADABLE SLIDES SNIPPET"}
        this.goalStatement = {result: null, printFn: printFunctions.printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printFunctions.printLearningObjectives, printName: "LEARNING OBJECTIVES"};
        this.locationInfo = {result: null , printFn: printFunctions.printStringProp, printName: "LOCATION INFORMATION"};        
        this.supporter = {result: null , printFn: printFunctions.printStringProp, printName: "SUPPORTER"};
        this.targetAudience = {result: null , printFn: printFunctions.printStringProp, printName: "TARGET AUDIENCE"};
        this.teaser = {result: null , printFn: printFunctions.printStringProp, printName: "TEASER"};
        this.title = {result: null , printFn: printFunctions.printStringProp, printName: "TITLE"};

        // SPECIAL PRINT FUNCTIONS 
        this.programDetails = {result: null , printFn: printFunctions.printProgramDetails, printName: "PROGRAM DETAILS"};
        this.dateTime = {result: null, printFn: printFunctions.printDateTime, printName: "EVENT DATE AND TIME"}; 
        this.contributors = {result: null, printFn: printFunctions.printContributors, printName: "CONTRIBUTOR DISCLOSURES AND AFFILIATIONS"}; 
    }
    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 

    //--------------------------------
    // METHODS 
    //-------------------------------- 
}

// const propertyNames = Object.getOwnPropertyNames(ArticleChecklist.prototype);

module.exports = TownHallRegChecklist;

/*
*/