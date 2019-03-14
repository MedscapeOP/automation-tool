/*

*/

const {findLastAndReplace, findFirstAndReplace, isBlankOrWhiteSpace, isEmptyString} = require('./string-ops');

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
const fs = require('fs');
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


/**
 * @description Creates nested list items without outermost <ul>
 * - Looks for Bullet symbols: &#8226; / <tt>o / &#9642;
 * @param {*} substring 
 * @param {*} prevSymbol 
 * @param {*} fn 
 */

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
            substring = substring.replace(liRegexp, '<ul><li>$1</li></ul></li>');
            return fn(substring, nextSymbol, formatUlItems);
        }
    }

    // Sub-list track "<tt>o"
    else if (prevSymbol == subBulletSymbol) {

        // Case where sub-list continues (DONE)
        if (nextSymbol == subBulletSymbol) {
            // - Find last </ul></li> and remove it
            // Find end of bullet </li> and subBullet </ul>
            substring = findLastAndReplace(substring, '</ul></li>', '');                
            // - replace <tt>o with <li>$1</li></ul>
            var liRegexp = new RegExp(subBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul></li>');
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where new sub-sub-list begins "&#9642;" (DONE)
        if (nextSymbol == subSubBulletSymbol) {
            // - Find last </ul> and remove it
            substring = findLastAndReplace(substring, "</li></ul>", '');  
            substring = findLastAndReplace(substring, "</li>", '');            
            // - replace "&#9642;" with <ul><li>$1</li></ul>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            /* ADD CLOSING </li> - DONE */
            substring = substring.replace(liRegexp, '<ul><li>$1</li></ul></li></ul></li>');
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where the new list starts. (DONE) 
        if (nextSymbol == bulletSymbol) {
            // Dont have to replace anything just start new li 
            // substring = findLastAndReplace(substring, '', ''); 
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
        // </li></ul></li></ul></li>
        // Case where sub-sub-list continues (DONE)
        if (nextSymbol == subSubBulletSymbol) {
            // - Remove all closing tags up to last sub-sub-item 
            substring = findLastAndReplace(substring, '</ul></li></ul></li>', '');
            // - replace &#9642; with <li>$1</li></ul>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul></li></ul></li>');
            return fn(substring, nextSymbol, formatUlItems);
        }            

        // Case where the new list starts. (DONE)
        if (nextSymbol == bulletSymbol) {
            // - Don't replace anything just continue with new list item. 
            // substring = findLastAndReplace(substring, '', '');
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

/**
 * @description Inserts wrapper <ul>'s as needed. 
 * - Looks at start of each new line and determines whether to insert <ul> or </ul> 
 * - Logic based on start of line being blank, <ul>, or <li>.
 * @param {*} prevWasListItem 
 * @param {*} remainingString 
 * @param {*} fn 
 */
var logString = "";
function wrapUls(prevWasListItem, remainingString, fn) {
    // console.log("REMAINING STRING: ", remainingString);
    let newLineRegExp = new RegExp('.*', 'g');
    var matchArray = remainingString.match(newLineRegExp);
    var currentLine = "";
    var currentLineMatchIndex = 0;
    for(var i = 0; i < matchArray.length && isBlankOrWhiteSpace(currentLine); i++) {
        currentLine = matchArray[i];
        currentLineMatchIndex = i;
    }  

    if (isBlankOrWhiteSpace(currentLine)) {
        return "";
    }

    var nextLine = ""; 
    for(var i = currentLineMatchIndex + 1; i < matchArray.length && isBlankOrWhiteSpace(nextLine); i++) {
        nextLine = matchArray[i];
    } 

    var nextLineIndex = -1;
    var nextStart = "";
    var currentStart = "";
    logString +=`CURRENT LINE: ${currentLine} \n\n`;
    logString +=`NEXT LINE: ${nextLine} \n\n\n\n`; 
    // fs.writeFileSync(__dirname + "/logstring.html", logString, function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    // }); 
    // console.log("CURRENT LINE", currentLine);
    // console.log("NEXT LINE", nextLine);
    if (!isBlankOrWhiteSpace(nextLine)) {
        if (nextLine === currentLine) {
            nextLineIndex = remainingString.indexOf(nextLine) + nextLine.length;
        } else {
            nextLineIndex = remainingString.indexOf(nextLine);
        }        
        // Cases where there are more lines 
        currentLine = currentLine.trimLeft() + "\n";
        nextLine = nextLine.trimLeft() + "\n";

        if (nextLine.length >= 4) {
            nextStart = nextLine.substring(0, 4);
        }
        
        if (currentLine.length >= 4) {
            currentStart = currentLine.substring(0, 4);
        }

        remainingString = remainingString.substring(nextLineIndex);
    } else if (isBlankOrWhiteSpace(nextLine) && prevWasListItem) {
        // Cases where we are on the last line  
        // currentLine = currentLine.trimLeft() + "\n";
        currentLine = currentLine.trimLeft();
        
        if (currentLine.length >= 4) {
            currentStart = currentLine.substring(0, 4);
        }
        nextLineIndex = remainingString.indexOf(currentLine) + currentLine.length;

        remainingString = remainingString.substring(nextLineIndex);
        // return "</ul>\n";
    } 
    else {
        // END OF FUNCTION / TERMINATION-BASE CASE 
        return remainingString;
    }



    if (currentStart == '<ul>') {
        // Current start is already a <ul>
        if (nextLineIndex == -1) {
            // Current start is a <ul> but there are no more lines 
            // Means we need to close with </ul> 
            return remainingString + '</ul>\n';
        }
        if (nextStart != '<ul>' && nextStart != '<li>') {
            // Current start is a <ul> but there isn't another list item following 
            // Means we need to close with </ul> and keep going 
            return currentLine + '</ul>\n' + fn(true, remainingString, wrapUls);
        }
        // There are more lines 
        // Therefore it must be already part of a nest list 
            // Dont do anything move on
        return currentLine + fn(true, remainingString, wrapUls);
    } 
    if (currentStart == '<li>') {
        if ((nextStart == '<ul>' || nextStart == '<li>') && !prevWasListItem) {
            // Next line is continuing list Y
            // But previous line wasn't a list N  
            // Therefore current line is start of a list 
                // Must add opening <ul>  
            return '<ul>' + currentLine + fn(true, remainingString, wrapUls);
        } else if ((nextStart == '<ul>' || nextStart == '<li>') && prevWasListItem) {
            // Next line is continuing list Y
            // Previous line was a list Y
            // Therefore current line is nested list 
                // Don't add opening <ul> 
            return currentLine + fn(true, remainingString, wrapUls);
        } else if ((nextStart != '<ul>' && nextStart != '<li>') && !prevWasListItem) {
            // Next line is NOT continuing list N
            // Previous line wasn't a list N
            // Therefore current line is a one line list 
                // Must add opening <ul> AND closing </ul>
            return '<ul>' + currentLine + '</ul>\n' + fn(true, remainingString, wrapUls);
        } 
        else {
        // else if ((nextStart != '<ul>' && nextStart != '<li>') && prevWasListItem) {
            // Next line is NOT continuing list N
            // Previous line was a list Y
                // Therefore current line is the end of the current list  
            return currentLine + '</ul>\n' + fn(true, remainingString, wrapUls);
        }
    } else {
        // Current is NOT A <ul> or <li>
        // console.log("****************REMAINING STRING 353: \n\n\n", remainingString);
        return currentLine + fn(false, remainingString, wrapUls);
    }
}

// console.log(wrapUls(false, testString3, wrapUls));

module.exports = {
    formatUlItems,
    wrapUls
};