let regexIndexOf = function(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
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
    if (startText instanceof RegExp) {
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

// function isBlankOrWhiteSpace(str) {
//     return (!str || str.length === 0 || !str.trim());
// }

module.exports = {
    findLastAndReplace,
    findFirstAndReplace,
    isEmptyString,
    isBlankOrWhiteSpace,
    getTextBlock,
    regexIndexOf
}