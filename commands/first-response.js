// ------------------------------------------------------------
// COMMAND FOR GENERATING CLINICAL BRIEF XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs-extra');

const utils = require('../utils');
const articles = require('../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
let config = require('../config');
let actions = require('./actions');


// VARS
// ------------------------------------------------------------
const firstResponseHelp = `
Generates First Response XML code from R2Net html file.`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/first-response/article.html';
}

let outputFile = function () {
    return `${program.articleID}.xml`; // Make dynamic considering
};  

let program = config.programs.firstResponse;





// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.firstResponse.buildFirstResponse(prodTicket, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate first response <articleID>', firstResponseHelp)
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
