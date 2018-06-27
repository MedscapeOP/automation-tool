const sanitizeHtml = require('sanitize-html');

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


module.exports = {
    paragraph
}; 