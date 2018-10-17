// var SlideGroup = require("./classes/slide_grp");

// var slideGroup = new SlideGroup("899/898", 2);

// slideGroup.sectionText = "<div><p>Test Text</p></div>"

// console.log(JSON.stringify(slideGroup.sectionText, undefined, 2));


// const madge = require('madge');
 
// madge(__dirname + '/app.js').then((res) => {
//     console.log(res.obj());
// });

var utils = require('./utils');
var fs = require('fs');

var articleObject = utils.xmlOps.xmlFileToJS(__dirname + "/elements/toc_element.xml");

fs.writeFileSync("./elements/toc_element.json", JSON.stringify(articleObject, undefined, 2));