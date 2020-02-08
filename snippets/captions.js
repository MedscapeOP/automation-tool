const {TOCElement, SectionElement, SubsectionElement} = require('../classes/index');
const utils = require('../utils');
const stringOps = utils.stringOps;
const clean = utils.cleanHTML;
const {stripIndent} = require('common-tags');

/* 
Utility functions 
*/

function removeLineBreaks(prevWasTimestamp, remainingString, fn) {

};



/* 
Main Functions 
*/
function buildVttFile (htmlString, articleID, language) {
    let cleanedString, fileName;
    fileName = `${articleID}_${language.videoConfigSuffix}_cc_DFXP.vtt`

    var regex = /<td .*>[w]+\d<\/td>/g;
    htmlString = htmlString.replace(regex, '');
    
    cleanedString = clean.plainText(htmlString);
    
    /*
    - Remove Spaces before timestamps and text
        - use strip indent
    - Find both time stamps 
        - (\d\d:\d\d:\d\d)\n(\d\d:\d\d:\d\d) 
    - Use regex capture to replace 
        - $1.000 --> $2.000 align:middle line:90%
    - R
    - Remove any line breaks 
        - If previous line was either timestamp or empty skip 
        - Else (previous line was content)
            - regex = new RegExp("\n(.*)")
            - substring = substring.replace(regex, "$1");
    - Insert Line Break after 90%
        - 90%\s+
        - replace with: 90%\n
    - Insert "WEBVTT" at the top followed by a line break
    - Insert 1 line break before timestamps 
        - \n(\d\d:\d\d:\d\d\.000 -->)
        - replace with: \n\n$1
    - Make extension .vtt on output  
    */
    
    // cleaned = cleaned.replace(/\s+(?=\d\d:)/g, "");
    cleanedString = stripIndent(cleanedString);
    
    // var altTimestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+\s+?(\d\d:\d\d:\d\d)/g
    var timestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+(\d\d:\d\d:\d\d)/g
    var timestampRegexShort = /(\d\d:\d\d:\d\d)/g
    cleanedString = cleanedString.replace(timestampRegex, "$1.000 --> $2.000 align:middle line:90%")
    var matches = cleanedString.match(/.*/g);


    var outputString = ""
    var isTimeStamp = false;
    for (var i = 0; i < matches.length; i++) {
        isTimeStamp = (stringOps.regexIndexOf(matches[i], timestampRegexShort) != -1) 
        if (isTimeStamp) {
            outputString += matches[i].trim() + "\n"
        } else if (stringOps.isBlankOrWhiteSpace(matches[i])) {
            continue;            
        } else if (stringOps.regexIndexOf(matches[i], /\S\w*/g) != -1) {
            outputString += " " + matches[i].trim()
        }
    }
    outputString = outputString.replace(/(\d\d:\d\d:\d\d)(.*)\s+/g, "\n\n$1$2")
    outputString = outputString.replace(/90%(.*)/g, "90%\n$1");

    cleanedString = "WEBVTT\n" + outputString.replace(/.*Please indicate the time the Closed Captioning begins.*/g, "");

    return {cleanedString, fileName};
}

function buildXmlFile (htmlString, articleID, language) {
    let cleanedString, fileName;
    fileName = `${articleID}_${language.videoConfigSuffix}_cc_DFXP.vtt`

    var regex = /<td .*>[w]+\d<\/td>/g;
    htmlString = htmlString.replace(regex, '');
    
    cleanedString = clean.plainText(htmlString);
    cleanedString = stripIndent(cleanedString);

    var timestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+(\d\d:\d\d:\d\d)/g

    return {cleanedString, fileName};
}



module.exports = {
    buildVttFile,
    buildXmlFile
};