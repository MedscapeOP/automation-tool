/*
    buildList(substring, prevSymbol) {
        nextSymbol = Find(&#8226; || <tt>o || &#9642;);

        // Main list track (DONE)
        if (prevSymbol == "&#8226;") {

            // Case where the new list starts. (DONE)
            - If (nextSymbol == "&#8226;")
                - replace &#8226; with <li>
                return buildList(substring, nextSymbol);

            // Case where new sub-list begins (DONE)
            - if (nextSymbol == <tt>o)
                - Find last </li> and remove it
                    - substring = substring.replace(new RegExp('</li>$'), '');
                - replace <tt>o with <ul><li>$1</li></ul>
                return buildList(substring, nextSymbol);
        }

        // Sub-list track 
        else if (prevSymbol == "<tt>o") {

            // Case where sub-list continues (DONE)
            - if (nextSymbol == "<tt>o")
                - Find last </ul> and remove it
                    - substring = substring.replace(new RegExp('</ul>$'), '');
                - replace <tt>o with <li>$1</li></ul>
                return buildList(substring, nextSymbol);

            // Case where new sub-sub-list begins (DONE)
            - if (nextSymbol == "&#9642;")
                - Find last </ul> and remove it
                    - substring = substring.replace(new RegExp('</ul>$'), '');
                - Find last </li> and remove it
                    - substring = substring.replace(new RegExp('</li>$'), '');
                - replace <tt>o with <ul><li>$1</li></ul>
                return buildList(substring, nextSymbol);

            // Case where the new list starts. (DONE) 
            - If (nextSymbol == "&#8226;") 
                - Find last </ul> and add closing </li>
                - substring = substring.replace(new RegExp('</ul>$'), '</ul></li>');
                - replace &#8226; with <li>
                return buildList(substring, nextSymbol);

        }

        else if (prevSymbol == "&#9642;") {

            // Case where sub-list continues (DONE)
            - if (nextSymbol == "<tt>o")
                - Find last </ul> and add closing </li>
                    - substring = substring.replace(new RegExp('</ul>$'), '</ul></li>');
                - replace <tt>o with <li>$1</li></ul>
                return buildList(substring, nextSymbol);

            // Case where sub-sub-list continues (DONE)
            - if (nextSymbol == "&#9642;")
                - Find last </ul> and remove it
                    - substring = substring.replace(new RegExp('</ul>$'), '');
                - replace &#9642; with <li>$1</li></ul>
                return buildList(substring, nextSymbol);

            // Case where the new list starts. (DONE)
            - If (nextSymbol == "&#8226;")
                - Find last </ul> and add closing </li></ul></li>
                    - substring = substring.replace(new RegExp('</ul>$'), '</ul></li></ul></li>');
                - replace &#8226; with <li>
                return buildList(substring, nextSymbol);
        } 
        
        else {
            If (nextSymbol == "&#8226;") {
                var liRegexp = new RegExp(`&#8226;(.*)`);
                substring = substring.replace(liRegexp, "<li>$1</li>");
                return buildlist(substring, nextSymbol);
            }
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

function findLastAndReplace(str, removeString, replaceString) {
    var index = str.lastIndexOf(removeString);
    str = str.substring(0, index) + replaceString + str.substring(index + removeString.length, str.length);
    // str = str.replace(new RegExp(removeString + '$'), replaceString);
    return str;
}


// console.log(findNextSymbol(testString2));

let buildList = (substring, prevSymbol, fn) => {
    // Replace &#8226; entity with <li>
    // var liRegexp = new RegExp(`&#8226;(.*)`);
    // clean = clean.replace(liRegexp, "<li>$1</li>");


    var nextSymbol = findNextSymbol(substring);

    if (nextSymbol == -1) {
        return substring;
    }

    // Main list track (DONE)
    if (prevSymbol == bulletSymbol) {

        // Case where the new list starts. (DONE)
        if (nextSymbol == bulletSymbol) {
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, "<li>$1</li>");
            return fn(substring, nextSymbol, buildList);
        }            

        // Case where new sub-list begins (DONE)
        if (nextSymbol == subBulletSymbol) {
            substring = findLastAndReplace(substring, '</li>', '');
            // - replace <tt>o with <ul><li>$1</li></ul>
            var liRegexp = new RegExp(subBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<ul><li>$1</li></ul>');
            return fn(substring, nextSymbol, buildList);
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
            return fn(substring, nextSymbol, buildList);
        }            

        // Case where new sub-sub-list begins "&#9642;" (DONE)
        if (nextSymbol == subSubBulletSymbol) {
            // - Find last </ul> and remove it
            substring = findLastAndReplace(substring, "</ul>", '');
            // - Find last </li> and remove it
            substring = findLastAndReplace(substring, "</li>", '');                
            // - replace "&#9642;" with <ul><li>$1</li></ul>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<ul><li>$1</li></ul>');
            return fn(substring, nextSymbol, buildList);
        }            

        // Case where the new list starts. (DONE) 
        if (nextSymbol == bulletSymbol) {
            // - Find last </ul> and add closing </li>
            substring = findLastAndReplace(substring, '</ul>', '</ul></li>'); 
            // - replace &#8226; with <li>
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li>');           
            return fn(substring, nextSymbol, buildList);
        }            
    }

    else if (prevSymbol == subSubBulletSymbol) {

        // Case where sub-list continues (DONE)
        if (nextSymbol == subBulletSymbol) {
            // - Find last </ul> and add closing </li>
            substring = findLastAndReplace(substring, '</ul>', '</ul></li>');            
            // - replace <tt>o with <li>$1</li></ul>
            var liRegexp = new RegExp(subBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul>'); 
            return fn(substring, nextSymbol, buildList);
        }

        // Case where sub-sub-list continues (DONE)
        if (nextSymbol == subSubBulletSymbol) {
            // - Find last </ul> and remove it
            substring = findLastAndReplace(substring, '</ul>', '');
            // - replace &#9642; with <li>$1</li></ul>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li></ul>');
            return fn(substring, nextSymbol, buildList);
        }            

        // Case where the new list starts. (DONE)
        if (nextSymbol == bulletSymbol) {
            // - Find last </ul> and add closing </li></ul></li>
            substring = findLastAndReplace(substring, '</ul>', '</ul></li></ul></li>');                
            // - replace &#8226; with <li>
            var liRegexp = new RegExp(subSubBulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, '<li>$1</li>');
            return fn(substring, nextSymbol, buildList);
        }
    } 
    
    else {
        if (nextSymbol == bulletSymbol) {
            var liRegexp = new RegExp(bulletSymbol + `(.*)`);
            substring = substring.replace(liRegexp, "<li>$1</li>");
            return fn(substring, nextSymbol, buildList);
        }
    }
};


module.exports = buildList;