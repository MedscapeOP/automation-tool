const _ = require('lodash');
const xmlOps = require('./xml-ops');
const formatList = require('./format-list');
const stringOps = require('./string-ops');
const cleanHTML = require('./clean-html');
const pathBuilder = require('./path-builder');
const buildSlides = require('./build-slides');
const formatLearningObjectives = require('./format-learning-objectives');

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

function wrapSubsectionContent(textBlock, cleaningFn) {
    // Put together final string of XML. 
    if (cleaningFn) {
        return "<subsec_content>" + cleaningFn(textBlock) + "</subsec_content>";
    } else {
        return "<subsec_content>" + textBlock + "</subsec_content>";
    }       
}

function wrapSlideIntro(textBlock, cleaningFn) {
    // Put together final string of XML. 
    if (cleaningFn) {
        return "<slide_intro>" + cleaningFn(textBlock) + "</slide_intro>";
    } else {
        return "<slide_intro>" + textBlock + "</slide_intro>";
    }       
}

module.exports = {
    stringOps,
    xmlOps,
    formatList,
    formatLearningObjectives,
    trimObjectText,
    cleanHTML,
    buildSlides,
    wrapSubsectionContent,
    wrapSlideIntro
};
