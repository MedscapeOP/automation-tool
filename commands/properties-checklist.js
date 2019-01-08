// ------------------------------------------------------------
// COMMAND FOR GENERATING PRODUCER CHECKLIST FILE 
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
const propertiesHelp = `
Generates Checklist of D2 properties for Producers. Input directory: /producer/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/producer/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: null,
        checklist: `${program.articleID}_D2checklist.html`
    };
};  

let programOptions = []; 
_.forEach(config.programs, function (value, key) {
    programOptions.push(value.name);
});
let program = config.propertiesChecklist;


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    var checklist = articles.propertiesChecklist.getChecklist(prodTicket, program);
    return articles.propertiesChecklist.buildChecklist(checklist, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('producer checklist <articleID>', propertiesHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        program.articleID = args.articleID;        
        let self = this;
        this.log(programOptions);
        actions.checklistAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles, programOptions);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
