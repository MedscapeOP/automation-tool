// ------------------------------------------------------------
// COMMAND FOR GENERATING CURBSIDE CONSULT XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs');

const utils = require('../utils');
const articles = require('../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
let config = require('../config');
let actions = require('./actions');


// VARS
// ------------------------------------------------------------
const curbsideHelp = `
Generates Curbside Consult XML code from R2Net html file. Input directory: /curbside/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/curbside/article.html';
};

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}/${program.articleID}.xml`,
        checklist: `${program.articleID}/${program.articleID}_checklist.html`,
        activity: `${program.articleID}/${program.articleID}_activity.xml`
    };
}; 

let program = config.programs.curbsideConsult;


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.spotlight.buildSpotlight(prodTicket, program);
}



// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate curbside <articleID>', curbsideHelp)
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        program.articleID = args.articleID;        
        let self = this;

        actions.basicArticleAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
