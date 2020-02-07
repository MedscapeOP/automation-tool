const {TOCElement, SectionElement, SubsectionElement} = require('../classes/index');
const utils = require('../utils');
const clean = utils.cleanHTML;
const {stripIndent} = require('common-tags');

/* 
In-Language Addon Functions
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
    - Remove new lines following timestamps  
        - (?<!90%)\n(?!\d)|\n(?!\S) 
        - replace with: <1 space>  
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
    cleanedString = cleanedString.replace(timestampRegex, "$1.000 --> $2.000 align:middle line:90%")
    
    
    // fs.writeFileSync('./output-without-tags.vtt', cleaned)
    cleanedString = cleanedString.replace(/(90%\n)(?:\n){1,}/g, '$1')
    cleanedString = cleanedString.replace(/(?:\n){2,}/g, '\n\n')

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