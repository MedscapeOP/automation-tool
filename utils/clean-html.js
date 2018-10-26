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

function removeTicketFluff(str) {
    // Remove this from Prod ticket (Insert text)
    // var insertRegExp = new RegExp('(Insert.*)', 'g');
    var insertRegExp = /\(Insert.*\)/g;
    str = str.replace(insertRegExp, "");

    var insertRegExp2 = /\(insert.*\)/g;
    str = str.replace(insertRegExp2, "");

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

    //Remove Click + to add another row
    var addRowRegExp = /.*Click.*to add.*/g;
    str = str.replace(addRowRegExp, "");

    // Remove instructions for Peer Reviewer
    var peerReviewerRegExp = /<p>Indicate which reviewers were involved.*/g;
    str = str.replace(peerReviewerRegExp, "");

    var peerReviewerRegExp2 = /<p><strong>Include Peer Reviewer.*/g
    str = str.replace(peerReviewerRegExp2, "");

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

    var supRegExp3 = new RegExp('<sup>.*\\[', 'g');
    str = str.replace(supRegExp3, "<sup>[");
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

function paragraph(string, removeFluff=true) {
    // Removes ALL HTML: 
        // var str = string.replace(/\(Insert.*\)/, "").replace(/<{1}[^<>]{1,}>{1}/g," ");       
    // Removes certain tags and replaces them with flags for later use 
    // var tags = ["em", "strong"];
    // for (var i = 0; i < tags.length; i++) {
    //     var tag = tags[i];
    //     var regexp = new RegExp('<${tag}>.\s<\\/${tag}>|<${tag}>[\S]{0,1}<\\/${tag}>', 'gi');
    //     str.replace(regexp, '||${tag}||');
    // }
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options =   {
        allowedTags: [ 'p', 'em', 'strong', 'sup' ],
        allowedAttributes: {
          'sup': ["type"],
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

function unorderedList(string, removeFluff=true, format=true) {
    var str = string;
    
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options =   {
        allowedTags: [ 'ul', 'li', 'em', 'strong', 'sup', 'tt' ],
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
    // Insert Slide edge cases / Capitalization Edge Cases
    var insertSlideRegExp1 = new RegExp('&lt;&lt;.*slide$', 'g');
    str = str.replace(insertSlideRegExp1, "&lt;&lt;insert slide");

    var insertSlideRegExp2 = new RegExp('&lt;&lt;.*Slide$', 'g');
    str = str.replace(insertSlideRegExp2, "&lt;&lt;insert slide");

    var insertSlideRegExp3 = new RegExp('&gt;&gt;.*slide$', 'g');
    str = str.replace(insertSlideRegExp3, "&lt;&lt;insert slide");

    var insertSlideRegExp4 = new RegExp('&gt;&gt;.*Slide$', 'g');
    str = str.replace(insertSlideRegExp4, "&lt;&lt;insert slide");
    
    return str;
}

function slidesFinal (str) {
        
    str = unorderedList(str);

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
    
    // var headlineRegExp4 = new RegExp('<strong>(?:&lt;){1,}Level 2(?:&gt;){1,}(?:\s){1,}</strong>(.*)</p>', 'g');
    // str = str.replace(headlineRegExp4, "<strong>&lt;&lt;Level 2&gt;&gt;$1</strong>");

    // var headlineRegExp5 = new RegExp('<strong>(?:&lt;){1,}level 2(?:&gt;){1,}(?:\s){1,}</strong>(.*)</p>', 'g');
    // str = str.replace(headlineRegExp5, "<strong>&lt;&lt;Level 2&gt;&gt;$1</strong>");


    // Remove End Slides 
    var endSlidesRegExp1 = new RegExp('&lt;&lt;end slides&gt;&gt;', 'g');
    str = str.replace(endSlidesRegExp1, "");


    // Strong/Em tag Edge Cases
    var strongRegExp1 = new RegExp('<strong></strong>', 'g');
    str = str.replace(strongRegExp1, "");

    var strongRegExp2 = new RegExp('</strong> <strong>', 'g');
    str = str.replace(strongRegExp2, "");

    var emRegExp1 = new RegExp('<em></em>', 'g');
    str = str.replace(emRegExp1, "");


    // Sup Edge Cases
    str = supEdgeCases(str);
    

    /* MAIN REGEX SERIES */
    var h3RegExp = new RegExp('<strong>(?:&lt;){1,}Level 2(?:&gt;){1,}(.*)</strong>', 'g');
    str = str.replace(h3RegExp, "<h3>$1</h3>");

    var h3RegExp2 = new RegExp('<h3>(.*)</h3>', 'g');
    var strongRegExp = new RegExp('<strong>|</strong>', 'g'); 
    str = stringOps.removeFromRegexCapture(str, h3RegExp2, strongRegExp); 

    var supRegExp = new RegExp('<sup>\\[', 'g');
    str = str.replace(supRegExp, '<sup type="ref">[');

    return str;
}

function abbreviations(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: [ 'p', 'br', 'em', 'strong', 'sup' ],
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
        allowedTags: [ 'p', 'br', 'em', 'strong', 'sup' ],
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

function peerReviewer(string, removeFluff=true) {
    var str = string;
    if (removeFluff) {
        str = removeTicketFluff(str);
    }
    var options = {
        allowedTags: ['br', 'em', 'strong', 'sup' ],
        allowedAttributes: [],
        exclusiveFilter: function(frame) {
            // return frame.tag === 'a' && !frame.text.trim();
            return !frame.text.trim();
        }
    }
    var clean = sanitizeHtml(str, options);

    // Main regex series 
    // "Served" statements 
    // var servedRegExp = /<p>(Served|served)/g;
    // clean = clean.replace(servedRegExp, "$1");
    
    var servedRegExp2 = /\s+(Served|served)/g;
    clean = clean.replace(servedRegExp2, "$1");

    var servedRegExp3 = /(Served|served)/g;
    clean = clean.replace(servedRegExp3, "<br/>$1");

    // "Recieved" statements 
    // var recievedRegExp = /<p>(Recieved|recieved)/g;
    // clean = clean.replace(recievedRegExp, "$1");
    
    var recievedRegExp2 = /\s+(Recieved|recieved)/g;
    clean = clean.replace(recievedRegExp2, "$1");

    var recievedRegExp3 = /(Recieved|recieved)/g;
    clean = clean.replace(recievedRegExp3, "<br/>$1");

    // "Owns" statements
    // var ownsRegExp = /<p>(Owns|owns)/g;
    // clean = clean.replace(ownsRegExp, "$1");
    
    var ownsRegExp2 = /\s+(Owns|owns)/g;
    clean = clean.replace(ownsRegExp2, "$1");

    var ownsRegExp3 = /(Owns|owns)/g;
    clean = clean.replace(ownsRegExp3, "<br/>$1");

    return clean;
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

function insertEntityPlaceholders (xmlString) {
    var str = xmlString;

    var blankRegExp = new RegExp('&nbsp;', 'g');
    str = str.replace(blankRegExp, "--SPACEENTITY--");

    var entityRegexp = new RegExp('&(#?[0-9]+);', 'g');
    str = str.replace(entityRegexp, '--ENTITY$1;--');
    return str;
}

function cleanEntities (xmlString) {
    var clean = xmlString;
    // Remove &amp; from before entitities  
    var entityRegexp = new RegExp('&amp;([A-Za-z]+|#?[0-9]+);', 'g');
    clean = clean.replace(entityRegexp, "&$1;");

    // Remove Entity Placeholders
    var blankRegExp = new RegExp('--SPACEENTITY--', 'g');
    clean = clean.replace(blankRegExp, "&#160;");

    var entityRegexp2 = new RegExp('--ENTITY(#?[0-9]+);--', 'g');
    clean = clean.replace(entityRegexp2, '&$1;');
    return clean;
}

module.exports = {
    removeTicketFluff,
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
    learningObjectives,
    insertEntityPlaceholders,
    cleanEntities
}; 