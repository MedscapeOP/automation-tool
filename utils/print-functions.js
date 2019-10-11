const cleanHTML = require('./clean-html');
const xmlOps = require('./xml-ops');
const formatLearningObjectives = require('./format-learning-objectives');
const formatQNAObjectives = require('./format-qna-objectives'); 
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

function printJSONProp(property) {
    var formattedJSON = JSON.stringify(property.result, undefined, 2);
    var resultString = stripIndent`
    -----------------------------------------
    ${property.printName}
    -----------------------------------------
    `;
    resultString += "\n";  

    var newString = stripIndent`
    ${formattedJSON}
    ` + "\n\n\n\n\n";

    return resultString + newString;
/*
{
    type: "Clinical Advances", 
    url: "https://www.medscape.org/sites/advances/anticoagulation-thrombosis",
    title: "Clinical Advances in Anticoagulation Management and Vascular Protection",
    bannerFileName: "33543-collection-header.png",
    advancesFileName: "anticoagulation-thrombosis" 
};
*/
}

function printXMLProp(property) {
    var xml = xmlOps.objectToXMLString(property.result.toObjectLiteral());
    var resultString = stripIndent`
    -----------------------------------------
    ${property.printName}
    -----------------------------------------
    `;
    resultString += "\n";  

    var newString = stripIndent`
    ${xml}
    ` + "\n\n\n\n\n";

    return resultString + newString;
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
    var title = "";
    var name = "";
    var affiliation = "";
    var disclosure = "";
    for (var i = 0; i < contributors.result.length; i++) {
        title = stripIndent`
        -- TITLE ${i+1} ---------------------
        ${contributors.result[i].title}` + "\n\n";
        
        name = stripIndent`
        -- NAME ${i+1} ---------------------
        ${contributors.result[i].name}` + "\n\n";

        affiliation = stripIndent`
        -- AFFILIATION ${i+1} ---------------------
        ${contributors.result[i].affiliation.trim()}` + "\n\n"; 
        
        disclosure = stripIndent`
        -- DISCLOSURE ${i+1} ---------------------` + "\n" + stripIndent`${contributors.result[i].disclosure}`;

        newString = title  + name + affiliation + disclosure;
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
    var slidesText = null;
    for (var i = 0; i < slideComponents.result.length; i++) {
        slidesText = cleanHTML.slidesFinal(cleanHTML.slidesInitial(slideComponents.result[i].rawSlides));
        slidesText = slidesText.replace(/<p>&lt;&lt;insert slide/g, "\n\n<p>&lt;&lt;insert slide").trim();
        newString = stripIndent`
        -- COMPONENT ${i+1} SLIDES ---------------------
        ${slidesText}
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
    var component = "";
    var teaser = "";
    var byline = "";
    var contentType = "";
    for (var i = 0; i < components.result.length; i++) {
        component = stripIndent`
        -- COMPONENT ${i+1} ---------------------
        ${components.result[i].title}` + "\n\n"; 
        
        teaser = stripIndent`
        -- TEASER ${i+1} ---------------------
        ${components.result[i].teaser}` + "\n\n"; 
        
        byline = stripIndent`
        -- BYLINE ${i+1} ---------------------
        ${components.result[i].byline}` + "\n\n"; 
        
        contentType = stripIndent`
        -- CONTENT TYPE ${i+1} ---------------------
        ${components.result[i].contentType}` + "\n\n";

        newString = component + teaser + byline + contentType;
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

    var date = stripIndent`
    -- DATE ---------------------
    ${dateTime.result.date}` + "\n\n";

    var time = stripIndent`
    -- TIME ---------------------
    ${dateTime.result.time}`;

    resultString += date + time + "\n\n\n\n\n";  
    return (resultString);
} 

function printLearningObjectives(learningObjectives) {
    var formattedObjectives = formatLearningObjectives(learningObjectives.result);
    var formattedQNAObjectives = formatQNAObjectives(learningObjectives.result);

    var resultString = stripIndent`
    -----------------------------------------
    ${learningObjectives.printName}
    -----------------------------------------
    `;
    resultString += "\n";  

    var newString = stripIndent`
    ${formattedObjectives}
    ` + "\n\n\n\n\n";

    var qnaString = stripIndent`
    -----------------------------------------
    LEARNING OBJECTIVES (QNA)
    -----------------------------------------
    `;
    qnaString += "\n";  

    var qnaObjectives = stripIndent`
    ${formattedQNAObjectives}
    ` + "\n\n\n\n\n";

    return resultString + newString + qnaString + qnaObjectives;
}

function printTestAndTeachContent(mainContent) {
    // PUT PREAMBLE TEXT BEFORE 
    var contentBlockObjectsArray = mainContent.result.contentArray;
    var contentBlockComponents = null;
    var component = null;
    var resultString = stripIndent` 
    -----------------------------------------
    ${mainContent.printName}
    -----------------------------------------    
    `;
    resultString += "\n\n"; 
    resultString += stripIndent`
    -----------------------------------------
    TOC 1: PREAMBLE TEXT -> SUBSECTION CONTENT
    -----------------------------------------
    <p>The following cases are modeled on the interactive grand rounds approach. The questions within the activity are designed to test your current knowledge. After each question, you will be able to see whether you answered correctly and read evidence-based information that supports the most appropriate answer choice. The questions are designed to challenge you; you will not be penalized for answering the questions incorrectly. At the end of the activity, there will be a short post-test assessment based on the material presented.</p>
    `
    resultString += "\n\n";  
    for (var i = 0; i < contentBlockObjectsArray.length; i++) {
        contentBlockComponents = contentBlockObjectsArray[i].objects;
        for (var a = 0; a < contentBlockComponents.length; a++) {
            component = contentBlockComponents[a]; 
            switch(component.type) {
                case "levelTwo": 
                    resultString += stripIndent` 
                    -----------------------------------------
                    TOC ${i+1}: LEVEL TWO -> SUBSECTION
                    -----------------------------------------            
                    `;
                    break;
                case "levelOne": 
                    resultString += stripIndent` 
                    -----------------------------------------
                    TOC ${i+1}: LEVEL ONE -> SECTION
                    -----------------------------------------
                    `;
                    break;
                case "figure":
                    resultString += stripIndent` 
                    -----------------------------------------
                    TOC ${i+1}: FIGURE -> SUBSECTION 
                    -----------------------------------------
                    `;
                    break;
                case "table":
                    resultString += stripIndent` 
                    -----------------------------------------
                    TOC ${i+1}: TABLE -> SUBSECTION 
                    -----------------------------------------
                    `;
                    break;
            }

            resultString += "\n\n";  
        
            var header = stripIndent`
            -- HEADER ---------------------
            ${component.label}` + "\n\n";
        
            var markup = stripIndent`
            -- SUBSECTION CONTENT MARKUP ---------------------
            ${component.textBlock}`;
        
            if ((a + 1 == contentBlockComponents.length) && (contentBlockObjectsArray[i].qnaNumber)) {
                var qnaNumber = stripIndent`
                -- INSERT QNA ---------------------
                FORM NUMBER: ${contentBlockObjectsArray[i].qnaNumber}`;
                resultString += header + markup + "\n\n" + qnaNumber + "\n\n\n";
            } else {
                resultString += header + markup + "\n\n\n\n\n";          
            }
        }
    }
    return resultString;
}

function printCreditStatements(creditStatements) {
    var cmeStatement = ``;
    if (creditStatements.cme) {
        cmeStatement = stripIndent` 
        -----------------------------------------
        CME CREDIT STATEMENT
        -----------------------------------------
        `;
        cmeStatement +="\n";
        var statement = ``;
        if (creditStatements.moc) {
            statement = stripIndent`
            ${creditStatements.cme}
            `;
            // statement += "\n\n" + stripIndent`${creditStatements.disclosure}`
            statement += "\n\n" + stripIndent`${creditStatements.moc}`
        } else {
            statement = stripIndent`
            ${creditStatements.cme}
            `;
            // statement += "\n\n" + stripIndent`${creditStatements.disclosure}`
        }
        cmeStatement += statement + "\n\n";  
    }

    var nurseCEStatement = ``;
    if (creditStatements.nurseCE) {
        nurseCEStatement = stripIndent` 
        -----------------------------------------
        NURSE CE CREDIT STATEMENT
        -----------------------------------------
        `;
        nurseCEStatement += "\n" + stripIndent`${creditStatements.nurseCE}` + "\n\n";
    }

    var pharmaCEStatement = ``;
    if (creditStatements.pharmaCE) {
        pharmaCEStatement = stripIndent` 
        -----------------------------------------
        PHARMA CE CREDIT STATEMENT
        -----------------------------------------
        `;
        pharmaCEStatement += "\n" + stripIndent`${creditStatements.pharmaCE}` + "\n\n";
    }

    var npCEStatement = ``;
    if (creditStatements.npCE) {
        npCEStatement = stripIndent` 
        -----------------------------------------
        NURSE PRACTITIONER CE CREDIT STATEMENT
        -----------------------------------------
        `;  
        npCEStatement += "\n" + stripIndent`${creditStatements.npCE}` + "\n\n";
    }

    var paCEStatement = ``;
    if (creditStatements.paCE) {
        paCEStatement = stripIndent` 
        -----------------------------------------
        PHARMA CE CREDIT STATEMENT
        -----------------------------------------
        `;
        paCEStatement += "\n" + `${creditStatements.paCE}` + "\n\n";
    }

    // return cleanHTML.cleanEntities(resultString);
    return cmeStatement + nurseCEStatement + pharmaCEStatement + npCEStatement + paCEStatement + "\n\n\n\n\n";
}


module.exports = {
    printStringProp,
    printJSONProp,
    printXMLProp,
    printProgramDetails,
    printContributors,
    printSlides,
    printComponents,
    printDateTime,
    printLearningObjectives,
    printTestAndTeachContent,
    printCreditStatements
}