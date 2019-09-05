const config = require('../config');
const {stringOps, cleanHTML} = require('../utils');
const ProgramTimeline = require('../classes/program_timeline');
const _ = require('lodash');


var exportObject = {};

var subtitleEdgeCases = [
    /All Faculty.*/gi
];

let subtitleRegExpArray = _.concat(config.credentials.credentialRegexArray, subtitleEdgeCases);

let timeRegExpArray = [
    /(10|11|12|[1-9]):[0-5][0-9]/g, 
    /([01]?[0-9]|2[0-3]):[0-5][0-9]/g
];


function buildProgramDetails(prevWasSubtitle, remainingString, timelineObject, resultArray, fn) {
    /* 
        GET THE CURRENT LINE AND NEXT LINE
        - Loop through remainingString until we find a non-blank line
        - Therefore if nextLine is blank we are on the last line 
        - If currentLine is blank we are done.  
    */
    let newLineRegExp = new RegExp('.*', 'g');
    var matchArray = remainingString.match(newLineRegExp);
    var currentLine = "";
    var currentLineMatchIndex = 0;
    for(var i = 0; i < matchArray.length && stringOps.isBlankOrWhiteSpace(currentLine); i++) {
        currentLine = matchArray[i];
        currentLineMatchIndex = i;
    }  

    var nextLine = ""; 
    for(var i = currentLineMatchIndex + 1; i < matchArray.length && stringOps.isBlankOrWhiteSpace(nextLine); i++) {
        nextLine = matchArray[i];
    } 

    var nextLineIndex = -1;
    var next = {
        regexSymbol: null,
        type: "blank"
    };
    var current = {
        regexSymbol: null,
        type: "blank"
    };

    /* IF THE CURRENT AND NEXT LINE ISN'T BLANK CHECK BOTH THEIR TYPES. */
    if (!stringOps.isBlankOrWhiteSpace(nextLine) && !stringOps.isBlankOrWhiteSpace(currentLine)) {
        if (nextLine === currentLine) {
            nextLineIndex = remainingString.indexOf(nextLine) + nextLine.length;
        } else {
            nextLineIndex = remainingString.indexOf(nextLine);
        }        
        // Cases where there are more lines 
        currentLine = currentLine.trimLeft() + "\n";
        nextLine = nextLine.trimLeft() + "\n";

        /* 
            - Get the type of the next line as well as the regex symbol 
            - Use the type to determine where to place the value in result object 
        */
        if (nextLine.length >= 3) {
            var hasSubtitle = stringOps.getNextRegex(nextLine, subtitleRegExpArray);
            var hasTime = stringOps.regexIndexOf(nextLine, timeRegExpArray[0]);
            var hasTime2 = stringOps.regexIndexOf(nextLine, timeRegExpArray[1]);
            if (hasSubtitle != -1) {
                next.type = "subtitle";
            } else if (hasTime != -1 || hasTime2 != -1) {
                next.type = "time";
            } else {
                next.type = "title";
            }
        }
        
        /* 
            - Get the type of the current line as well as the regex symbol 
            - Use the type to determine where to place the value in result object 
        */
        if (currentLine.length >= 3) {
            var hasSubtitle = stringOps.getNextRegex(currentLine, subtitleRegExpArray);
            var hasTime = stringOps.regexIndexOf(currentLine, timeRegExpArray[0]);
            var hasTime2 = stringOps.regexIndexOf(currentLine, timeRegExpArray[1]);
            if (hasSubtitle != -1) {
                current.type = "subtitle";
            } else if (hasTime != -1 || hasTime2 != -1) {
                current.type = "time";
            } else {
                current.type = "title";
            }
        }

        /* CHOP DOWN THE REMAINING STRING USING THE INDEX OF THE NEXT LINE. */
        remainingString = remainingString.substring(nextLineIndex);
    } 
    /* IF THE NEXT LINE IS BLANK ONLY CHECK CURRENT LINE TYPE. (last line case) */
    else if ((stringOps.isBlankOrWhiteSpace(nextLine)) && !(stringOps.isBlankOrWhiteSpace(currentLine))) {  
        currentLine = currentLine.trimLeft();
        if (currentLine.length >= 3) {
            var hasSubtitle = stringOps.getNextRegex(currentLine, subtitleRegExpArray);
            var hasTime = stringOps.regexIndexOf(currentLine, timeRegExpArray[0]);
            var hasTime2 = stringOps.regexIndexOf(currentLine, timeRegExpArray[1]);
            if (hasSubtitle != -1) {
                current.type = "subtitle";
            } else if (hasTime != -1 || hasTime2 != -1) {
                current.type = "time";
            } else {
                current.type = "title";
            }
        }
        nextLineIndex = remainingString.indexOf(currentLine) + currentLine.length;

        remainingString = remainingString.substring(nextLineIndex);
    } 
    /* END OF FUNCTION / TERMINATION-BASE CASE - current line is blank */
    else {
        return resultArray;
    }

    // console.log("CURRENT LINE", currentLine);
    // console.log("NEXT LINE", nextLine);
    // console.log("CURRENT: ", current);
    // console.log("NEXT: ", next);
    // console.log("TIMELINE OBJECT: ", timelineObject);
    // CATCH ALL FOR <p>All Faculty</p>

    /* USE TYPES TO DETERMINE PROPERTIES OF TIMELINE OBJECT AND HOW TO CALL RECURSION */
    if (current.type == 'time') {
        /* CASE WHERE CURRENT LINE IS A TIME - DONE */
        if (nextLineIndex == -1) {
            // Handle case where there is a time but nothing after that (no title and sub)
            return resultArray;
        }
        if (next.type == "title") {
            /*
                - This is the expected case
                    - In other words -> After time should be a 'title'
                In this case we should:
                - store the current line as the .schedule property of the object. - DONE
                - Pass along the working timelineObject - DONE
                - prevWasSubtitle =>>> false - DONE       
            */
            timelineObject.schedule = cleanHTML.programDetails(currentLine);
            return fn(false, remainingString, timelineObject, resultArray, buildProgramDetails);
        } else {
            /*
                In this case we should:
                - Store the current line as the .schedule property of the object. - DONE 
                - Push timelineObject onto result array and pass along result array to recursive call. - DONE
                - Instantiate new timelineObject - DONE
                - Pass along the working timelineObject - DONE
                - prevWasSubtitle =>>> false -        
            */
            timelineObject.schedule = cleanHTML.programDetails(currentLine);
            resultArray.push(timelineObject);
            timelineObject = new ProgramTimeline("", "", "");
            return fn(false, remainingString, timelineObject, resultArray, buildProgramDetails);
        }
    } else if (current.type == 'subtitle') {
        /* CASE WHERE CURRENT LINE IS A SUBTITLE - DONE */
        if ((next.type == 'subtitle') && !prevWasSubtitle) {
            /* 
            In this case: 
                - This is the first line of a list of subtitles && The Next line is continuing a subtitle list 
                - Append a break after the currentLine - DONE
                    - Then assign the currentLine to be the Object's subtitle - DONE 
                - Pass along result array to recursive call - DONE
                - prevWasSubtitle =>>> true - DONE    
            */
            timelineObject.infoSubtitle = cleanHTML.programDetails(currentLine) + " <br/> ";
            return fn(true, remainingString, timelineObject, resultArray, buildProgramDetails);
        } else if ((next.type == 'subtitle') && prevWasSubtitle) {
            /* 
                In this case: 
                - This is one of a list of subtitles && The Next line is continuing a subtitle list 
                - Append a break after the currentLine - DONE
                    - Then append the currentLine to the Object's current subtitle - DONE  
                - prevWasSubtitle =>>> true - DONE   
            */ 
           timelineObject.infoSubtitle += cleanHTML.programDetails(currentLine) + " <br/> ";
           return fn(true, remainingString, timelineObject, resultArray, buildProgramDetails);
        } else if ((next.type != 'subtitle') && prevWasSubtitle) {
            /* 
                In this case: 
                - The Next line is NOT continuing the subtitle list
                    - So in this case we must assume that the next line is either blank or a time. 
                - Append the currentLine to the Object's current subtitle - DONE
                - Push timelineObject onto result array - DONE
                - Pass along result array to recursive call - DONE
                - make a new timelineObject - DONE
                - Pass the new object along as the working timelineObject - DONE 
                - prevWasSubtitle =>>> true - DONE
                prevWasSubtitle, remainingString, timelineObject, resultArray, fn
            */ 
            timelineObject.infoSubtitle += cleanHTML.programDetails(currentLine);
            resultArray.push(timelineObject);
            timelineObject = new ProgramTimeline("", "", "");
            return fn(true, remainingString, timelineObject, resultArray, buildProgramDetails);
        } else {
            /* 
                In this case: 
                - The Next line is NOT continuing the subtitle list AND the Previous was NOT a subtitle
                    - So in this case we must assume that the next line is either blank or a time. 
                - Assign currentLine to the Object's subtitle property - DONE
                - Push timelineObject onto result array - DONE
                - Pass along result array to recursive call - DONE
                - make a new timelineObject - DONE
                - Pass the new object along as the working timelineObject - DONE  
                - prevWasSubtitle =>>> true - 
                prevWasSubtitle, remainingString, timelineObject, resultArray, fn
            */ 
            timelineObject.infoSubtitle = cleanHTML.programDetails(currentLine);
            resultArray.push(timelineObject);
            timelineObject = new ProgramTimeline("", "", "");
            return fn(true, remainingString, timelineObject, resultArray, buildProgramDetails);
        }
    } else if (current.type == 'title') {
        /* CASE WHERE CURRENT LINE IS A TITLE - DONE */
        if ((next.type == 'subtitle')) {
            /* 
                In this case: 
                - THIS IS THE EXPECTED CASE (After a title is a subtitle)
                - Next line is the first of possibly many subtitles
                - Assign the currentLine to be the Object's title - DONE 
                - Pass along result array to recursive call. - DONE
                - Pass along timelineObject to recursive call - DONE
                - prevWasSubtitle =>>> false - DONE
            */
            timelineObject.infoTitle = cleanHTML.programDetails(currentLine);
            return fn(false, remainingString, timelineObject, resultArray, buildProgramDetails);
        } else {
            /* 
                In this case:
                - Next line is NOT a subtitle 
                    - Therefore the timelineObject is finished being built 
                - Assign the currentLine to be the Object's title - DONE
                - Push timelineObject onto result array and pass along result array to recursive call. - DONE
                - Create a new timelineObject and pass that along - DONE
                - prevWasSubtitle =>>> false - DONE
            */
           timelineObject.infoTitle = cleanHTML.programDetails(currentLine);
           resultArray.push(timelineObject);
           timelineObject = new ProgramTimeline("", "", "");
           return fn(false, remainingString, timelineObject, resultArray, buildProgramDetails);
        }
    } else {
        /* CASE WHERE CURRENT LINE IS NEITHER A time, title, or a subtitle - DONE */
        /* 
            In this case: 
            - Don't instantiate or mutate  
            - Pass along everything as normal.
            - prevWasSubtitle => false 
        */
       return fn(false, remainingString, timelineObject, resultArray, buildProgramDetails);
    }
}

