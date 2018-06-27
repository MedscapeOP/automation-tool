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
    var textPropertyPath = pathBuilder.createPathToProperty(xmlJSObject, "text", "");

    console.log(textPropertyPath);
    for (var i = 0; i < textPropertyPath.length; i++) {
        if (_.hasIn(xmlJSObject, textPropertyPath[i])) {
            _.update(xmlJSObject, textPropertyPath[i], function (text) {
                if (text !== undefined) {
                    return text.trim();
                }          
            });
        } else {
            continue;
        }
    }
    pathBuilder.resetMyObject();
    return xmlJSObject;
}

module.exports = {
    xmlStringToJS,
    xmlFileToJS,
    writeXMLFromObject,
    trimObjectText,
    cleanHTML
};
