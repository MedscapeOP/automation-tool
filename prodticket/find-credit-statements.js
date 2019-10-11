const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');
const snippets = require('../snippets');


let getCreditStatement = (ticketHTML, startRegex, endRegex, returnRegex) => {
    return stringOps.getTextWithinBlock(ticketHTML, startRegex, endRegex, returnRegex);
}

let getBriefCreditStatement = (ticketHTML, eligibility) => {
    var match = ticketHTML.match(eligibility.briefRegex);
    if (match && typeof match === "object") {
        return true; 
    } else {
        return null;
    }
}

let getCreditAmount = (textBlock) => {
    var creditAmount = textBlock.match(creditRegExp);
    // console.log("CREDIT AMOUNT REGEX: ", creditAmountLineRegExp);
    if (creditAmount.length >= 1) {
        creditAmount = creditAmount[0];
        // console.log("RESULT: ", result);
        creditAmount = parseFloat(cleanHTML.plainText(creditAmount, removeFluff=false).trim());
    } else {
        creditAmount = null;
    }
    return creditAmount;
}

let getUAN = (textBlock) => {
    var match = textBlock.match(/(?:[A-Z0-9]{1,}-){4,5}[A-Z0-9]/g);
    if (match && typeof match === "object") {
        return match[0]; 
    } else {
        return null;
    }
}

let checkContactHours = (textBlock) => {
    var match = textBlock.match(/<p>&#9746;.*Contact hours/);
    if (match && typeof match === "object") {
        return true; 
    } else {
        return null;
    }
}

let creditRegExp = /(\d+\.\d+)/;

var exportObject = {};

let eligibilities = [
    {
        prop: 'cme',
        briefRegex: /<p>&#9746;.*CME/g,
        startRegex: /&\#9746;\s+.*ACCME:/g,
        endRegex: /&#974.*ANCC:|.*Partner Details/g,
        returnRegex: /<p>Medscape.* designates.*/g
    },
    {
        prop: 'moc',
        briefRegex: /<p>&#9746;.*ABIM MOC/g,
        startRegex: /&\#9746;\s+.*ABIM MOC:/g,
        endRegex: /&#974.*ACPE:|.*Partner Details/g,
        // endRegex: /.*Partner Details/g,
        returnRegex: /<p>Successful completion.*/g
    },
    {
        prop: 'nurseCE',
        briefRegex: /<p>&#9746;.*Nurse/g,
        startRegex: /&#9746;.*ANCC:/g,
        endRegex: /&#974.*ABIM MOC:|.*Partner Details/g,
        returnRegex: /<p>Awarded \d+\.\d+ contact.*/g
    },
    {
        prop: 'pharmaCE',
        briefRegex: /<p>&#9746;.*ACPE CE/g,
        startRegex: /&#9746;.*ACPE:/g,
        endRegex: /&#974.*AAPA:|.*Partner Details/g,
        returnRegex: /<p>Medscape.* designates.*/g
    },
    {
        prop: 'paCE',
        briefRegex: /<p>&#9746;.*AAPA/g,
        startRegex: /&#9746;.*AAPA:/g,
        endRegex: /.*Partner Details/g,
        returnRegex: /<p>Medscape.* has been authorized by.*/g
    }    
]


// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
   var startRegExp = /<u>CREDITS.*/g;
   var endRegExp = /<\/html>/g;
   var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
   // console.log("TEXTBLOCK FOR CREDITS: ", cleanBlock);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No credits available found in the prodticket");
    } else { 
        let configObject = {};
        configObject.disclosure = snippets.activity.medscapeDisclosure();
        configObject.npCE = null;
        for (var i = 0; i < eligibilities.length; i++) {
            configObject[eligibilities[i].prop] = getBriefCreditStatement(
                textBlock, 
                eligibilities[i]
            );
        }

        configObject.creditAmount = getCreditAmount(textBlock);
        configObject.UAN = getUAN(textBlock);
        configObject.contactHours = checkContactHours(textBlock);
        // console.log(configObject);
        return snippets.activity.briefStatements(configObject);
    }
}


// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var startRegExps = [
        /<strong>Credits Available &#953;.*/g
    ];
    var endRegExps = [
        /.*<strong>Partner Details.*/g
    ];
    var startRegExp = stringOps.getNextRegex(ticketHTML, startRegExps);
    var endRegExp = stringOps.getNextRegex(ticketHTML, endRegExps);
    if (startRegExp == -1 || endRegExp == -1) {
        throw new Error("No credits available found in the prodticket");
    } else {
        var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp.symbol, endRegExp.symbol, true, true);
        // console.log("SYMBOLS: ", startRegExp.symbol + " " + endRegExp.symbol);
        // console.log("TEXTBLOCK: ", textBlock);

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No credits available found in the prodticket");
        } else {
            let result = {};
            result.disclosure = snippets.activity.medscapeDisclosure();
            result.npCE = null;
            for (var i = 0; i < eligibilities.length; i++) {
                result[eligibilities[i].prop] = getCreditStatement(
                    textBlock, 
                    eligibilities[i].startRegex, 
                    eligibilities[i].endRegex, 
                    eligibilities[i].returnRegex
                    );
            }
            return result;
        }
    }
}


// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Video Lecture 
exportObject[config.programs.videoLecture.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Enduring 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Credit Available.*/g;
    var endRegExp = /<p><strong>Accreditation Statement/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    var forPhysiciansIndex = textBlock.lastIndexOf("For Physicians");
    textBlock = textBlock.substring(forPhysiciansIndex);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No credits available found in the prodticket");
    } else {  
        console.log("Credit Statements:", textBlock);
        let result = {};
        result.disclosure = snippets.activity.medscapeDisclosure();
        result.npCE = null;
        for (var i = 0; i < eligibilities.length; i++) {
            result[eligibilities[i].prop] = null;
        }
        result['cme'] = getCreditStatement(
            textBlock, 
            /.*For Physicians.*/g, 
            /<td>.*/g, 
            /<p>Medscape,.* designates this live activity.*/g
        );
        return result;
    }
};

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

module.exports = exportObject;