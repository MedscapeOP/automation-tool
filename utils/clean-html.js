const sanitizeHtml = require('sanitize-html');
const formatList = require('./format-list');
const stringOps = require('./string-ops');

/*
Common Entities / Things to remove: 
&#9744; --> Empty checkbox
&#9746; --> Filled checkbox 
&#8226; --> Unordered List bullet 
<tt>o     </tt> --> Unorder List Sub-bullet 
*/

function basicHTMLSanitize(str) {
    var options = {
        // Allow all tags and all attributes 
        allowedTags: false,
        allowedAttributes: false,
        exclusiveFilter: function(frame) {
            // if (frame.text.trim() == "") {
            //     return false;
            // }
            return !frame.text.trim();
        }
    };
    return sanitizeHtml(str, options);
}

function removeTicketFluff(str) {
    // Remove this from Prod ticket (Insert text)
    // var insertRegExp = new RegExp('(Insert.*)', 'g');
    var insertRegExp = /\(Insert.*\)\./gi;
    str = str.replace(insertRegExp, "");

    var insertRegExp2 = /\(Insert.*\)/gi;
    str = str.replace(insertRegExp2, "");

    // var insertRegExp2 = /\(insert.*\)/g;
    // str = str.replace(insertRegExp2, "");

    // Remove this from Prod ticket (60 character limit)
    // var charLimitRegExp = new RegExp('\(.*limit?\)', 'g');
    var charLimitRegExp = /\(.*limit?\)/g;
    str = str.replace(charLimitRegExp, "");

    // Remove statement by references (to be completed by Copy Editor)
    var copyEditorRegExp = /\(.*Copy Editor?\)/g;
    str = str.replace(copyEditorRegExp, "");

    // Remove Select Response 
    var selectResponseRegExp = /.*\(Select response...\).*/g;
    str = str.replace(selectResponseRegExp, "");

    // Remove Select Appropriate statement (From Peer Reviewer statement)
    var selectAppropriateRegExp = /\(Select appropriate statement...\)/g;
    str = str.replace(selectAppropriateRegExp, "");

    // Remove (use the applicable statement) - Target Audience TH
    var applicableStatementRegExp = /\(use the applicable statement\)/g;
    str = str.replace(applicableStatementRegExp, "");

    // Remove Click + to add another row
    var addRowRegExp = /.*Click.*to.*/g;
    str = str.replace(addRowRegExp, "");

    // Remove instructions for Peer Reviewer
    var peerReviewerRegExp = /<p>Indicate which reviewers were involved.*/g;
    str = str.replace(peerReviewerRegExp, "");

    var peerReviewerRegExp2 = /<p><strong>Include Peer Reviewer.*/g
    str = str.replace(peerReviewerRegExp2, "");

    // Remove Add References / Add Abbreviations 
    // <p><em>Add references below:</em></p>
    // <em>Add abbreviations below:</em>
    var addRefRegExp = /<p><em>Add references below:<\/em><\/p>/gi;
    str = str.replace(addRefRegExp, "");

    var addRefRegExp2 = /<em>Add references below:<\/em>/gi;
    str = str.replace(addRefRegExp2, "");

    var addAbbrevRegExp = /<p><em>Add abbreviations below:<\/em><\/p>/gi;
    str = str.replace(addAbbrevRegExp, "");

    var addAbbrevRegExp2 = /<em>Add abbreviations below:<\/em>/gi;
    str = str.replace(addAbbrevRegExp2, "");

    // Remove End of Slides Fluff
    var endOfSlidesRegExp = /Mandatory Insertion after Main CONTENT.*/gi;
    str = str.replace(endOfSlidesRegExp, "");

    var endOfSlidesRegExp2 = /<p>&lt;&lt;Note to Production:.*/gi;
    str = str.replace(endOfSlidesRegExp2, "");

    // We also remove this statement because we re-include it manually 
    var endOfSlidesRegExp3 = /<em>This content has been condensed for improved clarity\.<\/em>/gi;
    str = str.replace(endOfSlidesRegExp3, "");



    var aTagRegExp = /<a name=".*"><\/a>/g;
    str = str.replace(aTagRegExp, "");

    return str;
}