// Town Hall Cert Page 
exportObject[config.programs.townHallCert.codeName] = function (ticketHTML) {
    var startRegExp = /<strong>Program Details.*/g;
    var endRegExp = /<\/a>Activity Information/g;
    var {textBlock} = stringOps.getTextBlock(ticketHTML, startRegExp, endRegExp, true, true);

    textBlock = stringOps.getTextBlock(textBlock, /<p>Question &amp; Answer/g, endRegExp, true, false).textBlock;
    
    if (stringOps.isEmptyString(textBlock) || stringOps.isBlankOrWhiteSpace(textBlock) || textBlock.length < 10) {
        throw new Error("No program details found in the prodticket");
    } else {  
        var dateRegExp = stringOps.getNextRegex(textBlock, config.dates.monthsRegexArray);
        
        if (dateRegExp != -1) { 
            textBlock = textBlock.replace(dateRegExp.symbol, "").replace(/.*&#8211;.*/gi, "");
            textBlock = cleanHTML.onlyParagraphTags(textBlock);
            return buildProgramDetails(false, textBlock, new ProgramTimeline("", "", ""), [], buildProgramDetails);
        }

        var result = cleanHTML.onlyParagraphTags(textBlock, removeFluff=false).trim();
        return result;
    }
};


module.exports = exportObject;