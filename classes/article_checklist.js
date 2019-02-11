const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const {stripIndent} = require('common-tags');

class ArticleChecklist {
    constructor() {
        this.abbreviations = {result: null, printFn: printFunctions.printStringProp, printName: "ABBREVIATIONS"};
        this.accreditationStatement = {result: null, printFn: printFunctions.printStringProp, printName: "ACCREDITATION STATEMENT"};
        this.activityOverview = {result: null, printFn: printFunctions.printStringProp, printName: "ACTIVITY OVERVIEW"};
        this.associationDisclaimer = {result: null, printFn: printFunctions.printStringProp, printName: "ASSOCIATION DISCLAIMER STATEMENT"};
        this.bkmtrFront = {result: null, printFn: printFunctions.printStringProp, printName: "BACK MATTER FRONT PAGE"};
        this.byline = {result: null, printFn: printFunctions.printStringProp, printName: "CONTRIBUTOR BYLINE"};
        this.collectionPageInfo = {result: null, printFn: printFunctions.printJSONProp, printName: "COLLECTION PAGE INFO"};
        this.contrbtrPreContent = {result: null, printFn: printFunctions.printStringProp, printName: "CONTENT ABOVE CONTRIBUTORS"};
        this.cpyrtHolder = {result: null, printFn: printFunctions.printStringProp, printName: "COPYRIGHT HOLDER"};
        this.creditsAvailable = {result: null, printFn: printFunctions.printStringProp, printName: "CREDITS AVAILABLE"};
        this.downloadableSlides = {result: null, printFn: printFunctions.printStringProp, printName: "DOWNLOADABLE SLIDES SNIPPET"}
        this.goalStatement = {result: null, printFn: printFunctions.printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printFunctions.printLearningObjectives, printName: "LEARNING OBJECTIVES"};
        this.locationInfo = {result: null , printFn: printFunctions.printStringProp, printName: "LOCATION INFORMATION"};
        this.peerReviewer = {result: null , printFn: printFunctions.printStringProp, printName: "PEER REVIEWER"};
        this.references = {result: null , printFn: printFunctions.printStringProp, printName: "REFERENCES"};
        this.supporter = {result: null , printFn: printFunctions.printStringProp, printName: "SUPPORTER"};
        this.targetAudience = {result: null , printFn: printFunctions.printStringProp, printName: "TARGET AUDIENCE"};
        this.teaser = {result: null , printFn: printFunctions.printStringProp, printName: "TEASER"};
        this.title = {result: null , printFn: printFunctions.printStringProp, printName: "TITLE"};
        
        // Bigger Components 
        this.components = {result: null, printFn: printFunctions.printComponents, printName: "ARTICLE COMPONENTS"};
        this.contributors = {result: null, printFn: printFunctions.printContributors, printName: "CONTRIBUTOR DISCLOSURES AND AFFILIATIONS"}; 
        this.dateTime = {result: null, printFn: printFunctions.printDateTime, printName: "EVENT DATE AND TIME"}; 
        this.programDetails = {result: null , printFn: printFunctions.printProgramDetails, printName: "PROGRAM DETAILS"};
        this.slides = {result: null , printFn: printFunctions.printSlides, printName: "SLIDES"}; 
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 
    get ownProps() {
        return Object.getOwnPropertyNames(this);
    }

    //--------------------------------
    // METHODS 
    //-------------------------------- 
    print() {
        /* 
        This should return an object literal that contains properties from the ArticleChecklist instance. 
        - The properties to include are determined by:  
            - checking if the property is an instance of Error. 
        - If so: 
            - insert the error message 
            - set .result to null 
        - The object should also contain the formatted HTML string for the checklist file. 
        */
        var result = {
            printHTML: "",
            properties: {}
        };
        var prop = null;
        var propertyNames = this.ownProps;
        for (var i = 0; i < propertyNames.length; i++) {
            prop = propertyNames[i];
            // console.log("PROPS: ", this.ownProps);
            if (this[prop].result instanceof Error) {
                // If instance of error insert error message and set .result to null
                var error = this[prop].result;                
                result.printHTML += stripIndent` 
                -----------------------------------------
                ${this[prop].printName}
                -----------------------------------------
                `;
                result.printHTML += "\n\n";  
            
                var newString = stripIndent`
                -- ERROR ---------------------
                ${error.message}
                `;
                result.printHTML += newString + "\n\n\n";
                // Add Property to result object 
                result.properties[prop] = this[prop];                
                // Set result of property to be null 
                result.properties[prop] = null;
                // console.log(result.properties[prop]);
                // console.log("RESULT: ", result.properties);
            } else if (this[prop].result !== null) {
                // Add Property to result object                 
                result.printHTML += this[prop].printFn(this[prop]);
                result.properties[prop] = this[prop];
                // console.log("PROPS: ", result.properties);
            } else {
                continue;
            }
        }
        return result;
    }
}

// const propertyNames = Object.getOwnPropertyNames(ArticleChecklist.prototype);

module.exports = ArticleChecklist;

/*
*/