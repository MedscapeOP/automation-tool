const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');
const _ = require('lodash');

var collectionPages = config.collectionPages;
var exportObject = {};

// Clinical Brief
exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    throw new Error("No Collection Pages in Clinical Briefs!");
}

/*
Get Text block from 'Collection Page Details' to
"Add to other publications or pages"

Remove fluff

check if &#9746; No 
check if &#9746; Yes 

If No return null
Else:
    - Scrub the Yes line for information. 
*/
// Spotlight
exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    var startRegExp = /.*Collection Page Details.*/gi;
    var endRegExp = /.*Add to other publications or pages.*/gi;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
    var noIndex = stringOps.regexIndexOf(textBlock, /&#9746; No/g);
    var yesIndex = stringOps.regexIndexOf(textBlock, /&#9746; Yes/g);

    var collectionPageInfo = null;    
    if (yesIndex != -1) {        
        var pageURL = textBlock.match(/.*&#9746; Yes.*/g)[0];
        pageURL = stringOps.removeFromRegexCapture(pageURL, /.*&#9746; Yes.*/g, /.*https:/g);
        pageURL = pageURL.replace(/<p>|<\/p>/g, "");
        pageURL = `https:${pageURL}`;
        return _.find(collectionPages, ['url', pageURL]);
    } else if (noIndex == -1) {
        throw new Error("Prodticket doesn't have correct checkboxes for collection page info. Check manually.");
    } else {
        return collectionPageInfo;
    }
}


// Curbside
exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Video Lecture
exportObject[config.programs.videoLecture.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// First Response
exportObject[config.programs.firstResponse.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Enduring 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

// Town Hall Cert Page 
var townHallStartRegExps = [
    /.*Is there a collection page\?.*/g
];
var townHallEndRegExps = [
    /.*Add to other publications or pages.*/g
];
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var startRegExp = stringOps.getUsableRegExp(ticketHTML, townHallStartRegExps);
    var endRegExp = stringOps.getUsableRegExp(ticketHTML, townHallEndRegExps);
    if (startRegExp == -1 || endRegExp == -1) {
        throw new Error("No collection page info found in the prodticket");
    } else {
        var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, false);
        var noIndex = stringOps.regexIndexOf(textBlock, /&#9746; No/g);
        var yesIndex = stringOps.regexIndexOf(textBlock, /&#9746; Yes/g);
    
        var collectionPageInfo = null;    
        if (yesIndex != -1) {        
            var pageURL = textBlock.match(/.*&#9746; Yes.*/g)[0];
            pageURL = stringOps.removeFromRegexCapture(pageURL, /.*&#9746; Yes.*/g, /.*https:/g);
            pageURL = pageURL.replace(/<p>|<\/p>/g, "");
            pageURL = `https:${pageURL}`;
            return _.find(collectionPages, ['url', pageURL]);
        } else if (noIndex == -1) {
            throw new Error("Prodticket doesn't have correct checkboxes for collection page info. Check manually.");
        } else {
            return collectionPageInfo;
        }
    }
}

// Test and Teach 
exportObject[config.programs.testAndTeach.codeName] = function (ticketHTML) {
    return exportObject[config.programs.spotlight.codeName](ticketHTML);
}

module.exports = exportObject;