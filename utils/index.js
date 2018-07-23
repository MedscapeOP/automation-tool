const _ = require('lodash');
const convert = require('xml-js');
const fs = require('fs');
const cleanHTML = require('./clean-html');
const pathBuilder = require('./path-builder');

function xmlStringToJS(xmlString) {
    var options = { compact: false, alwaysChildren: true, spaces: 4 };
    var result = convert.xml2js(xmlString, options);
    return result;
}

function xmlFileToJS(pathToFile) {
    var xml = fs.readFileSync(pathToFile, 'utf8');
    var options = { compact: false, alwaysChildren: true, ignoreComment: true, alwaysChildren: true };
    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    return result;
}

function writeXMLFromObject(object, pathToFile) {
    // Need options or the file will be output as empty. 
    var options = { compact: false, fullTagEmptyElement: true};
    var result = convert.js2xml(object, options);
    fs.writeFile(pathToFile, result, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The new file was created!");
    });
}

function trimObjectText(xmlJSObject) {
    /*
    Remove empty space from text properties of object. 
    */
    pathBuilder.resetMyObject();
    var textPropertyPaths = pathBuilder.createPathToProperty(xmlJSObject, "text", "");

    _.remove(textPropertyPaths, function(path) {
        if (_.hasIn(xmlJSObject, path)) {
            return false;
        }
    });    

    // console.log(textPropertyPaths);
    for (var i = 0; i < textPropertyPaths.length; i++) {
        _.update(xmlJSObject, textPropertyPaths[i], function (text) {
            if (typeof text === "string") {
                return text.trim();
            }                   
        });
    }
    return xmlJSObject;
}

module.exports = {
    xmlStringToJS,
    xmlFileToJS,
    writeXMLFromObject,
    trimObjectText,
    cleanHTML
};
