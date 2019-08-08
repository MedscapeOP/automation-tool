const _ = require('lodash');
const formatList = require('./format-list');
const stringOps = require('./string-ops');

const bulletSymbol = `&#8226;`;
const subBulletSymbol = `<tt>o`;
const subSubBulletSymbol = `&#9642;`;
let wordList = [
    'Have greater',
    'Have increased',
    'Demonstrate greater',
    'Demonstrate increased',
    'Self-assess learning'
];

let formatLearningObjectives = function (string) {
    var regex = null;
    var hasSubLists = false;
    var index = -1;
    // Put bulletSymbol as flag before each instance of item in wordList
    for (var i = 0; i < wordList.length; i++) {
        regex = new RegExp(`(${wordList[i]}.*)`, 'g');
        index = stringOps.regexIndexOf(string, regex);
        if (index != -1) {
            string = string.replace(regex, `${bulletSymbol}$1`);
            hasSubLists = true;
        }
    }

    var pRegExp = new RegExp('<p>(.*)</p>', 'g');     
    if (hasSubLists) {
        string = string.replace(pRegExp, `${subBulletSymbol}` + `$1`);
        // console.log("SUB LIST IF: ", string);
    } else {
        string = string.replace(pRegExp, `${bulletSymbol}` + `$1`);
        // console.log("LIST IF: ", string);
    }

    var removeRegex = /<tt>o(&#8226;.*)/g;
    string = string.replace(removeRegex, '$1');

    string = formatList.formatUlItems(string, null, formatList.formatUlItems);

    string = formatList.wrapUls(false, string, formatList.wrapUls);
    return string;
}

module.exports = formatLearningObjectives;