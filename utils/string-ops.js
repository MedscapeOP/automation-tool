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

/**
 * @description Using an array of regex, remove all matches from str  
 * @param {*} str 
 * @param {*} regexArray 
 */
function removeRegexMatches(str, regexArray) {
    var resultString = str;
    // console.log("RESULT STRING: ", resultString);
    for (var i = 0; i < regexArray.length; i++) {
        resultString = resultString.replace(regexArray[i], "\n\r");
    }
    // console.log("RESULT STRING AFTER: ", resultString);
    return resultString;
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

function getAllBlocksInOrder(textBlock, startRegExpArray, endRegExpArray, stripStart=false, includeEnd=true) {
    // Create a utility function that returns an array of all of the titles
    var resultArray = [];
    var substring = textBlock.slice();
    var startRegex = null;
    var prevLabel = null;
    var endRegex = null;
    var currentBlock = null;
    var testnum = 0;
    // while (testnum < 2) {
    while (substring) {
        // console.log("SUBSTRING: ", substring);
        startRegex = getNextRegex(substring, startRegExpArray);        
        // console.log("START REGEX: ", startRegex);
        if (startRegex == -1) {
            substring = null;
            continue;
        }   
        endRegex = getNextRegex(substring, endRegExpArray);
        // console.log("END REGEX: ", endRegex);
        // console.log("SUBSTRING: ", substring.substring(0, 4000));
        if (endRegex.index < startRegex.index && (_.indexOf(startRegExpArray, endRegex.symbol) != -1)) {
        /* NEW LOGIC 5/3/19 */
        // if (endRegex.index < startRegex.index && (_.some(startRegExpArray, endRegex.symbol) != false)) {
            currentBlock = {
                label: prevLabel, 
                textBlock: substring.substring(0, endRegex.index), 
                startIndex: 0, 
                endIndex: endRegex.index
            };
            // console.log("IF BLOCK INDEX", textBlock.indexOf(currentBlock.textBlock));
            currentBlock.startIndex = textBlock.indexOf(currentBlock.textBlock);
            substring = substring.substring(currentBlock.endIndex + 1);
            if (currentBlock.textBlock.length > 50) {
                // QUICK FIX TO PROBLEM OF EMPTY SECTIONS 
                resultArray.push(currentBlock);
            }
            // console.log("SPECIAL TEXT BLOCK: ", currentBlock.textBlock);
            // substring = substring.substring(endRegex.index + 1);
        } else if (endRegex.index < startRegex.index) {
            // If the startArray doesn't contain endRegex (when it comes first), then we should chop and skip. 
            substring = substring.substring(startRegex.index);
        } else if (endRegex != -1) {
            // if (startRegex.symbol == endRegex.symbol) {
            //     console.log("FIRST AND SECOND EQUAL")
            //     continue;
            // }
            currentBlock = getTextBlock(substring, startRegex.symbol, endRegex.symbol, stripStart, includeEnd);

            currentBlock.startIndex = textBlock.indexOf(currentBlock.textBlock);
            // if (!isBlankOrWhiteSpace(currentBlock.textBlock) && !isEmptyString(currentBlock.textBlock)) {
            //     resultArray.push(currentBlock);
            // }
            prevLabel = currentBlock.label;            
            substring = substring.substring(currentBlock.endIndex + 1);
            // console.log("SPECIAL TEXT BLOCK 2: ", currentBlock.textBlock);
            resultArray.push(currentBlock);
        } else {
            currentBlock = {
                label: substring.match(startRegex.symbol)[0], 
                textBlock: substring.substring(startRegex.index), 
                startIndex: startRegex.index, 
                endIndex: null,
            };
            currentBlock.startIndex = textBlock.indexOf(currentBlock.textBlock);
            // console.log("ELSE BLOCK INDEX", textBlock.indexOf(currentBlock.textBlock));
            substring = null;
            resultArray.push(currentBlock);
        }        
        // testnum++;
    }
    return resultArray;
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
                index: searchStartIndex - matchLength,
                matchLength: matchLength
            });
            // console.log("INDEX CHOP: ", textBlock.substring(searchStartIndex, searchStartIndex + 20));
            // console.log("INDEX CHOP: ", textBlock.substring(39, 261));
        }
    }
    return resultArray;
}

