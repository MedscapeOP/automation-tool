// GENERAL MODULES 
const config = require('../config');
const utils = require('../utils');
const classes = require('../classes');
const prodTicket = require('../prodticket');
const snippets = require('../snippets');
const articles = require('../articles');


// PRODUCER COMMANDS 
const propertiesChecklist = require('./properties-checklist');

// SNIPPET COMMANDS (HTML)
const downloadableSlides = require('./downloadable-slides');

// COMPONENT COMMANDS (XML)
const inLanguage = require('./in-language');

// CLEAN UP COMMANDS (HTML)


// GENERATE COMMANDS
const brief = require('./clinical-brief');
const spotlight = require('./spotlight');
const curbside = require('./curbside-consult');
const videoLecture = require('./video-lecture');
const firstResponse = require('./first-response');
const townHallEnduring = require('./townhall-enduring');
const testAndTeach = require('./test-and-teach');

// Build commands function 
let commands = function (vorpal) {
    // PRODUCER COMMANDS 
    propertiesChecklist(vorpal);
    
    // SNIPPET COMMANDS (HTML)
    downloadableSlides(vorpal);

    // COMPONENT COMMANDS (XML)
    inLanguage(vorpal);

    // CLEAN UP COMMANDS (HTML)

    // GENERATE COMMANDS (FULL ARTICLE XML)
    brief(vorpal);
    spotlight(vorpal);
    curbside(vorpal);
    videoLecture(vorpal);
    firstResponse(vorpal);
    townHallEnduring(vorpal);
    testAndTeach(vorpal);
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