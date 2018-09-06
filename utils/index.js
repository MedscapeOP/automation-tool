const _ = require('lodash');
const cleanHTML = require('./clean-html');
const pathBuilder = require('./path-builder');
const xmlOps = require('./xml-ops');
const buildSlides = require('./build-slides');

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
    xmlOps,
    trimObjectText,
    cleanHTML,
    buildSlides
};
