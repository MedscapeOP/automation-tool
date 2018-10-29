const convert = require('xml-js');
const fs = require('fs');
const cliTools = require('./cli-tools');

function xmlStringToJS(xmlString) {
    var options = { compact: false, alwaysChildren: true, spaces: 4 };
    var result = convert.xml2js(xmlString, options);
    return result;
}

function xmlFileToJS(pathToFile) {
    var xml = fs.readFileSync(pathToFile, 'utf8');
    var options = { compact: false, alwaysChildren: true, ignoreComment: true, alwaysChildren: true};
    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    return result;
}

function writeXMLFromObject(object, pathToFile) {
    // Need options or the file will be output as empty. 
    var options = { compact: false, fullTagEmptyElement: true};
    var result = convert.js2xml(object, options);
    fs.writeFile(pathToFile, result, function (err) {
        if (err) {
            // throw new cliTools.RandomException(err.message);
            return console.log(err);
        }
        // console.log("The new file was created!");
    });
}

function objectToXMLString(object) {
    // Need options or the file will be output as empty. 
    var options = { compact: false, fullTagEmptyElement: false};
    var result = convert.js2xml(object, options);
    return result;
}

module.exports = {
    xmlStringToJS,
    xmlFileToJS,
    writeXMLFromObject,
    objectToXMLString
};