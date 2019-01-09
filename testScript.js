// var SlideGroup = require("./classes/slide_grp");

// var slideGroup = new SlideGroup("899/898", 2);

// slideGroup.sectionText = "<div><p>Test Text</p></div>"

// console.log(JSON.stringify(slideGroup.sectionText, undefined, 2));


// const madge = require('madge');
 
// madge(__dirname + '/app.js').then((res) => {
//     console.log(res.obj());
// });

// RUN SPOTLIGHT FROM JULY 897160 --> Fix these edge cases 

var utils = require('./utils');
var fs = require('fs');

var articleObject = utils.xmlOps.xmlFileToJS(__dirname + "/elements/activity_complete_cb.xml");

fs.writeFileSync("./elements/activity.json", JSON.stringify(articleObject, undefined, 2));