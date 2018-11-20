const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};


// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Accreditation Statement/g;
    var endRegExp = /<\/a>Add to Calendar info/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, false, false);

    if (textBlock) {
        var index1 = stringOps.regexIndexOf(textBlock, startRegExp);
        var index2 = stringOps.regexIndexOf(textBlock, startRegExp, index1 + 1);
    
        var result = textBlock;
        // console.log(result);
        if (index2 != -1) {
            result = result.substring(index2).replace(startRegExp, "");
        }
    
        result = cleanHTML.onlyParagraphTags(result, removeFluff=false).trim();
        return result;
    } 
    textBlock = stringOps.getTextBlock(ticketHTML, startRegExp, /<\/a>Supporter\/Partner/g, false, false).textBlock;
    if (textBlock) {
        var forProfessionalRegExp = /<p>For.*<\/p>/g;
        var index = stringOps.regexIndexOf(textBlock, forProfessionalRegExp);
    
        var result = textBlock;
        // console.log(result);
        if (index != -1) {
            result = result.substring(index).replace(forProfessionalRegExp, "");
        }
    
        result = cleanHTML.onlyParagraphTags(result, removeFluff=false).trim();
        return result;
    }
};


module.exports = exportObject;