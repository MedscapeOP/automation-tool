const {TOCElement, SectionElement, SubsectionElement} = require('../classes/index');
const utils = require('../utils');
const stringOps = utils.stringOps;
const clean = utils.cleanHTML;
const {stripIndent} = require('common-tags');

/* 
Utility functions 
*/
function generateXMLWrapper(language, bodyTags) {
    let wrapper = 
`
<?xml version="1.0" encoding="UTF-8"?>
<tt xml:lang="${language.xmlLang}" xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling">
  <body>
    <div xml:lang="${language.xmlLang}">
        ${bodyTags}
    </div>
  </body>
</tt>
`
    return wrapper;
}


/* 
Main Functions 
*/
const timestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+(\d\d:\d\d:\d\d)/g
const timestampRegexShort = /(\d\d:\d\d:\d\d)/g
function buildVttFile (htmlString, articleID, language) {
    let cleanedString, fileName;
    fileName = `${articleID}_${language.videoConfigSuffix}_cc_DFXP.vtt`

    var regex = /<td .*>[w]+\d<\/td>/g;
    htmlString = htmlString.replace(regex, '');

    var titleRemoveRegex = /<title>.*<\/title>/g;
    htmlString = htmlString.replace(titleRemoveRegex, '');
    
    cleanedString = clean.plainText(htmlString);
    cleanedString = stripIndent(cleanedString);
    
    // var altTimestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+\s+?(\d\d:\d\d:\d\d)/g
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
    fileName = `${articleID}_${language.videoConfigSuffix}_cc_DFXP.xml`

    var regex = /<td .*>[w]+\d<\/td>/g;
    htmlString = htmlString.replace(regex, '');
    
    cleanedString = clean.plainText(htmlString);
    cleanedString = stripIndent(cleanedString);

    var startIndex = stringOps.regexIndexOf(cleanedString, timestampRegexShort)

    cleanedString = cleanedString.substring(startIndex)
    
    var matches = cleanedString.match(/.*/g)
    .filter((element) => {
        return !stringOps.isBlankOrWhiteSpace(element);
    })

    var outputString = ""
    var isTimeStamp = false;
    var nextIsTimeStamp = false;
    for (var i = 0; i < matches.length; i++) {
        isTimeStamp = (stringOps.regexIndexOf(matches[i], timestampRegexShort) != -1)
        if (i + 1 < matches.length) {
            nextIsTimeStamp = (stringOps.regexIndexOf(matches[i+1], timestampRegexShort) != -1)
        }
        if (isTimeStamp && nextIsTimeStamp) {
            outputString += `<p begin="${matches[i].trim()}" end="${matches[i+1].trim()}">`
            i++; 
        } else if (!isTimeStamp && !nextIsTimeStamp) {
            outputString += `${matches[i].trim()} ${matches[i+1].trim()}</p>\n`
            i++;
        } else if (!isTimeStamp && nextIsTimeStamp) {
            outputString += `${matches[i].trim()}</p>\n`            
        } else {
            outputString += `${matches[i].trim()} --> DIDN'T GET MATCH`
        }
    }

    cleanedString = generateXMLWrapper(language, outputString);

    return {cleanedString, fileName};
}



module.exports = {
    buildVttFile,
    buildXmlFile
};