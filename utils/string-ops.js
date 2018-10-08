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

function getTextBlock(str, startText, endText) {
    var startIndex = str.indexOf(startText);
    var endIndex = str.indexOf(endText);
    var textBlock = str.substring(startIndex, endIndex);
    var label = textBlock.match(startText)[0];
    textBlock = textBlock.replace(label,'');
    return {label, textBlock};
}

// function isBlankOrWhiteSpace(str) {
//     return (!str || str.length === 0 || !str.trim());
// }

module.exports = {
    findLastAndReplace,
    findFirstAndReplace,
    isEmptyString,
    isBlankOrWhiteSpace,
    getTextBlock
}