function supEdgeCases (str) {
    // Sup Edge Cases
    var supRegExp1 = new RegExp('</strong>\\s{0,}(<sup>.*</sup>)', 'g');
    str = str.replace(supRegExp1, "$1</strong>");

    var supRegExp2 = new RegExp('</strong>\\s{0,}</sup>', 'g');
    str = str.replace(supRegExp2, "</sup></strong>");
    
    var supRegExp3 = new RegExp('<sup>\\s{0,}\\[', 'g');
    str = str.replace(supRegExp3, "<sup>[");
    
    // Don't need this edge case - broke test and teach figures 
    // var supRegExp3 = new RegExp('<sup>.*\\[', 'g');
    // str = str.replace(supRegExp3, "<sup>[");
    // console.log("AFTER REGEX 3", str);
    return str;
}

function plainText(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: [ 'em' ],
        exclusiveFilter: function(frame) {
            return !frame.text.trim();
        }
    };
    var clean = sanitizeHtml(str, options);
    return clean;
}

function onlyParagraphTags(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: [ 'p' ],
        exclusiveFilter: function(frame) {
            return !frame.text.trim();
        }
    };
    var clean = sanitizeHtml(str, options);
    return clean;
}

function singleLine(string) {
    // Remove this from Prod ticket (60 character limit)
    var lineBreakRegExp = /\r?\n|\r/g;
    return string.replace(lineBreakRegExp, "");
}

function paragraph(string, removeFluff=true, allowedTags=['p','em','strong','sup','sub']) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options =   {
        allowedTags: allowedTags,
        allowedAttributes: {
          'sup': ["type"]
        },
        allowedClasses: {},
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    var clean = sanitizeHtml(str, options);
    clean = supEdgeCases(clean);

    var supRegExp = new RegExp('<sup>\\[', 'g');
    clean = clean.replace(supRegExp, '<sup type="ref">[');

    return clean;
}

