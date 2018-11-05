const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    var result = `
    <p>The goal of this activity is to provide medical news to primary care clinicians and other healthcare professionals in order to enhance patient care.</p>
    `;
    return result;
};

// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Goal Statement.*/g;
    var endRegExp = /<p>The goal of this activity.*/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    // var removeRegExp = /<p>The goal of this activity.*/
    // textBlock = textBlock.replace(removeRegExp, '');

    var result = cleanHTML.singleLine(cleanHTML.onlyParagraphTags(textBlock)).trim();
    return `${result}`;
};

// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}


module.exports = exportObject;