const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

let daysRegexArray = [
    /.*Sunday,.*/gi,
    /.*Monday,.*/gi,
    /.*Tuesday,.*/gi,
    /.*Wednesday,.*/gi,
    /.*Thursday,.*/gi,
    /.*Friday,.*/gi,
    /.*Saturday,.*/gi 
];

let monthsRegexArray = [
    /.*January.*/gi,
    /.*February.*/gi,
    /.*March.*/gi,
    /.*April.*/gi,
    /.*May.*/gi,
    /.*June.*/gi,
    /.*July.*/gi,
    /.*August.*/gi,
    /.*September.*/gi,
    /.*October.*/gi,
    /.*November.*/gi,
    /.*December.*/gi 
];

// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var result = {};
    var startRegExp = /<strong>Date &amp; Time:/g;
    var endRegExp = /<\/a>Speakers\/Program Info\/Faculty information\/Disclosures/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    var dateRegExp = stringOps.getNextRegex(textBlock, daysRegexArray);
    if (dateRegExp != -1) {
        var {label: date, textBlock: time} = stringOps.getTextBlock(textBlock, dateRegExp.symbol, endRegExp, true, false);
        result.date = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(date))).trim();
        result.time = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(time))).trim();
        return result;
    } 
    dateRegExp = stringOps.getNextRegex(textBlock, monthsRegexArray);
    if (dateRegExp != -1) {
        var dateAndTime = textBlock.match(dateRegExp.symbol)[0].split('at');
        var date = dateAndTime[0];
        var time = dateAndTime[1];

        result.date = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(date))).trim();
        result.time = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(time))).trim();
        return result;
    }
};


module.exports = exportObject;