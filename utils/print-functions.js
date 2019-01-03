const cleanHTML = require('./clean-html');
const {stripIndent} = require('common-tags');

/* 
Set up functions outside of the class. (USING THIS APPROACH FIRST)
    - Upon construction just assign the proper function to be the print function 
    - The functions would just take in the object and work with it.
        EXAMPLE INTERFACE/USAGE: checklist.abbreviations.printFn(checklist.abbreviations);

This class is meant to be used to pretty-print prodticket information to an output text file.         
*/
function printStringProp(property) {
    return stripIndent`
    -----------------------------------------
    ${property.printName}
    -----------------------------------------
    ${property.result}
    ` + "\n\n\n\n\n";
}

function printProgramDetails(programDetails) {
    // return JSON.stringify(programDetails, undefined, 2);
    var resultString = stripIndent` 
    -----------------------------------------
    ${programDetails.printName}
    -----------------------------------------
    `;    
    for (var i = 0; i < programDetails.result.length; i++) {
        resultString += "\n" + programDetails.result[i].toHTMLString();
    }
    return resultString + "\n\n\n\n\n";
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
        if (i == contributors.result.length - 1) {
            resultString += newString;
        } else {
            resultString += newString + "\n\n\n";
        }
    }    
    return cleanHTML.cleanEntities(resultString) + "\n\n\n\n\n";
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
        ${cleanHTML.slidesFinal(cleanHTML.slidesInitial(slideComponents.result[i].rawSlides))}
        `;
        resultString += newString + "\n\n\n\n\n";
    }    
    // return cleanHTML.cleanEntities(resultString);
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
        if (i == components.result.length - 1) {
            resultString += newString;
        } else {
            resultString += newString + "\n\n";
        }
    }    
    return resultString + "\n\n\n\n\n";
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
    resultString += newString + "\n\n\n\n\n";  
    return (resultString);
} 

module.exports = {
    printStringProp,
    printProgramDetails,
    printContributors,
    printSlides,
    printComponents,
    printDateTime
}