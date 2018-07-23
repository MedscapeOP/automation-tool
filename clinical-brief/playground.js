var utils = require('../utils');
var fs = require('fs');

// OLD WAY TO BUILD JS OBJECT
// function buildClinicalContext(ccArray) {
//     var element = [];
//     var p;
//     for (var i = 0; i < ccArray.length; i++) {
//         p = {"p": [ccArray[i]]};
//         element.push(p);
//     }
//     return element;
// }


// var clinicalContext = clinicalBrief.getClinicalContext(prodTicket);
// var synopsisAndPerspective = clinicalBrief.getSynopsisAndPerspective(prodTicket);

// console.log(clinicalContext);

// fs.writeFileSync(__dirname + '/article2.json', JSON.stringify((clinicalContext)));

// fs.writeFileSync(__dirname + '/article2.html', clinicalContext);

// console.log(synopsisAndPerspective);
// utils.writeXMLFromObject(clinicalContext, __dirname + "/output/article2.xml");


// var SectionElement = require("../classes/sec_element");
// var TOCElement = require("../classes/toc_element");

// var secInstance = new SectionElement("My Section Header");
// var tocInstance = new TOCElement("", "Default");



// tocInstance.insertSectionElement(secInstance);

// tocInstance.tocLabel = "My TOC Build2";
// tocInstance.tocType = "Sidebar";

// console.log(tocInstance.toObjectLiteral().elements[0]);

// utils.writeXMLFromObject(tocInstance.toObjectLiteral(), __dirname + "/output/tocElementBuild.xml");

var slideGrp = utils.xmlFileToJS(__dirname + '/../elements/slide_grp.xml');

fs.writeFileSync(__dirname + '/../elements/slide_grp.json', JSON.stringify(slideGrp));