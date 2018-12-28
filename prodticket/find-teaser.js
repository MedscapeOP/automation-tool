const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};


// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var testRegExp = /Faculty\/Author\(s\) Byline\(s\)/g;

    var startRegExp = /Teaser \(140 characters max incl. spaces\)/g;
    var endRegExp = /<strong>Location\/map info:/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No teaser info found in the prodticket");
    } else {  
        var result = textBlock;
        var index = stringOps.regexIndexOf(result, testRegExp);
        if (index != -1) {
            result = result.replace(result.substring(index), "");
        }
        result = cleanHTML.onlyParagraphTags(result, removeFluff=false).trim();
        return result;
    }
};


module.exports = exportObject;