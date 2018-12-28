const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');


let creditRegExpArray = [
    /and allocated it (\d+\.\d+) continuing professional /,
    /for a maximum of (\d+\.\d+) <em>AMA PRA/
];

let creditRegExp = /(\d+\.\d+)/;

var exportObject = {};

// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Credit Available.*/g;
    var endRegExp = /<p><strong>Accreditation Statement/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No credits available found in the prodticket");
    } else {  
        var creditAmountLineRegExp = stringOps.getNextRegex(textBlock, creditRegExpArray);
        var result;
        if (creditAmountLineRegExp != -1) {
            result = textBlock.match(creditAmountLineRegExp.symbol)[1];
            result = cleanHTML.plainText(result, removeFluff=false).trim();
            return result;
        } else {
            return "No Credit Available Section In Prodticket";
        }
    }
};


module.exports = exportObject;