const _ = require('lodash');

let regexIndexOf = function(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

/**
 * @description takes a <string> and removes all matches of <removeRegex> from the first match of <regex>
 * @param {*} string 
 * @param {*} regex 
 * @param {*} removeRegex 
 */
function removeFromRegexCapture(string, regex, removeRegex) {
    // Must take in non-global regexp   
    // if (regex.global) {
    //     throw new Error("Regex must NOT be global for this function");
    // } 

    var str = string;
    var matches = string.match(regex);
    var match = "";
    var updatedMatch = "";
    var matchIndex = 0;
    for (var i = 0; i < matches.length; i++) {
        // Get the first match
        match = matches[i];
        
        // Remove from match
        updatedMatch = match.replace(removeRegex, "");

        // Get match index
        matchIndex = str.indexOf(match);

        // Replace match with updated match using .substring   
        str = str.substring(0, matchIndex) + updatedMatch + str.substring(matchIndex + match.length, str.length);
    }
    return str;
}

function findLastAndReplace(str, removeString, replaceString) {
    var index = str.lastIndexOf(removeString);
    str = str.substring(0, index) + replaceString + str.substring(index + removeString.length, str.length);
    // str = str.replace(new RegExp(removeString + '$'), replaceString);
    return str;
}

function findFirstAndReplace(str, removeString, replaceString) {
    var index = str.indexOf(removeString);
    str = str.substring(0, index) + replaceString + str.substring(index + removeString.length, str.length);
    return str;
}

function isEmptyString(str) {
    return (!str || 0 === str.length);
}

function isBlankOrWhiteSpace(str) {
    return (!str || /^\s*$/.test(str) || str.trim().length === 0);
}

function getTextBlock(str, startText, endText, stripStart = true, includeEnd = false) {
    if ((startText instanceof RegExp) || (endText instanceof RegExp)) {
        var startIndex = regexIndexOf(str, startText);
        var endIndex = regexIndexOf(str, endText);
        var textBlock = "";
        if (startIndex != -1 && endIndex != -1) {
            if (includeEnd) {
                endIndex = endIndex + str.match(endText)[0].length;
                textBlock = str.substring(startIndex, endIndex);
            } else {
                textBlock = str.substring(startIndex, endIndex);
            }
        }        
        var label = "";
        if (textBlock.match(startText)) {
            label = textBlock.match(startText)[0];
        }
        if (stripStart) {
            textBlock = textBlock.replace(startText,'');
        }        
        return {label, textBlock, startIndex, endIndex};
    } else {
        var startIndex = str.indexOf(startText);
        var endIndex = str.indexOf(endText);
        var textBlock = "";
        if (startIndex != -1 && endIndex != -1) {
            if (includeEnd) {
                endIndex = endIndex + str.match(endText)[0].length;
                textBlock = str.substring(startIndex, endIndex);
            } else {
                textBlock = str.substring(startIndex, endIndex);
            }
        }   
        var label = "";
        if (textBlock.match(startText)) {
            label = textBlock.match(startText)[0];
        }
        if (stripStart) {
            textBlock = textBlock.replace(startText,'');
        }        
        return {label, textBlock, startIndex, endIndex};
    }
}

/**
 * @description Return the first matching regular expression from an array of regular expressions. 
 * - This regex returned would be the first possible match from within the string (ticketHTML). 
 * @param {*} ticketHTML 
 * @param {*} regexpArray 
 */
function getUsableRegExp (ticketHTML, regexpArray) {
    var regexp = null;
    for (var i = 0; i < regexpArray.length; i++) {
        let index = regexIndexOf(ticketHTML, regexpArray[i]);
        if (index != -1) {
            regexp = regexpArray[i];
            break;
        } else {
            continue;
        }  
    }
    return regexp;
}


/**
 * @description Selects, from an array, the regex that is first to match within a string. 
 * @param {*} ticketHTML 
 * @param {*} regexArray 
 */
function getNextRegex(ticketHTML, regexArray) {
    var options = [];
    var nextCredential = null;
    for (var i = 0; i < regexArray.length; i++) {
        nextCredential = {
            index: ticketHTML.search(regexArray[i]),
            symbol: regexArray[i],
            isInString: function () {
                return this.index != -1;
            }
        };
        options.push(nextCredential);
    }

    // remove all options not found in string
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
        return minimum;
    } else {
        return -1;
    }
}

/**
 * @description Returns all matches of an Array of RegExpressions. You can use this to determine the order in which the matches occur   
 * @param {*} textBlock 
 * @param {*} regexArray 
 */
function getAllMatchesInOrder(textBlock, regexArray)  {
    // Create a utility function that returns an array of all of the titles
    var resultArray = [];
    var substring = textBlock.slice();
    var foundMatch = null;
    var searchStartIndex = 0;
    var matchLength = 0;
    while (substring) {
        // console.log("SUBSTRING: ", substring);
        foundMatch = getNextRegex(substring, regexArray);        
        // console.log("FOUND MATCH: ", foundMatch);
        if (!foundMatch.isInString) {
            substring = null;
        } else {
            matchLength = substring.match(foundMatch.symbol)[0].length;
            searchStartIndex = (textBlock.length - substring.length) + foundMatch.index + matchLength; // foundMatch.symbol.toString().length + 1;    
            substring = textBlock.substring(searchStartIndex);
            resultArray.push({
                symbol: foundMatch.symbol,
                index: searchStartIndex - matchLength
            });
            // console.log("INDEX CHOP: ", textBlock.substring(searchStartIndex, searchStartIndex + 20));
            // console.log("INDEX CHOP: ", textBlock.substring(39, 261));
        }
    }
    return resultArray;
}
// function isBlankOrWhiteSpace(str) {
//     return (!str || str.length === 0 || !str.trim());
// }

module.exports = {
    findLastAndReplace,
    findFirstAndReplace,
    isEmptyString,
    isBlankOrWhiteSpace,
    getTextBlock,
    regexIndexOf,
    getNextRegex,
    removeFromRegexCapture,
    getUsableRegExp,
    getAllMatchesInOrder
}