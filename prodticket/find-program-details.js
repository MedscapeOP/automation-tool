const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

function buildProgramDetails(string, fn) {
    
}

// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Program Details.*/g;
    var endRegExp = /<\/a>Activity Information/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    textBlock = stringOps.getTextBlock(textBlock, /<p>Question &amp; Answer/g, endRegExp, true, false).textBlock;
    
    var dateRegExp = stringOps.getNextRegex(textBlock, config.dates.monthsRegexArray);
    
    if (dateRegExp != -1) { 
        textBlock = textBlock.replace(dateRegExp.symbol, "").replace(/.*&#8211;.*/gi, "");
        console.log(textBlock);
    }

    var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};


module.exports = exportObject;