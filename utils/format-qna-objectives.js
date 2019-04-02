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
    'Demonstrate increased'
];

let formatQNAObjectives = function (string) {
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

    /*
    Algorithm:
    - put flag before each match in wordList

    - Loop through each line
        - If line starts with flag
            // Remove wordlist match from current line
            - currentLine = currentLine.replace(wordList[i].matchText, "");
            - currentLine = wordList[i].replacementText + " " + currentLine 
            - startingPhrase = currentLine 
        - If doesn't start with flag
            - currentLine = currentLine.charAt(0).toLowerCase(); 
            - currentLine = startingPhrase + " " + currentLine 
            - prepend currentLine to startingPhrase
    */
}

module.exports = formatQNAObjectives;