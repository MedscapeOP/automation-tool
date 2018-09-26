/*

*/

const {findLastAndReplace, findFirstAndReplace} = require('./string-ops');

const testString = `
<strong>&lt;&lt;Level 2&gt;&gt; Enrichment Analysis in Primary vs Metastatic Tumors<sup>[5]</sup></strong>
&#8226;	Which of these genes are more commonly mutated in localized prostate cancer vs advanced metastatic castration-resistant prostate cancer (mCRPC)? 
&#9642;	The dots on the right-hand side of the graph of the dotted line represent genes more commonly altered in metastatic vs localized prostate cancers
<tt>o	</tt>Approximately 10% of the patients had a DNA repair mutation in their primary prostate cancer
`;

'use strict';

const testString2 = `
<ul>
    <li></li>
    <li></li>
</ul>
`;

const _ = require('lodash');
const bulletSymbol = `&#8226;`;
const subBulletSymbol = `<tt>o`;
const subSubBulletSymbol = `&#9642;`;


function findNextSymbol(substring) {
    var nextBullet = {
        index: substring.search(bulletSymbol),
        symbol: bulletSymbol,
        isInString: function () {
            return this.index != -1;
        }
    };

    var nextSubBullet = {
        index: substring.search(subBulletSymbol),
        symbol: subBulletSymbol,
        isInString: function () {
            return this.index != -1;
        }
    };

    var nextSubSubBullet = {
        index: substring.search(subSubBulletSymbol),
        symbol: subSubBulletSymbol
    };

    var options = [nextBullet, nextSubBullet, nextSubSubBullet];
    _.pullAllBy(options, [{index: -1}], 'index');

    var minimum = undefined;
    for (var i = 0; i < options.length; i++) {
        if (!minimum) {
            minimum = options[i];
        } else {
            minimum = (minimum.index > options[i].index ? options[i] : minimum);
        }
    }
    if (minimum) {
        return minimum.symbol;
    } else {
        return -1;
    }
}


// console.log(findNextSymbol(testString2));

