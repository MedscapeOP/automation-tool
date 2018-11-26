const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');

var exportObject = {};

class ProgramDetail {
    constructor(schedule, infoTitle, infoSubtitle) {
        this.schedule = schedule;
        this.infoTitle = infoTitle;
        this.infoSubtitle = infoSubtitle;
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 

    //--------------------------------
    // METHODS 
    //-------------------------------- 
    toObjectLiteral() {
        var schedule = this.schedule;
        var infoTitle = this.infoTitle;
        var infoSubtitle = this.infoSubtitle;
        return {
            schedule,
            infoTitle, 
            infoSubtitle 
        };     
    }
}

let timeRegExpArray = [
    /^(10|11|12|[1-9]):[0-5][0-9]$/g, 
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
];


function buildProgramDetails(prevWasSubtitle, remainingString, timelineObject, resultArray, fn) {
    let newLineRegExp = new RegExp('.*', 'g');
    var matchArray = remainingString.match(newLineRegExp);
    var currentLine = "";
    var currentLineMatchIndex = 0;
    for(var i = 0; i < matchArray.length && stringOps.isBlankOrWhiteSpace(currentLine); i++) {
        currentLine = matchArray[i];
        currentLineMatchIndex = i;
    }  

    if (stringOps.isBlankOrWhiteSpace(currentLine)) {
        return "";
    }

    var nextLine = ""; 
    for(var i = currentLineMatchIndex + 1; i < matchArray.length && stringOps.isBlankOrWhiteSpace(nextLine); i++) {
        nextLine = matchArray[i];
    } 

    var nextLineIndex = -1;
    var next = {
        regexSymbol: null,
        type: ""
    };
    var current = {
        regexSymbol: null,
        type: ""
    };
    console.log("CURRENT LINE", currentLine);
    console.log("NEXT LINE", nextLine);
    if (!stringOps.isBlankOrWhiteSpace(nextLine)) {
        if (nextLine === currentLine) {
            nextLineIndex = remainingString.indexOf(nextLine) + nextLine.length;
        } else {
            nextLineIndex = remainingString.indexOf(nextLine);
        }        
        // Cases where there are more lines 
        currentLine = currentLine.trimLeft() + "\n";
        nextLine = nextLine.trimLeft() + "\n";

        // Get the type of the next line as well as the regex symbol 
        // Use the type to determine where to place the value in result object
        // Use the symbol to properly???
        if (nextLine.length >= 3) {
            var hasCredentials = stringOps.getNextRegex(nextLine, config.credentials.credentialRegexArray);
            var hasTime = stringOps.getNextRegex(nextLine, timeRegExpArray);
            if (hasCredentials != -1) {
                next.type = "subtitle";
                next.regexSymbol = hasCredentials.symbol;
            } else if (hasTime != -1) {
                next.type = "time";
                next.regexSymbol = hasTime.symbol;
            } else {
                next.type = "title";
            }
        }
        
        if (currentLine.length >= 3) {
            var hasCredentials = stringOps.getNextRegex(currentLine, config.credentials.credentialRegexArray);
            var hasTime = stringOps.getNextRegex(currentLine, timeRegExpArray);
            if (hasCredentials != -1) {
                current.type = "subtitle";
                current.regexSymbol = hasCredentials.symbol;
            } else if (hasTime != -1) {
                current.type = "time";
                current.regexSymbol = hasTime.symbol;
            } else {
                current.type = "title";
            }
        }

        remainingString = remainingString.substring(nextLineIndex);
    } else if (stringOps.isBlankOrWhiteSpace(nextLine) && prevWasSubtitle) {
        // Cases where we are on the last line  
        // currentLine = currentLine.trimLeft() + "\n";
        currentLine = currentLine.trimLeft();
        
        if (currentLine.length >= 4) {
            current.type = currentLine.substring(0, 4);
        }
        nextLineIndex = remainingString.indexOf(currentLine) + currentLine.length;

        remainingString = remainingString.substring(nextLineIndex);
        // return "</ul>\n";
    } 
    else {
        // END OF FUNCTION / TERMINATION-BASE CASE 
        return remainingString;
    }

    if (current.type == 'time') {
        // Current start is already a <ul>
        if (nextLineIndex == -1) {
            // Current start is a <ul> but there are no more lines 
            // Means we need to close with </ul> 
            return remainingString + '\n';
        }
        if (next.type != 'time' && next.type != 'subtitle') {
            // This is the expected case
                // In other words -> After time should be a 'title'
            /*
                In this case we should:
                - Push timelineObject onto result array and pass along result array to recursive call. 
                - make a new object and store the current line as the .schedule property of the object.
                - Pass the new object along as the working timelineObject 
                - prevWasSubtitle =>>> false                  
            */
            return currentLine + '</ul>\n' + fn(true, remainingString, buildProgramDetails);
        }
    } 

    /* TODO: REFACTOR THIS SECTION */
    if (current.type == 'subtitle') {
        if ((next.type == 'subtitle') && !prevWasSubtitle) {
            /* 
                In this case: 
                - This is the first line of a list of subtitles && The Next line is continuing a subtitle list 
                - Append a break after the currentLine 
                    - Then assign the currentLine to be the Object's subtitle 
            */
            return 'time' + currentLine + fn(true, remainingString, buildProgramDetails);
        } else if ((next.type == 'subtitle') && prevWasSubtitle) {
            /* 
                In this case: 
                - This is one of a list of subtitles && The Next line is continuing a subtitle list 
                - Append a break after the currentLine 
                    - Then assign the currentLine to be the Object's subtitle 
            */ 
            return currentLine + fn(true, remainingString, buildProgramDetails);
        } else if ((next.type != 'subtitle') && prevWasSubtitle) {
            /* 
                In this case: 
                - This is one of a list of subtitles && The Next line is continuing a subtitle list 
                - Append a break after the currentLine 
                    - Then assign the currentLine to be the Object's subtitle 
            */ 
            return 'time' + currentLine + '</ul>\n' + fn(true, remainingString, buildProgramDetails);
        } 
        else {
        // else if ((next.type != 'time' && next.type != 'subtitle') && prevWasSubtitle) {
            // Next line is NOT continuing list N
            // Previous line was a list Y
                // Therefore current line is the end of the current list  
            return currentLine + '</ul>\n' + fn(true, remainingString, buildProgramDetails);
        }
    } else {
        // Current is NOT A time OR a subtitle
        /* 
            In this case just take the current line and add it to the title property 
            of the timelineObject
            - Pass along everything as normal. 
        */
        return currentLine + fn(false, remainingString, buildProgramDetails);
    }
}

// Town Hall 
exportObject[config.programs.townHall.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Program Details.*/g;
    var endRegExp = /<\/a>Activity Information/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    textBlock = stringOps.getTextBlock(textBlock, /<p>Question &amp; Answer/g, endRegExp, true, false).textBlock;
    
    var dateRegExp = stringOps.getNextRegex(textBlock, config.dates.monthsRegexArray);
    
    if (dateRegExp != -1) { 
        textBlock = textBlock.replace(dateRegExp.symbol, "").replace(/.*&#8211;.*/gi, "");
        textBlock = cleanHTML.onlyParagraphTags(textBlock);
        console.log(buildProgramDetails(false, textBlock, buildProgramDetails));
    }

    var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
    return result;
};


module.exports = exportObject;