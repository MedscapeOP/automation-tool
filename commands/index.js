// GENERAL MODULES 
const config = require('../config');
const utils = require('../utils');
const classes = require('../classes');
const prodTicket = require('../prodticket');
const snippets = require('../snippets');
const articles = require('../articles');


// PRODUCER COMMANDS 
const propertiesChecklist = require('./producer/properties-checklist');

// SNIPPET COMMANDS (HTML)
const inLanguage = require('./snippet/in-language');
const downloadableSlides = require('./snippet/downloadable-slides');
const certificateLinks = require('./snippet/certificate-links');
const mediaInfo = require('./snippet/media-info');
const miscProviderStatement = require('./snippet/misc-provider-statement');
const slideTOCs = require('./snippet/slide-tocs');
// const snippetChooser = require('./snippets-chooser');

// COMPONENT COMMANDS (XML)
const activity = require('./component/activity');
const textTranscript = require('./component/text-transcript');
const slidesTranscript = require('./component/slides-transcript');
const abbreviations = require('./component/abbreviations');
const references = require('./component/references');
const tableOfContents = require('./component/toc');
const creditStatements = require('./component/credit-statements');
const contributors = require('./component/contributors');

// FORMAT COMMANDS (HTML)
const learningObjectives = require('./format/learning-objectives');

// GENERATE COMMANDS
const brief = require('./generate/clinical-brief');
const spotlight = require('./generate/spotlight');
const curbside = require('./generate/curbside-consult');
const videoLecture = require('./generate/video-lecture');
const firstResponse = require('./generate/first-response');
const townHallEnduring = require('./generate/townhall-enduring');
const townHallCert = require('./generate/townhall-cert');
const testAndTeach = require('./generate/test-and-teach');

// Build commands function 
let commands = function (vorpal) {
    // PRODUCER COMMANDS 
    propertiesChecklist(vorpal);
    
    // SNIPPET COMMANDS (HTML/XML)
    inLanguage(vorpal);
    downloadableSlides(vorpal);
    certificateLinks(vorpal);
    mediaInfo(vorpal);
    miscProviderStatement(vorpal);
    slideTOCs(vorpal);
    // snippetChooser(vorpal);

    // COMPONENT COMMANDS (XML)
    activity(vorpal);
    textTranscript(vorpal);
    slidesTranscript(vorpal);
    abbreviations(vorpal);
    references(vorpal);
    tableOfContents(vorpal);
    creditStatements(vorpal);
    contributors(vorpal);

    // FORMAT COMMANDS (HTML)
    learningObjectives(vorpal);

    // GENERATE COMMANDS (FULL ARTICLE XML)
    brief(vorpal);
    spotlight(vorpal);
    curbside(vorpal);
    videoLecture(vorpal);
    firstResponse(vorpal);
    townHallEnduring(vorpal);
    townHallCert(vorpal);
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