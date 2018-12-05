// ------------------------------------------------------------
// COMMAND FOR GENERATING SPOTLIGHT XML 
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
const spotlightHelp = `
Generates Spotlight XML code from R2Net html file. Input directory: /spotlight/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/spotlight/article.html';
}

let outputFile = function () {
    return `${program.articleID}.xml`; // Make dynamic considering
};  

let program = config.programs.spotlight;


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
    .command('generate spotlight <articleID>', spotlightHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        program.articleID = args.articleID;        
        let self = this;
        actions.basicArticleAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFile);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};

// vorpal.on('client_prompt_submit', function (command){
//     if (command === "properties") {
//         self.log(newComponents);
//         callback();
//     } 
// });