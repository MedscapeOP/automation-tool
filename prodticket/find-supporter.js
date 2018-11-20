const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};


// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Supporter information.*/g;
    var endRegExp = /<strong>Supporter badge/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
    
    var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};


module.exports = exportObject;