/**
 * @description Creates substrings using the supplied array of breakpoints. 
 * - Uses getAllMatches
 * @param {*} breakRegexArray 
 */
// function sliceAtBreakpoints(textBlock, breakRegexArray) {
//     /*
//         Use getAllMatches for a regex array and then sort by index. 
//         Then loop through and substring using the indices.  
//     */
//     var allMatches = getAllMatchesInOrder(textBlock, breakRegexArray);
// //    _.orderBy(allMatches);

//     var result = [];

//     var substring = "";
//     var currentMatch = null;
//     var currentSymbol = null;
//     var startIndex = 0;
//     for (var i = 0; i < allMatches.length; i++) {
//         currentMatch = allMatches[i];
//         if (currentMatch.symbol == currentSymbol) {
//             // MATCHING PREVIOUS SYMBOL
//             if (i == allMatches.length - 1) {
//                 substring = textBlock.substring(startIndex);
//             } else {
//                 continue;
//             }
//         } else {
//             // NOT MATCHING 
//             if (currentSymbol) {
//                 substring = textBlock.substring(startIndex, currentMatch.index);
//                 result.push(substring);
//             } 
//             startIndex = currentMatch.index;
//             currentSymbol = currentMatch.symbol;
//             if (i == allMatches.length - 1) {
//                 substring = textBlock.substring(startIndex);
//                 result.push(substring);
//                 continue;
//             }
//         }
//     }
//     return result;
// }

function sliceAtBreakpoints(textBlock, breakpointArray) {
    /*
        Use getAllMatches for a regex array and then sort by index. 
        Then loop through and substring using the indices.  
    */
    var breakRegexArray = _.flatMap(breakpointArray, function (o) {
        return [o.symbol];
    });
    var allMatches = getAllMatchesInOrder(textBlock, breakRegexArray);
    
    var inclusiveArray = _.compact(_.flatMap(breakpointArray, function (o) {
        if (o.inclusive) {
            return [o.symbol];
        }
    }));
    // console.log("New Breakpoints: ", inclusiveArray);

    var result = [];
    var substring = "";
    var currentMatch = null;
    var nextMatch = null;
    var startIndex = null;
    for (var i = 0; i < allMatches.length; i++) {
        currentMatch = allMatches[i];
        if (_.indexOf(inclusiveArray, currentMatch.symbol) == -1) {
            // If not in inclusive array make index not include the matching string. 
            startIndex = currentMatch.index + currentMatch.matchLength;
        } else {
            startIndex = currentMatch.index;
        }
        if (i == allMatches.length - 1) {
            substring = textBlock.substring(startIndex);
        } else {
            nextMatch = allMatches[i + 1];
            substring = textBlock.substring(startIndex, nextMatch.index);
        }
        result.push(substring);
    }
    return result;
}

/** 
 * @description
 * Finds the match for returnRegex within substring of ticketHTML
 * Substring is determined by start and endRegex provided 
 * @param {*} ticketHTML 
 * @param {*} startRegex 
 * @param {*} endRegex 
 * @param {*} returnRegex 
 */
let getTextWithinBlock = (ticketHTML, startRegex, endRegex, returnRegex) => {
    let {textBlock} = getTextBlock(ticketHTML, startRegex, endRegex, true, false);
    if (isBlankOrWhiteSpace(textBlock) || isEmptyString(textBlock)) {
        return null;
    } else {
        var match = textBlock.match(returnRegex);
        if (match && typeof match === "object") {
            return match[0];
        } else {
            return null;
        }
    }
}

module.exports = {
    removeRegexMatches,
    findLastAndReplace,
    findFirstAndReplace,
    isEmptyString,
    isBlankOrWhiteSpace,
    getTextBlock,
    getAllBlocksInOrder,
    regexIndexOf,
    getNextRegex,
    removeFromRegexCapture,
    getUsableRegExp,
    getAllMatchesInOrder,
    sliceAtBreakpoints,
    getTextWithinBlock
}