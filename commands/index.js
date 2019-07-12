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
const inLanguage = require('./in-language');
const downloadableSlides = require('./downloadable-slides');
const certificateLinks = require('./certificate-links');
const snippetChooser = require('./snippets-chooser');

// COMPONENT COMMANDS (XML)

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
    
    // SNIPPET COMMANDS (HTML/XML)
    inLanguage(vorpal);
    downloadableSlides(vorpal);
    certificateLinks(vorpal);
    snippetChooser(vorpal);

    // COMPONENT COMMANDS (XML)

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