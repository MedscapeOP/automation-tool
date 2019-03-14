function wrapUls(prevWasListItem, remainingString, fn) {
    // console.log("REMAINING STRING: ", remainingString);
    let newLineRegExp = new RegExp('.*', 'g');
    var matchArray = remainingString.match(newLineRegExp);
    var currentLine = "";
    var currentLineMatchIndex = 0;
    for(var i = 0; i < matchArray.length && isBlankOrWhiteSpace(currentLine); i++) {
        currentLine = matchArray[i];
        currentLineMatchIndex = i;
    }  

    if (isBlankOrWhiteSpace(currentLine)) {
        return "";
    }

    var nextLine = ""; 
    for(var i = currentLineMatchIndex + 1; i < matchArray.length && isBlankOrWhiteSpace(nextLine); i++) {
        nextLine = matchArray[i];
    } 

    var nextLineIndex = -1;
    var nextStart = "";
    var currentStart = "";
    // console.log("CURRENT LINE", currentLine);
    // console.log("NEXT LINE", nextLine);
    if (!isBlankOrWhiteSpace(nextLine)) {
        if (nextLine === currentLine) {
            nextLineIndex = remainingString.indexOf(nextLine) + nextLine.length;
        } else {
            nextLineIndex = remainingString.indexOf(nextLine);
        }        
        // Cases where there are more lines 
        currentLine = currentLine.trimLeft() + "\n";
        nextLine = nextLine.trimLeft() + "\n";

        if (nextLine.length >= 4) {
            nextStart = nextLine.substring(0, 4);
        }
        
        if (currentLine.length >= 4) {
            currentStart = currentLine.substring(0, 4);
        }

        remainingString = remainingString.substring(nextLineIndex);
    } else if (isBlankOrWhiteSpace(nextLine) && prevWasListItem) {
        // Cases where we are on the last line  
        // currentLine = currentLine.trimLeft() + "\n";
        currentLine = currentLine.trimLeft();
        
        if (currentLine.length >= 4) {
            currentStart = currentLine.substring(0, 4);
        }
        nextLineIndex = remainingString.indexOf(currentLine) + currentLine.length;

        remainingString = remainingString.substring(nextLineIndex);
        // return "</ul>\n";
    } 
    else {
        // END OF FUNCTION / TERMINATION-BASE CASE 
        return remainingString;
    }



    if (currentStart == '<ul>') {
        // Current start is already a <ul>
        if (nextLineIndex == -1) {
            // Current start is a <ul> but there are no more lines 
            // Means we need to close with </ul> 
            return remainingString + '</ul>\n';
        }
        if (nextStart != '<ul>' && nextStart != '<li>') {
            // Current start is a <ul> but there isn't another list item following 
            // Means we need to close with </ul> and keep going 
            return currentLine + '</ul>\n' + fn(true, remainingString, wrapUls);
        }
        // There are more lines 
        // Therefore it must be already part of a nest list 
            // Dont do anything move on
        return currentLine + fn(true, remainingString, wrapUls);
    } 
    if (currentStart == '<li>') {
        if ((nextStart == '<ul>' || nextStart == '<li>') && !prevWasListItem) {
            // Next line is continuing list Y
            // But previous line wasn't a list N  
            // Therefore current line is start of a list 
                // Must add opening <ul>  
            return '<ul>' + currentLine + fn(true, remainingString, wrapUls);
        } else if ((nextStart == '<ul>' || nextStart == '<li>') && prevWasListItem) {
            // Next line is continuing list Y
            // Previous line was a list Y
            // Therefore current line is nested list 
                // Don't add opening <ul> 
            return currentLine + fn(true, remainingString, wrapUls);
        } else if ((nextStart != '<ul>' && nextStart != '<li>') && !prevWasListItem) {
            // Next line is NOT continuing list N
            // Previous line wasn't a list N
            // Therefore current line is a one line list 
                // Must add opening <ul> AND closing </ul>
            return '<ul>' + currentLine + '</ul>\n' + fn(true, remainingString, wrapUls);
        } 
        else {
        // else if ((nextStart != '<ul>' && nextStart != '<li>') && prevWasListItem) {
            // Next line is NOT continuing list N
            // Previous line was a list Y
                // Therefore current line is the end of the current list  
            return currentLine + '</ul>\n' + fn(true, remainingString, wrapUls);
        }
    } else {
        // Current is NOT A <ul> or <li>
        // console.log("****************REMAINING STRING 353: \n\n\n", remainingString);
        return currentLine + fn(false, remainingString, wrapUls);
    }
}