function unorderedList(string, removeFluff=true, format=true, allowedTags=[ 'ul', 'li', 'em', 'strong', 'sup', 'sub', 'tt' ]) {
    var str = string;
    
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options =   {
        allowedTags: allowedTags,
        allowedAttributes: {
          'sup': ["type"],
        },
        parser: {
            decodeEntities: false
        },
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    
    // General Cleanup 
    var clean = sanitizeHtml(str, options);

    // Clean entities; 
    clean = cleanEntities(clean);

    if (format) {
        clean = formatList.formatUlItems(clean, null, formatList.formatUlItems);
        clean = formatList.wrapUls(false, clean, formatList.wrapUls);
    }

    var ttRegExp = new RegExp('</tt>', 'g');
    clean = clean.replace(ttRegExp, "");
    return clean;
}

function slidesInitial (str) {
    // Remove empty random <a> tags 
    // This is also run in removeTicketFluff() 
    var aTagRegExp = /<a name=".*"><\/a>/g;
    str = str.replace(aTagRegExp, "");

    /* NEW REGEX */
    // Remove bullet symbol from insert slide statement 
    // var insertSlideRegExp6 = /&\#8226;\s+&lt;&lt;/g;
    // str = str.replace(insertSlideRegExp6, "&lt;&lt;");

    // var chapterRegExp = /Chapter Title:.*/g;
    // str = str.replace(chapterRegExp, "&gt;&gt;</p>");
    var splitInsertRegExp = /(.*&lt;&lt;insert(?:\s){0,}slide.*)((?:&lt;){1,}.*)/gi;
    str = str.replace(splitInsertRegExp, "$1</p>\n\r\n<p><strong>$2");

    /* END NEW REGEX */

    // Insert Slide edge cases / Capitalization Edge Cases
    var insertSlideRegExp1 = new RegExp('.*&lt;&lt;.*slide&gt;&gt;.*', 'gi');
    str = str.replace(insertSlideRegExp1, "&lt;&lt;insert slide&gt;&gt;");
    
    var insertSlideRegExp2 = new RegExp('.*&lt;&lt;Slide(?:\s){0,}((?:\d){0,}).*', 'gi');
    str = str.replace(insertSlideRegExp2, "&lt;&lt;insert slide $1&gt;&gt;");

    var insertSlideRegExp2 = new RegExp('.*&gt;&gt;Slide(?:\s){0,}((?:\d){0,}).*', 'gi');
    str = str.replace(insertSlideRegExp2, "&lt;&lt;insert slide $1&gt;&gt;");
    
    var insertSlideRegExp3 = new RegExp('.*&gt;&gt;.*slide(?:\s){0,}((?:\d){0,}).*', 'g');
    str = str.replace(insertSlideRegExp3, "&lt;&lt;insert slide $1&gt;&gt;");
    
    var insertSlideRegExp4 = new RegExp('.*&gt;&gt;.*Slide(?:\s){0,}((?:\d){0,}).*', 'g');
    str = str.replace(insertSlideRegExp4, "&lt;&lt;insert slide $1&gt;&gt;");
    
    var insertSlideRegExp5 = /.*&lt;&lt;insert.*slide (\d+).*/gi;
    str = str.replace(insertSlideRegExp5, "&lt;&lt;insert slide $1&gt;&gt;");
    // console.log("STRING: ", str);  

    // Handle this &lt;&lt; Insert Slide 1
    // Causes Townhall test to break but fixes FR issue 
    var insertSlideRegExp6 = /.*&lt;&lt;.*insert(?:\s){0,}slide(?:\s){0,}((?:\d){0,}).*/gi;
    str = str.replace(insertSlideRegExp6, "&lt;&lt;insert slide $1&gt;&gt;");

    // Handle this: <p><strong>&lt;&lt;insert Slide 59; 39:42&gt;&gt; </strong> <strong>&lt;&lt;level 2&gt;&gt; Conclusions</strong></p>
    var headlineRegExp = /(<strong>(?:&lt;){1,}Level 2(?:&gt;){1,}.*)/gi;
    str = str.replace(headlineRegExp, "$1");
    

    /* EXTRA CASES FOR FR SLIDES */
    // Remove Component statement
    var componentRegExp1 = /.*(?:&lt;){1,}Component \d.*/gi
    str = str.replace(componentRegExp1, "");

    /* EXTRA CASES FOR TH SLIDES */
    // &lt;&lt;Intra-activity question 1; 00:46&gt;&gt;  
    var intraActivityRegExp = /.*(?:&lt;){1,}Intra-activity question.*/gi;
    str = str.replace(intraActivityRegExp, "");

    /* EXTRA CASES FOR NON LIST CONTENT */
    // Remove List-Based <p> tags 
    var bulletSymbolRegex = /<p>.*(&#8226;.*)<\/p>/g;
    var subBulletSymbolRegex = /<p>.*(<tt>o.*)<\/p>/g;
    var subSubBulletSymbolRegex = /<p>.*(&#9642;.*)<\/p>/g;
    str = str.replace(bulletSymbolRegex, "$1").replace(subBulletSymbolRegex, "$1").replace(subSubBulletSymbolRegex, "$1");

    return str;
}

function slidesFinal (str) {
    
    str = unorderedList(str, true, true, [ 'ul', 'li', 'em', 'strong', 'sup', 'sub', 'tt']);
    // /* REMOVE PLACEHOLDERS FOR P TAGS */
    // var pOpenRegexp = /--POPEN--/g;
    // str = str.replace(pOpenRegexp, "<p>");
    // var pCloseRegexp = /--PCLOSE--/g;
    // str = str.replace(pCloseRegexp, "</p>");
    /* CLEAN UP HTML FOR EDGE CASES */

    // Headline edge cases / Capitalization Edge Cases 
    // Handle cases like &lt;&lt;level 2&gt;&gt;</strong> Panelists
    var headlineRegExp1 = new RegExp('<strong>(?:&lt;){1,}level 2(?:&gt;){1,}</strong>(.*)', 'g');
    str = str.replace(headlineRegExp1, "<strong>&lt;&lt;Level 2&gt;&gt;$1</strong>");
    
    var headlineRegExp2 = new RegExp('<strong>(?:&lt;){1,}Level 2(?:&gt;){1,}</strong>(.*)', 'g');
    str = str.replace(headlineRegExp2, "<strong>&lt;&lt;Level 2&gt;&gt;$1</strong>");
    
    // Change all Level 2 statements to be titlecase -> "Level"
    var headlineRegExp3 = new RegExp('(?:&lt;){1,}.*level 2.*(?:&gt;){1,}', 'g');
    str = str.replace(headlineRegExp3, "&lt;&lt;Level 2&gt;&gt;");
    
    var headlineRegExp4 = new RegExp('<strong>(?:&lt;){1,}Level 2(?:&gt;){1,}(?:\s){1,}</strong>(.*)</p>', 'g');
    str = str.replace(headlineRegExp4, "<strong>&lt;&lt;Level 2&gt;&gt;$1</strong>");


    // Will remove unneeded text before "insert slide" statement - Fixes issues in buildSlides()
    var insertSlideRegExp = /.*&lt;&lt;insert slide/g;
    str = str.replace(insertSlideRegExp, "&lt;&lt;insert slide");

    /* EXTRA CASES FOR TH SLIDES */
    // console.log("STRING", str); 
    // Remove level 1's 
    var level1RegExp = /.*(?:&lt;){1,}level 1.*/gi; 
    str = str.replace(level1RegExp, "");
    


    /* NEW REGEX */
    // var strongRegExp3 = /&lt;&lt;Level 2&gt;<strong>&gt;/gi;
    // str = str.replace(strongRegExp3, "<strong>&lt;&lt;Level 2&gt;&gt;");

    // var strongRegExp4 = /<strong>&lt;&lt;<\/strong>Level 2&gt;&gt; <strong>/gi;
    // str = str.replace(strongRegExp4, "<strong>&lt;&lt;Level 2&gt;&gt;");

    // var strongRegExp5 = /&lt;&lt;Level 2&gt;&gt;\s+<strong>/g;
    // str = str.replace(strongRegExp5, "<strong>&lt;&lt;Level 2&gt;&gt;")
    /* END NEW REGEX */
    
    

    // Remove End of Slides Fluff
    var endOfSlidesRegExp = /<em>Mandatory Insertion after Main CONTENT with abridged Transcripts:<\/em>/gi;
    str = str.replace(endOfSlidesRegExp, "");

    var endOfSlidesRegExp2 = /<p><em>This content has been condensed for improved clarity\.<\/em><\/p>/gi;
    str = str.replace(endOfSlidesRegExp2, "");

    // Remove End Slides 
    var endSlidesRegExp1 = new RegExp('&lt;&lt;end slides&gt;&gt;', 'g');
    str = str.replace(endSlidesRegExp1, "");


    // Strong/Em tag Edge Cases
    var strongRegExp1 = new RegExp('<strong></strong>', 'g');
    str = str.replace(strongRegExp1, "");

    var strongRegExp2 = new RegExp('</strong> <strong>', 'g');
    str = str.replace(strongRegExp2, "");

    var strongRegExp3 = new RegExp('((?:</strong>(?=</strong)){1,})', 'g');
    str = str.replace(strongRegExp3, "");

    var emRegExp1 = new RegExp('<em></em>', 'g');
    str = str.replace(emRegExp1, "");


    // Sup Edge Cases
    str = supEdgeCases(str);
    

    /* MAIN REGEX SERIES */
    var h3RegExp = new RegExp('(?:<p>){0,}<strong>(?:&lt;){1,}Level 2(?:&gt;){1,}(.*)</strong>(?:</p>){0,}', 'gi');
    str = str.replace(h3RegExp, "<h3>$1</h3>");

    var h3RegExp2 = new RegExp('<h3>(.*)</h3>', 'g');
    var strongRegExp = new RegExp('<strong>|</strong>', 'g'); 
    str = stringOps.removeFromRegexCapture(str, h3RegExp2, strongRegExp); 

    var supRegExp = new RegExp('<sup>\\[', 'g');
    str = str.replace(supRegExp, '<sup type="ref">[');

    // var paragraphRegexp = new RegExp('(?<!\<li\>)(.*)|(?<!\<ul\>)(.*)|(?<!\<h3\>)(.*)|(?<!\<\/ul\>)(.*)|(?<!&lt;)(.*)', 'g');

    // var paragraphRegexp = new RegExp('(<strong>.*)', 'g');
    // str = str.replace(paragraphRegexp, "<p>$1</p>"); 

    /* Add Paragraph Tags to everything and remove them where needed */
    // <([^>]+)> --> FOR HTML TAGS 
    var paragraphRegexp = new RegExp('((?<!<([^>]+)>).*)', 'g');
    str = str.replace(paragraphRegexp, "<p>$1</p>");
    
    paragraphRegexp = new RegExp('<p></p>', 'g');
    str = str.replace(paragraphRegexp, "");

    paragraphRegexp = new RegExp('<p>(?=<([^>]+)>)(.*)</p>', 'g');
    str = str.replace(paragraphRegexp, "$2");

    paragraphRegexp = new RegExp('(<strong>.*)', 'g');
    str = str.replace(paragraphRegexp, "<p>$1</p>");

    /* GENERAL FLUFF REMOVAL */
    var noteToEA = /.*(?:&lt;){1,}Note to EA.*/gi;
    str = str.replace(noteToEA, "");

    return str;
}

function abbreviations(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: [ 'p', 'br', 'em', 'strong', 'sup', 'sub' ],
        allowedAttributes: [],
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    var clean = sanitizeHtml(str, options);

    // Turn <p> tags into <br/>
    var pRegExp = new RegExp('<p>(.*)</p>', 'g');     
    return clean.replace(pRegExp, "$1<br/>");
}

function references(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: [ 'p', 'br', 'em', 'strong', 'sup', 'sub' ],
        allowedAttributes: [],
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    var clean = sanitizeHtml(str, options);
    // Remove numbers following <p> tags 
    var pRegExp = /<p>(\d{0,3}\.?\s+)(.*)<\/p>/g;     
    return clean.replace(pRegExp, "<li>$2</li>");
}

function formatServedReceived(string) {
    var clean = string;
    var servedRegExp2 = /\s+(Served|served)/g;
    clean = clean.replace(servedRegExp2, "$1");

    var servedRegExp3 = /(Served|served)/g;
    clean = clean.replace(servedRegExp3, "<br/>$1");

    // "Recieved" statements 
    // var recievedRegExp = /<p>(Recieved|recieved)/g;
    // clean = clean.replace(recievedRegExp, "$1");
    
    var receivedRegExp2 = /\s+(Received|received)/g;
    clean = clean.replace(receivedRegExp2, "$1");

    var receivedRegExp3 = /(Received|received)/g;
    clean = clean.replace(receivedRegExp3, "<br/>$1");

    // "Owns" statements
    // var ownsRegExp = /<p>(Owns|owns)/g;
    // clean = clean.replace(ownsRegExp, "$1");
    
    var ownsRegExp2 = /\s+(Owns|owns)/g;
    clean = clean.replace(ownsRegExp2, "$1");

    var ownsRegExp3 = /(Owns|owns)/g;
    clean = clean.replace(ownsRegExp3, "<br/>$1");

    return clean;
}

function peerReviewer(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: ['br', 'em', 'strong', 'sup', 'sub'],
        allowedAttributes: [],
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    var clean = sanitizeHtml(str, options);

    clean = formatServedReceived(clean);

    return clean;
}

function programDetails(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }

    str = plainText(str);
    str = singleLine(str);
    return str;
}

function contributorAffiliations(str) {
    var pRegExp = /<p>/g;
    var pCloseRegExp = /<\/p>/g;
    var result = str.replace(pCloseRegExp, "<br/>").replace(pRegExp, "");
    return stringOps.findLastAndReplace(result, "<br/>", "");
}

function contributorDisclosures(str) {
    var string = str;
    var doctorRegExp = /<p>(Dr)/g;
    
    string = string.replace(doctorRegExp, "<p><br/><br/>Dr");

    var mrRegExp = /<p>(Mr)/g;
    string = string.replace(mrRegExp, "<p><br/><br/>Mr");

    var msRegExp = /<p>(Ms)/g;
    string = string.replace(msRegExp, "<p><br/><br/>Ms");

    var mrsRegExp = /<p>(Mrs)/g;
    string = string.replace(mrsRegExp, "<p><br/><br/>Mrs");

    string = formatServedReceived(string).replace(/--ENTITY#9746;--/g, "");

    return string.replace(/<p>|<\/p>/g, "");
}

function contributorFluff(str) {
    /* 
    USE THIS FUNCTION IN FIND CONTRIBUTORS: 
        - After the main contributor text block is found clean it up with 
          this function
        Find Notes to AME: section 
        Use getTextblock and substring from start index to end index 
    */
    // var block = stringOps.getTextBlock(str, /.*Notes to AME:.*/g, /.*SD\/Editor\/Writer.*/g);

    // str = str.substring(0, block.startIndex) + str.substring(block.endIndex);

    var index = stringOps.regexIndexOf(str, /.*Notes to AME:.*/g);

    if (index != -1) {
        str = str.substring(0, index);    
    }

    var membersRegExp = /.*Members:.*/g;
    str = str.replace(membersRegExp, "");

    var chairRegExp = /.*Chair:.*/g;
    str = str.replace(chairRegExp, "");

    var facultyInfoRegExp = /.*Faculty Information and Disclosure Statements.*/gi;
    
    str = str.replace(facultyInfoRegExp, "");

    return str;
}

function cmeReviewerFluff(str) {
    /* 
    USE THIS FUNCTION IN FIND CME REVIEWERS: 
        - After the main reviewer text block is found clean it up with 
          this function
        Find Notes to AME: section 
        Use getTextblock and substring from start index to end index 
    */
    // var block = stringOps.getTextBlock(str, /.*Notes to AME:.*/g, /.*SD\/Editor\/Writer.*/g);

    // str = str.substring(0, block.startIndex) + str.substring(block.endIndex);
    var selectRegExp = /.*Select the appropriate CME reviewer.*/g;
    str = str.replace(selectRegExp, "");

    var pleaseDeleteRegExp = /.*\*\*\*Please delete the unneeded CME reviewer.*/g;
    str = str.replace(pleaseDeleteRegExp, "");

    return str;
}

function learningObjectives(textBlock, removeFluff=true) {
    if (removeFluff){
        textBlock = removeTicketFluff(textBlock);
    }    

    var removeRegExp = /.*Question type assessing.*/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /&#8226;/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /.*<p>Question #.*/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /.*Question #.*/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /.*Question type answering this objective.*/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /.*<p>Linked Pre-\/Post-assessment.*/g;
    textBlock = textBlock.replace(removeRegExp, '');
    
    removeRegExp = /<p>\d+<\/p>|<p>\d+,\d+<\/p>/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /<p>CME evaluation<\/p>/g;
    textBlock = textBlock.replace(removeRegExp, '');

    removeRegExp = /.*Posttest.*/g;
    textBlock = textBlock.replace(removeRegExp, '');
    return textBlock;
}

function associationDisclaimer(textBlock, removeFluff=true) {
    if (removeFluff){
        textBlock = removeTicketFluff(textBlock);
    }    

    var removeRegExp = /.*\(event description.*/g;
    textBlock = textBlock.replace(removeRegExp, '');

    return textBlock;
}

function removeEntities(xmlString) {
    var entityRegexp = new RegExp('&(#?[0-9]+);', 'g');
    str = xmlString.replace(entityRegexp, '');
    return str;
}

function insertEntityPlaceholders (xmlString) {
    var str = xmlString;

    var blankRegExp = new RegExp('&nbsp;', 'g');
    str = str.replace(blankRegExp, "--SPACEENTITY--");

    var entityRegexp = new RegExp('&(#?[0-9]+);', 'g');
    str = str.replace(entityRegexp, '--ENTITY$1;--');

    var ampersandRegExp = /&/gi;
    str = str.replace(ampersandRegExp, '--AMPERSAND--');

    return str;
}

function cleanEntities (xmlString) {
    var clean = xmlString;
    
    // Remove Entity Placeholders
    var blankRegExp = new RegExp('--SPACEENTITY--', 'g');
    clean = clean.replace(blankRegExp, "&#160;");
    
    var entityRegExp2 = new RegExp('--ENTITY(#?[0-9]+);--', 'g');
    clean = clean.replace(entityRegExp2, '&$1;');

    // Remove Ampersand Placeholder 
    var ampersandRegExp = new RegExp('--AMPERSAND--', 'g');
    clean = clean.replace(ampersandRegExp, '&amp;'); 

    // Remove &amp; from before entitities  
    var entityRegexp = new RegExp('&amp;([A-Za-z]+|#?[0-9]+);', 'g');
    clean = clean.replace(entityRegexp, "&$1;");
    return clean;
}

function tableCleanup(htmlString, removeFluff=false) {
    var str = htmlString.slice();
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    
    var options = {
        allowedTags: [ 'p', 'br', 'em', 'strong', 'sup', 'sub', 'table', 'td', 'tr', 'th'],
        allowedAttributes: [],
        parser: {
            decodeEntities: false
        },
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    var clean = sanitizeHtml(str, options);
    
    var addTbodyOpening = new RegExp('<table>');
    clean = clean.replace(addTbodyOpening, '<table class = "inline_data_table">\n<tbody xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:dctm="http://www.documentum.com" xmlns:fmt="http://java.sun.com/jstl/fmt" xmlns:jsp="jsp">');

    var addTbodyClosing = new RegExp('</table>');
    clean = clean.replace(addTbodyClosing, '</tbody></table>');

    var addBlockQuoteOpening = /<\/tbody><\/table>\s+<p>/gi;
    clean = clean.replace(addBlockQuoteOpening, '</tbody></table>\n<blockquote>');

    var addBlockQuoteClosing = /<\/p>\s+<p><strong>&lt;&lt;end table/gi;
    clean = clean.replace(addBlockQuoteClosing, '</blockquote>\n\n<p><strong>&lt;&lt;end table');

    
    return clean;
}

module.exports = {
    basicHTMLSanitize,
    removeTicketFluff,
    supEdgeCases,
    singleLine,
    plainText,
    onlyParagraphTags,
    paragraph,
    unorderedList,
    slidesInitial,
    slidesFinal,
    abbreviations,
    references,
    peerReviewer,
    programDetails,
    contributorAffiliations,
    contributorDisclosures,
    contributorFluff,
    cmeReviewerFluff,
    learningObjectives,
    associationDisclaimer,
    removeEntities,
    insertEntityPlaceholders,
    cleanEntities,
    tableCleanup
}; 