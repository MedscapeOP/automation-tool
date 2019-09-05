const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');


let creditRegExpArray = [
    /.*and allocated it (\d+\.\d+) continuing professional.*/gi,
    /.*for a maximum of (\d+\.\d+) <em>AMA PRA.*/gi,
    /.*for a maximum of (\d+\.\d+).*/gi
];

let removeRegexArray = [
    /.*for a maximum of X\.X.*/gi,
    /.*For Physicians.*/gi,
    /.*For nurses.*/gi,
    /.*e\.g\.:.*/gi
];

let creditRegExp = /(\d+\.\d+)/;

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var startRegExp = /<u>CREDITS.*/g;
    var endRegExp = /<\/html>/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
    // console.log("TEXTBLOCK FOR CREDITS: ", cleanBlock);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No credits available found in the prodticket");
    } else {  
        var creditAmount = textBlock.match(creditRegExp);
        // console.log("CREDIT AMOUNT REGEX: ", creditAmountLineRegExp);
        var result;
        if (creditAmount.length >= 1) {
            result = creditAmount[0];
            // console.log("RESULT: ", result);
            return cleanHTML.plainText(result, removeFluff=false).trim();
        } else {
            return "No Credit Available Section In Prodticket";
        }
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
        var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp.symbol, endRegExp.symbol, true, false);
        // console.log("SYMBOLS: ", startRegExp.symbol + " " + endRegExp.symbol);
        // console.log("TEXTBLOCK: ", textBlock);

        if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
            throw new Error("No credits available found in the prodticket");
        } else {  
            var creditAmountLineRegExp = stringOps.getNextRegex(textBlock, creditRegExpArray);
            // console.log("CREDIT AMOUNT REGEX: ", creditAmountLineRegExp);
            var result;
            if (creditAmountLineRegExp != -1) {
                result = textBlock.match(creditAmountLineRegExp.symbol)[0];
                // console.log("RESULT: ", result);
                result = result.replace(creditAmountLineRegExp.symbol, '$1');
                result = cleanHTML.plainText(result, removeFluff=false).trim();
                return result;
            } else {
                return "No Credit Available Section In Prodticket";
            }
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

    var cleanBlock = stringOps.removeRegexMatches(textBlock, removeRegexArray);
    // console.log("TEXTBLOCK FOR CREDITS: ", cleanBlock);

    if (stringOps.isEmptyString(cleanBlock) || stringOps.isBlankOrWhiteSpace(cleanBlock) || cleanBlock.length < 10) {
        throw new Error("No credits available found in the prodticket");
    } else {  
        var creditAmountLineRegExp = stringOps.getNextRegex(cleanBlock, creditRegExpArray);
        // console.log("CREDIT AMOUNT REGEX: ", creditAmountLineRegExp);
        var result;
        if (creditAmountLineRegExp != -1) {
            // result = cleanBlock.match(creditAmountLineRegExp.symbol)[1];
            result = cleanBlock.replace(creditAmountLineRegExp.symbol, '$1');
            // console.log("RESULT: ", result);
            result = cleanHTML.plainText(result, removeFluff=false).trim();
            return result;
        } else {
            return "No Credit Available Section In Prodticket";
        }
    }
};

// Test and Teach  
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
};

module.exports = exportObject;