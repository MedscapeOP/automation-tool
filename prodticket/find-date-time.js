const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

// Town Hall Cert 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var result = {};
    var startRegExp = /<strong>Date &amp; Time:/g;
    var endRegExp = /<\/a>Speakers\/Program Info\/Faculty information\/Disclosures/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No event date/time found in the prodticket");
    } else {  
        var dateRegExp = stringOps.getNextRegex(textBlock, config.dates.daysRegexArray);
        if (dateRegExp != -1) {
            var {label: date, textBlock: time} = stringOps.getTextBlock(textBlock, dateRegExp.symbol, endRegExp, true, false);
            result.date = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(date))).trim();
            result.time = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(time))).trim();
            return result;
        } 
        dateRegExp = stringOps.getNextRegex(textBlock, config.dates.monthsRegexArray);
        if (dateRegExp != -1) {
            var dateAndTime = textBlock.match(dateRegExp.symbol)[0].split('at');
            var date = dateAndTime[0];
            var time = dateAndTime[1];

            result.date = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(date))).trim();
            result.time = cleanHTML.cleanEntities(cleanHTML.plainText(cleanHTML.insertEntityPlaceholders(time))).trim();
            return result;
        }
    }
};


module.exports = exportObject;