let formatUlItems = (substring, prevSymbol, fn) => {
    // Replace &#8226; entity with <li>
    // var liRegexp = new RegExp(`&#8226;(.*)`);
    // clean = clean.replace(liRegexp, "<li>$1</li>");


    let nextSymbol = findNextSymbol(substring);

    if (nextSymbol == -1) {
        return substring;
    }

    // Main list track (DONE)
    if (prevSymbol == bulletSymbol) {

        // Case where there is new top list item. (DONE)
        if (nextSymbol == bulletSymbol) {
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, "<li>$1</li>");
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where new sub-list begins (DONE)
        if (nextSymbol == subBulletSymbol) {
            substring = findLastAndReplace(substring, '</li>', '');
            // - replace <tt>o with <ul><li>$1</li></ul>
            var liRegexp = new RegExp(subBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<ul><li>$1</li></ul>');
            return fn(substring, nextSymbol, formatUlItems);
        }
    }

    // Sub-list track "<tt>o"
    else if (prevSymbol == subBulletSymbol) {

        // Case where sub-list continues (DONE)
        if (nextSymbol == subBulletSymbol) {
            // - Find last </ul> and remove it
            substring = findLastAndReplace(substring, '</ul>', '');                
            // - replace <tt>o with <li>$1</li></ul>
            var liRegexp = new RegExp(subBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul>');
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where new sub-sub-list begins "&#9642;" (DONE)
        if (nextSymbol == subSubBulletSymbol) {
            // - Find last </ul> and remove it
            substring = findLastAndReplace(substring, "</li></ul>", '');  
            substring = findLastAndReplace(substring, "</li>", '');            
            // - replace "&#9642;" with <ul><li>$1</li></ul>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            /* POSSIBLY ADD CLOSING </li> - DONE */
            substring = substring.replace(liRegexp, '<ul><li>$1</li></ul></li></ul></li>');
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where the new list starts. (DONE) 
        if (nextSymbol == bulletSymbol) {
            // - Find last </ul> and add closing </li>
            substring = findLastAndReplace(substring, '</ul>', '</ul></li>'); 
            // - replace &#8226; with <li>
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li>');           
            return fn(substring, nextSymbol, formatUlItems);
        }            
    }

    else if (prevSymbol == subSubBulletSymbol) {

        // Case where sub-list continues (DONE)
        if (nextSymbol == subBulletSymbol) {
            // - Find last </ul> and add closing </li>

            /* OPEN UP UNTIL CLOSING OF SUB SUB */
            substring = findLastAndReplace(substring, '</ul></li>', '');            
            // - replace <tt>o with <li>$1</li></ul>
            var liRegexp = new RegExp(subBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul></li>'); 
            return fn(substring, nextSymbol, formatUlItems);
        }

        // Case where sub-sub-list continues (DONE)
        if (nextSymbol == subSubBulletSymbol) {
            // - Find last </ul> and remove it
            substring = findLastAndReplace(substring, '</ul></li>', '');
            // - replace &#9642; with <li>$1</li></ul>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul>');
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where the new list starts. (DONE)
        if (nextSymbol == bulletSymbol) {
            // - Find last </ul> and add closing </li></ul></li>
            /* OLD */
            // substring = findLastAndReplace(substring, '</ul>', '</ul></li></ul></li>');
            
            substring = findLastAndReplace(substring, '', '');
            // - replace &#8226; with <li>
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li>');
            return fn(substring, nextSymbol, formatUlItems);
        }
    } 
    
    else {
        if (nextSymbol == bulletSymbol) {
            // Case where new list starts (DONE)
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, "<li>$1</li>");
            return fn(substring, nextSymbol, formatUlItems);
        }
    }
};


var testString3 = `
<strong>&lt;&lt;insert slide [17]; 16:17&gt;&gt;</strong>

<h3> Potential Predictors of Response to Anti-TNF Treatment<sup type="ref">[11]</sup></h3>

<li>	It is unknown why certain patients achieve different responses</li>

<li>	There are several factors, which have been identified, that can help predict a response to anti-tumor necrosis factor (TNF) treatment</li>

<li>	Some differences occur once a patient has achieved a response

<ul><li>	Some patients maintain the response indefinitely</li>

<li>	Others lose response

<ul><li>	Some lose the response gradually, and some seem to lose response quite suddenly </li></ul></li>

<li>	There may be a role for doing an ADA test in these different subsets of patients

<ul><li>	More research is needed to determine the optimal place for ADA testing</li></ul></li></ul></li>

<strong>&lt;&lt;insert slide [17]; 16:17&gt;&gt;</strong>

<h3> Potential Predictors of Response to Anti-TNF Treatment<sup type="ref">[11]</sup></h3>

<li>	It is unknown why certain patients achieve different responses</li>

<li>	There are several factors, which have been identified, that can help predict a response to anti-tumor necrosis factor (TNF) treatment</li>

<li>	Some differences occur once a patient has achieved a response

<ul><li>	Some patients maintain the response indefinitely</li>

<li>	Others lose response

<ul><li>	Some lose the response gradually, and some seem to lose response quite suddenly </li></ul></li>

<li>	There may be a role for doing an ADA test in these different subsets of patients

<ul><li>	More research is needed to determine the optimal place for ADA testing</li></ul></li></ul></li>
`

function wrapUls(prevWasListItem, remainingString, fn) {
    var newLineRegExp = new RegExp('.*', 'g');
    // console.log("REMAINING STRING: ", remainingString);

    var matchArray = remainingString.match(newLineRegExp);
    var currentLine = "";
    var currentLineMatchIndex = 0;
    for(var i = 0; currentLine == ""; i++) {
        currentLine = matchArray[i];
        currentLineMatchIndex = i;
    }  

    var nextLine = ""; 
    for(var i = currentLineMatchIndex + 1; nextLine == ""; i++) {
        nextLine = matchArray[i];
    } 
    var nextLineIndex = remainingString.indexOf(nextLine);
    // console.log("CURRENT LINE", currentLine);
    // console.log("NEXT LINE", nextLine);
    
    var currentStart = currentLine.substring(0, 4);
    if (currentStart == '<ul>') {
        // Current start is already a <ul>
        if (nextLineIndex == -1 || nextLine.length < 4) {
            // Current start is a <ul> but there are no more lines 
            // Means we need to close with </ul> 
            return remainingString + '</ul>';
        }
        var nextStart = nextLine.substring(0, 4);
        if (nextStart != '<ul>' && nextStart != '<li>') {
            // Current start is a <ul> but there isn't another list item following 
            // Means we need to close with </ul> and keep going 
            return currentLine + '</ul>\n' + fn(true, remainingString.substring(nextLineIndex), wrapUls);
        }
        // There are more lines 
        // Therefore it must be already part of a nest list 
            // Dont do anything move on
        return currentLine + fn(true, remainingString.substring(nextLineIndex), wrapUls);
    }

    if (nextLineIndex == -1) {
        return remainingString;
    }
    // Cases where there are more lines 
    var nextStart = nextLine.substring(0, 4);
    if (currentStart == '<li>') {
        if ((nextStart == '<ul>' || nextStart == '<li>') && !prevWasListItem) {
            // Next line is continuing list Y
            // But previous line wasn't a list N  
            // Therefore current line is start of a list 
                // Must add opening <ul>  
            return '<ul>' + currentLine + fn(true, remainingString.substring(nextLineIndex), wrapUls);
        } else if ((nextStart == '<ul>' || nextStart == '<li>') && prevWasListItem) {
            // Next line is continuing list Y
            // Previous line was a list Y
            // Therefore current line is nested list 
                // Don't add opening <ul> 
            return currentLine + fn(true, remainingString.substring(nextLineIndex), wrapUls);
        } else if ((nextStart != '<ul>' && nextStart != '<li>') && !prevWasListItem) {
            // Next line is NOT continuing list N
            // Previous line wasn't a list N
            // Therefore current line is a one line list 
                // Must add opening <ul> AND closing </ul>
            return '<ul>' + currentLine + '</ul>' + fn(true, remainingString.substring(nextLineIndex), wrapUls);
        }
    } else {
        // Current is NOT A <ul> or <li>
        return currentLine + fn(false, remainingString.substring(nextLineIndex), wrapUls);
    }
}

console.log(wrapUls(false, testString3, wrapUls));

module.exports = {
    formatUlItems,
    wrapUls
};