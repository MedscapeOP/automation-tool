// GENERAL MODULES 
const config = require('../config');
const utils = require('../utils');
const classes = require('../classes');
const prodTicket = require('../prodticket');
const snippets = require('../snippets');
const articles = require('../articles');

// COMMANDS
const inLanguage = require('./in-language');
const brief = require('./clinical-brief');
const spotlight = require('./spotlight');
const curbside = require('./curbside-consult');
const videoLecture = require('./video-lecture');
const firstResponse = require('./first-response');
const townHallEnduring = require('./townhall-enduring');
const testAndTeach = require('./test-and-teach');
const propertiesChecklist = require('./properties-checklist');

// Build commands function 
let commands = function (vorpal) {
    inLanguage(vorpal);
    brief(vorpal);
    spotlight(vorpal);
    curbside(vorpal);
    videoLecture(vorpal);
    firstResponse(vorpal);
    townHallEnduring(vorpal);
    testAndTeach(vorpal);
    propertiesChecklist(vorpal);
}

// ------------------------------------------------------------
// MODULE EXPORTS 
// ------------------------------------------------------------
module.exports = {
    config,
    utils,
    classes,
    prodTicket,
    snippets,
    articles,
    commands     
};