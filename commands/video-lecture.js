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
let prompts = require('./prompts');


// VARS
// ------------------------------------------------------------
const briefHelp = `
Generates Clinical Brief XML code from R2Net html file.`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/video-lecture/article.html';
}

let outputFile = function () {
    return `${program.articleID}.xml`; // Make dynamic considering
};  

let program = config.programs.videoLecture;


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
    return articles.spotlight.buildSpotlight(prodTicket, program);
}



// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate video lecture <articleID>', briefHelp)
    .types({string: ['_']})
    .action(function(args, callback) {
        let self = this; 
        try {
            buildFinalOutput(self);
            callback();
        } catch (error) {
            self.log(error.message);
            callback();
        }
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
