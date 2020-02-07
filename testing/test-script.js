const fs = require('fs');
const clean = require('../utils').cleanHTML;
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
cleaned = cleaned.replace(timestampRegex, "$1.000 --> $2.000 align:middle line:90%")


fs.writeFileSync('./output-without-tags.vtt', cleaned)
cleaned = cleaned.replace(/(90%\n)(?:\n){1,}/g, '$1')
cleaned = cleaned.replace(/(?:\n){2,}/g, '\n\n')
