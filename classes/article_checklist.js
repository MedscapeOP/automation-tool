const _ = require('lodash');
const utils = require('../utils');
const {stripIndent} = require('common-tags');

/* 
Set up functions outside of the class. (USING THIS APPROACH FIRST)
    - Upon construction just assign the proper function to be the print function 
    - The functions would just take in the object and work with it.
        EXAMPLE INTERFACE/USAGE: checklist.abbreviations.printFn(checklist.abbreviations);

This class is meant to be used to pretty-print prodticket information to an output text file.         
*/
function printStringProp(property) {
    return ` 
    -----------------------------------------
    ${property.printName}
    -----------------------------------------
    ${property.result}
    `;
}

function printProgramDetails(programDetails) {
    // return JSON.stringify(programDetails, undefined, 2);
    var resultString = ` 
    -----------------------------------------
    ${programDetails.printName}
    -----------------------------------------
    `;    
    for (var i = 0; i < programDetails.result.length; i++) {
        resultString += "\n" + programDetails.result[i].toHTMLString();
    }
    return resultString;
}

function printContributors(contributors) {
    var resultString = stripIndent` 
    -----------------------------------------
    ${contributors.printName}
    -----------------------------------------
    `;
    resultString += "\n\n";  

    var newString = "";
    for (var i = 0; i < contributors.result.length; i++) {
        newString = stripIndent`
        -- TITLE ${i+1} ---------------------
        ${contributors.result[i].title}

        -- NAME ${i+1} ---------------------
        ${contributors.result[i].name}

        -- AFFILIATION ${i+1} ---------------------
        ${contributors.result[i].affiliation}

        -- DISCLOSURE ${i+1} ---------------------
        ${contributors.result[i].disclosure}
        `;
        resultString += newString + "\n\n\n";
    }    
    return utils.cleanHTML.cleanEntities(resultString);
}

function printSlides(slideComponents) {
    var resultString = stripIndent` 
    -----------------------------------------
    ${slideComponents.printName}
    -----------------------------------------
    `;
    resultString += "\n\n";  

    var newString = "";
    for (var i = 0; i < slideComponents.result.length; i++) {
        newString = stripIndent`
        -- COMPONENT ${i+1} SLIDES ---------------------
        ${utils.cleanHTML.slidesFinal(utils.cleanHTML.slidesInitial(slideComponents.result[i].rawSlides))}
        `;
        resultString += newString + "\n\n\n";
    }    
    // return utils.cleanHTML.cleanEntities(resultString);
    return resultString;
}

function printComponents(components) {
    var resultString = stripIndent` 
    -----------------------------------------
    ${components.printName}
    -----------------------------------------
    `;
    resultString += "\n\n";  

    var newString = "";
    for (var i = 0; i < components.result.length; i++) {
        newString = stripIndent`
        -- COMPONENT ${i+1} ---------------------
        ${components.result[i].title}

        -- TEASER ${i+1} ---------------------
        ${components.result[i].teaser}

        -- BYLINE ${i+1} ---------------------
        ${components.result[i].byline}

        -- CONTENT TYPE ${i+1} ---------------------
        ${components.result[i].contentType}
        `;
        resultString += newString + "\n\n\n";
    }    
    return resultString;
}

function printDateTime(dateTime) {
    var resultString = stripIndent` 
    -----------------------------------------
    ${dateTime.printName}
    -----------------------------------------
    `;
    resultString += "\n\n";  

    var newString = stripIndent`
    -- DATE ---------------------
    ${dateTime.result.date}

    -- TIME ---------------------
    ${dateTime.result.time}
    `;
    resultString += newString + "\n\n\n";  
    return (resultString);
} 


class ArticleChecklist {
    constructor() {
        this.abbreviations = {result: null, printFn: printStringProp, printName: "ABBREVIATIONS"};
        this.accreditationStatement = {result: null, printFn: printStringProp, printName: "ACCREDITATION STATEMENT"};
        this.activityOverview = {result: null, printFn: printStringProp, printName: "ACTIVITY OVERVIEW"};
        this.associationDisclaimer = {result: null, printFn: printStringProp, printName: "ASSOCIATION DISCLAIMER STATEMENT"};
        this.byline = {result: null, printFn: printStringProp, printName: "CONTRIBUTOR BYLINE"};
        this.collectionPageInfo = {result: null, printFn: printStringProp, printName: "COLLECTION PAGE INFO"};
        this.creditsAvailable = {result: null, printFn: printStringProp, printName: "CREDITS AVAILABLE"};
        this.downloadableSlides = {result: null, printFn: printStringProp, printName: "DOWNLOADABLE SLIDES SNIPPET"}
        this.goalStatement = {result: null, printFn: printStringProp, printName: "GOAL STATEMENT"};
        this.learningObjectives = {result: null, printFn: printStringProp, printName: "LEARNING OBJECTIVES"};
        this.locationInfo = {result: null , printFn: printStringProp, printName: "LOCATION INFORMATION"};
        this.peerReviewer = {result: null , printFn: printStringProp, printName: "PEER REVIEWER"};
        this.references = {result: null , printFn: printStringProp, printName: "REFERENCES"};
        this.supporter = {result: null , printFn: printStringProp, printName: "SUPPORTER"};
        this.targetAudience = {result: null , printFn: printStringProp, printName: "TARGET AUDIENCE"};
        this.teaser = {result: null , printFn: printStringProp, printName: "TEASER"};
        this.title = {result: null , printFn: printStringProp, printName: "TITLE"};

        // SPECIAL PRINT FUNCTIONS 
        this.components = {result: null, printFn: printComponents, printName: "ARTICLE COMPONENTS"};
        this.slides = {result: null , printFn: printSlides, printName: "SLIDES"}; 
        this.programDetails = {result: null , printFn: printProgramDetails, printName: "PROGRAM DETAILS"};
        this.dateTime = {result: null, printFn: printDateTime, printName: "EVENT DATE AND TIME"}; 
        this.contributors = {result: null, printFn: printContributors, printName: "CONTRIBUTOR DISCLOSURES AND AFFILIATIONS"}; 
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 

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
        for (var i = 0; i < checklistProperties.length; i++) {
            prop = checklistProperties[i];
            // Add Property to result object 
            result.properties[prop] = this[prop];

            if (result.properties[prop].result instanceof Error) {
                // If instance of error insert error message and set .result to null
                var error = result.properties[prop].result;                
                result.printHTML += stripIndent` 
                -----------------------------------------
                ${result.properties[prop].printName}
                -----------------------------------------
                `;
                result.printHTML += "\n\n";  
            
                var newString = stripIndent`
                -- ERROR ---------------------
                ${error.message}
                `;
                result.printHTML += newString + "\n\n\n";                
                // Set result of property to be null 
                result.properties[prop].result = null;
            } else {
                result.printHTML += result.properties[prop].printFn(result.properties[prop]);
            }
        }
        return result;
    }
}

const checklistProperties = Object.getOwnPropertyNames(ArticleChecklist.prototype);

module.exports = ArticleChecklist;

/*
*/