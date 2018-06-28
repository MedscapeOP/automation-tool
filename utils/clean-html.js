const sanitizeHtml = require('sanitize-html');

/*
Common Entities / Things to remove: 
&#9744; --> Empty checkbox
&#9746; --> Filled checkbox 
&#8226; --> Unordered List bullet 
<tt>o     </tt> --> Unorder List Sub-bullet 
*/

function paragraph(string) {
    // Removes ALL HTML: 
        // var str = string.replace(/\(Insert.*\)/, "").replace(/<{1}[^<>]{1,}>{1}/g," ");       
    // Removes (Insert ...) statements 
    var str = string.replace(/\(Insert.*\)/, "");

    // Removes certain tags and replaces them with flags for later use 
    // var tags = ["em", "strong"];
    // for (var i = 0; i < tags.length; i++) {
    //     var tag = tags[i];
    //     var regexp = new RegExp(`<${tag}>.\s<\\/${tag}>|<${tag}>[\S]{0,1}<\\/${tag}>`, 'gi');
    //     str.replace(regexp, `||${tag}||`);
    // }
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
    return clean;
}

function unorderedList(string) {
    var str = string.replace(/\(Insert.*\)/, "");
    var options =   {
        allowedTags: [ 'ul', 'li', 'em', 'strong', 'sup' ],
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
    var clean = sanitizeHtml(str, options);
    var regexp = new RegExp(`&amp;([A-Za-z]+|#?[0-9]+);`);
    clean.replace(regexp, "&$1;");
    return clean;
}


module.exports = {
    paragraph,
    unorderedList
}; 