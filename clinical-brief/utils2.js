var convert = require('xml-js');
var fs = require('fs');

// result = convert.js2xml(js, options);     // to convert javascript object to xml text
// result = convert.json2xml(json, options); // to convert json text to xml text
// result = convert.xml2js(xml, options);    // to convert xml text to javascript object
// result = convert.xml2json(xml, options);  // to convert xml text to json


function cleanHTML(string) {
    // Case for empty formatting tags 
    // var str = string.replace(/\(Insert.*\)/, "").replace(/<{1}[^<>]{1,}>{1}/g," ");
    var tags = ["em", "strong"];
    var str = string.replace(/\(Insert.*\)/, "");
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        var regexp = new RegExp(`<${tag}>.\s<\\/${tag}>|<${tag}>[\S]{0,1}<\\/${tag}>`, 'gi');
        str.replace(regexp, "");
    }
    return str; 
}

function xmlStringToJS(xmlString){;    
    var options = {compact: false, alwaysChildren: true, spaces: 4};
    var result = convert.xml2js(xmlString, options);
    return result;
}

function xmlFileToJS(pathToFile) {
    var xml = fs.readFileSync(pathToFile, 'utf8');
    var options = {compact: false, alwaysChildren: true, ignoreComment: true, alwaysChildren: true};
    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    return result;
}

function writeXMLFromObject(object, pathToFile) {
    // Need options or the file will be output as empty. 
    var options = {compact: false};
    var result = convert.js2xml(object, options);
    fs.writeFile(pathToFile, result, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The new file was created!");
    }); 
} 

module.exports = {
    xmlStringToJS,
    xmlFileToJS,
    writeXMLFromObject,
    cleanHTML
};