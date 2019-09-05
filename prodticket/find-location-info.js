const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};


// Town Hall 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var result = {};
    // var startRegExp = /<\/a>Print\/Collateral\/Other information/g;
    // var endRegExp = /<\/a>Design Information/g;
    // var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    // var index = stringOps.regexIndexOf(textBlock, /<p>Date:.*/g);
    // index = stringOps.regexIndexOf(textBlock, /<p>Date:.*/g, index + 5);

    // textBlock = textBlock.substring(index);
    // result.address = stringOps.getTextBlock(textBlock, /<p>Location:/g, /<p>Room:/g, true, false).textBlock;
    // console.log("Result: ", result);

    // var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};


module.exports = exportObject;