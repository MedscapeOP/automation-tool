// ------------------------------------------------------------
// COMMAND FOR GENERATING CLINICAL BRIEF XML 
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
let prompts = require('./prompts');


// VARS
// ------------------------------------------------------------
const briefHelp = `
Generates Clinical Brief XML code from R2Net html file.`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/brief/article.html';
}

let outputFile = function () {
    return `${program.articleID}.xml`; // Make dynamic considering
};  

let program = config.programs.clinicalBrief;


// PROMISE THEN CALLBACK 
// ------------------------------------------------------------
let promiseCallback = function (self, callback, answers, nameOfPrompt, nextFunction) {
    if (answers) {
        // message = 'Please choose which addons you need!'
        if (answers[nameOfPrompt]) {
            program[nameOfPrompt] = answers[nameOfPrompt];
            // DO SOME OTHER ASYNC TASK 
            // - need async keyword before 'function' for this to work   
            // try {
            //     await languagePrompt(self)
            //     .then((answers) => {});
            // } catch (err) {}
        } 
        if (nextFunction) {
            return nextFunction(self);                                         
        } else {
            callback();
        }                
    } else {
        self.log(`Not getting answers for ${nameOfPrompt}`);
        callback();
    } 
} 


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.clinicalBrief.buildClinicalBrief(prodTicket, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate brief <articleID>', briefHelp)
    .types({string: ['_']})
    .action(function(args, callback) {
        program.articleID = args.articleID;        
        vorpal.emit('client_prompt_submit', program);
        var completionMessage = `${program.name} created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
        prompts.completeGenerateAction(this, callback, buildFinalOutput, outputFile(), completionMessage);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
