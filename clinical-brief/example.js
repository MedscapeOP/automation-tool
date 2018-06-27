var fs = require('fs');
var utils = require('../utils');

// var result = utils.xmlFileToJS(__dirname + '/tocElementBuild.xml');
//     // result.prof_article.title = [{"p": ["Some new Title I PUT."]}]
//     // var newXmlFile = builder.buildObject(result);
// fs.writeFile(__dirname + "/tocElementBuild.json", JSON.stringify(result), function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The new file was created!");
// }); 

var result = utils.xmlFileToJS(__dirname + '/article.xml');
    // result.prof_article.title = [{"p": ["Some new Title I PUT."]}]
    // var newXmlFile = builder.buildObject(result);
fs.writeFile(__dirname + "/article.js", JSON.stringify(result), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The new file was created!");
}); 


/* 
FOR SLIDES: Make this a master util function that is used within different programs. 
- Factory function for TOC element - global 
- Create Factory function for slide_grp - global
- Build the html first - global 
- Attached to generated slide_grp - global 
- Attach slide_grp to TOC within a loop. - Program specific (Spotlight, VL, Curbside, First Response, Townhall Enduring)
    - Add special case handling with interactivity questions here.  
*/