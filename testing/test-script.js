const fs = require('fs');
const utils = require('../utils');
const stringOps = utils.stringOps;
const clean = utils.cleanHTML;
const {stripIndent} = require('common-tags');

var html = fs.readFileSync('./SubtitleFiles/sheet001.htm', 'utf8');
var regex = /<td .*>[w]+\d<\/td>/g;
html = html.replace(regex, '');

var cleaned = clean.plainText(html);

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
cleaned = stripIndent(cleaned);

// var altTimestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+\s+?(\d\d:\d\d:\d\d)/g
var timestampRegex = /(\d\d:\d\d:\d\d)(?:\s){0,}\n+(\d\d:\d\d:\d\d)/g
var timestampRegexShort = /(\d\d:\d\d:\d\d)/g
cleaned = cleaned.replace(timestampRegex, "$1.000 --> $2.000 align:middle line:90%")

var matches = cleaned.match(/.*/g);
// fs.writeFileSync('./output-without-tags.vtt', cleaned)
// cleaned = cleaned.replace(/(90%\n)(?:\n){1,}/g, '$1')
// cleaned = cleaned.replace(/(?:\n){2,}/g, '\n\n')

// console.log(matches)


function buildStringFromMatches(matchArray) {
    var outputString = ""
    var isTimeStamp = false;
    for (var i = 0; i < matchArray.length; i++) {
        isTimeStamp = (stringOps.regexIndexOf(matchArray[i], timestampRegexShort) != -1) 
        if (isTimeStamp) {
            outputString += matchArray[i].trim() + "\n"
        } else if (stringOps.isBlankOrWhiteSpace(matchArray[i])) {
            continue;            
        } else if (stringOps.regexIndexOf(matchArray[i], /\S\w*/g) != -1) {
            console.log("MATCH: ", matchArray[i])
            outputString += " " + matchArray[i].trim()
        }
    }
    outputString = outputString.replace(/(\d\d:\d\d:\d\d)(.*)\s+/g, "\n\n$1$2")
    outputString = outputString.replace(/90%(.*)/g, "90%\n$1");

    return outputString;
}

fs.writeFileSync('./output-line-breaks.vtt', buildStringFromMatches(matches));