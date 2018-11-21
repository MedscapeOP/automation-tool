const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};


// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Association Disclaimer Statement.*/g;
    var endRegExp = /<\/a>Right-side Content<\/h2>/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    textBlock = textBlock.replace(/\(e.g., Disclaimer:.*/g, "");
    var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};


module.exports = exportObject;