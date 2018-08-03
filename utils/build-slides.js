/*
TODO: 
    - Create the slide_grp class 
    - Refactor findNextSymbol into findNextSlide  
    - Implement buildSlides() algorithm

Algorithm 
function buildSlides(string, subsectionElement, articleID = "XXXXXX") {
    - index = Find next slide (Use findNextSymbol w/ `&lt;&lt;insert slide`
    if (index != -1) {
        - Remove `&lt;&lt;insert slide` entire line      
        - substr = string.substring(0, index)
        - string = string.replace(substr, "");
        - insert substr into slide XML element content.
            - 
        - insert slide into subsectionElement
        - return buildSlides(string, subsectionElement);
    } else {
        return subsectionElement;
    }
}
*/

const testString = `
<strong>&lt;&lt;Level 2&gt;&gt; Enrichment Analysis in Primary vs Metastatic Tumors<sup>[5]</sup></strong>
&#8226;	Which of these genes are more commonly mutated in localized prostate cancer vs advanced metastatic castration-resistant prostate cancer (mCRPC)? 
&#9642;	The dots on the right-hand side of the graph of the dotted line represent genes more commonly altered in metastatic vs localized prostate cancers
<tt>o	</tt>Approximately 10% of the patients had a DNA repair mutation in their primary prostate cancer
`;

'use strict';


const _ = require('lodash');

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

function findLastAndReplace(str, removeString, replaceString) {
    var index = str.lastIndexOf(removeString);
    str = str.substring(0, index) + replaceString + str.substring(index + removeString.length, str.length);
    // str = str.replace(new RegExp(removeString + '$'), replaceString);
    return str;
}


// console.log(findNextSymbol(testString2));

let buildSlidesXML = (substring, prevSymbol, fn) => {

};


module.exports = buildSlidesXML;

