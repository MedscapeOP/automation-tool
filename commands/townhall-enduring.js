// ------------------------------------------------------------
// COMMAND FOR GENERATING TOWNHALL ENDURING XML 
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
const townHallEnduringHelp = `
Generates TownHall Enduring XML code from R2Net html file. Input directory: /townhall-enduring/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/townhall-enduring/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}.xml`,
        checklist: `${program.articleID}_checklist.html`
    };
};    

let program = config.programs.townHall;


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.townHallEnduring.buildTownHallEnduring(prodTicket, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate townhall enduring <articleID>', townHallEnduringHelp)
    .types({string: ['_']})
    .action(function(args, callback) {       
        program.articleID = args.articleID;        
        let self = this;
        actions.basicArticleAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
