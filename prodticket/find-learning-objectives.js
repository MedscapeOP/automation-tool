const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};
/* 
Base Statement: CB 
<p>Upon completion of this activity, participants will be able to:</p>

Base Statement: SL, CC
Upon completion of this activity, participants will:
*/ 

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Upon completion of this activity.*/g;
    var endRegExp = /.*Questions \(Evaluations.*/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    textBlock = cleanHTML.learningObjectives(textBlock);
    var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var startRegExp = /Upon completion of this activity.*/g;
    var endRegExp = /.*<strong>Clinical Context.*/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);

    textBlock = cleanHTML.learningObjectives(textBlock);
    // var result = cleanHTML.unorderedList(textBlock, false);
    // result = `
    // <p>Upon completion of this activity, participants will be able to:</p> 
    // ${result} 
    // `;
    var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};

module.exports = exportObject;