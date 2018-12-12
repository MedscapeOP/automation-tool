const _ = require('lodash');
/* 
Strategies: 
1) Use getters and setters to return properties. (MAYBE THIS APPROACH)
    GETTERS:
    - Assign a print function to the corresponding private member and return the updated object.
    SETTERS: 
    - Take in a new result and assign it to the corresponding properties.result member.

2) Create static methods geared towards particular properties (NOT USING THIS APPROACH)
    - To get this working we would need to dynamically determine which method is appropriate for 
      the properties in question.
    - THEORETICAL APPROACH: Use Symbols

3) Set up functions outside of the class. (MAYBE THIS APPROACH)
    - Upon construction just assign the proper function to be the print function 
    - The functions would just take in the object and work with it.
        EXAMPLE INTERFACE/USAGE: checklist.abbreviations.printFn(checklist.abbreviations);

*/
function printStringProp(property) {
    return ` 
    
    `;
}

function printProgramDetails(programDetails) {
    return `
    
    `;
}

function printContributors(contributors) {
    return `
    
    `;
}

function printSlides(slideComponents) {
    return `
    
    `;
}

function printComponents(components) {
    return `
    
    `;
}

function printDateTime(dateTime) {
    return `
    
    `;
} 

class ArticleChecklist {
    constructor() {
        this.abbreviations = {result: null, printFn: printStringProp, printName: "ABBREVIATIONS"};
        this.accreditationStatement = {result: null, printFn: printStringProp, printName: "ACCREDITATION STATEMENT"};
        this.activityOverview = {result: null, printFn: printStringProp, printName: "ACTIVITY OVERVIEW"};
        this.associationDisclaimer = {result: null, printFn: printStringProp, printName: "ASSOCIATION DISCLAIMER STATEMENT"};
        this.byline = {result: null, printFn: printStringProp, printName: "CONTRIBUTOR BYLINE"};
        this.creditsAvailable = {result: null, printFn: printStringProp, printName: "CREDITS AVAILABLE"};
        this.goalStatement = {result: null, printFn: printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printStringProp, printName: "LEARNING OBJECTIVES"};
        this.locationInfo = {result: null , printFn: printStringProp, printName: "LOCATION INFORMATION"};
        this.peerReviewer = {result: null , printFn: printStringProp, printName: "PEER REVIEWER"};
        this.references = {result: null , printFn: printStringProp, printName: "REFERENCES"};
        this.supporter = {result: null , printFn: printStringProp, printName: "SUPPORTER"};
        this.targetAudience = {result: null , printFn: printStringProp, printName: "TARGET AUDIENCE"};
        this.teaser = {result: null , printFn: printStringProp, printName: "TEASER"};
        this.title = {result: null , printFn: printStringProp, printName: "TITLE"};
        this.components = {result: null, printFn: printComponents, printName: "ARTICLE COMPONENTS"}; // Special Print
        this.slides = {result: null , printFn: printSlides, printName: "SLIDES"}; // Special Print
        this.programDetails = {result: null , printFn: printProgramDetails, printName: "PROGRAM DETAILS"}; // Special Print
        this.dateTime = {result: null, printFn: printDateTime, printName: "DATE AND TIME"}; // Special Print
        this.contributors = {result: null, printFn: printContributors, printName: "CONTRIBUTOR DISCLOSURES AND AFFILIATIONS"}; // Special Print
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 


    //--------------------------------
    // METHODS 
    //-------------------------------- 
}

module.exports = ArticleChecklist;

/*
*/