// ------------------------------------------------------------
// COMMAND FOR GENERATING REFERENCES XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs');

const utils = require('../../utils');
const articles = require('../../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
const prodticket = require('../../prodticket');


// VARS
// ------------------------------------------------------------
const learningObjectivesHelp = `
Formats raw Learning Objectives from the prodticket into the proper format for D2. ${N+N} Using the R2Net HTML, select everything from the first "Have increased..." up to but not including "<p>Click <strong>+</strong> to add another table row</p>". ${N+N} Run this command after you paste that section of HTML into this file: /format/format.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/format/format.html`;
}

let outputFile = function () {
    return `formatted/learning-objectives.html`
};  

// PROMPTS 
// ------------------------------------------------------------


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------
let buildFinalOutput = function (self) {
    var learningObjectivesHTML = cliTools.readInputFile(inputFile()); 
    if (utils.stringOps.isBlankOrWhiteSpace(learningObjectivesHTML) || utils.stringOps.isEmptyString(learningObjectivesHTML)) {
        throw new Error("Please paste html into format/format.html");
    } else {
        learningObjectivesHTML = utils.cleanHTML.learningObjectives(learningObjectivesHTML);
        learningObjectivesHTML = utils.cleanHTML.onlyParagraphTags(learningObjectivesHTML, removeFluff=false).trim();
        // console.log(learningObjectivesHTML);
        return utils.formatLearningObjectives(learningObjectivesHTML);
    }
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('format learning-objectives', learningObjectivesHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);      
        let self = this;
        try {
            var result = buildFinalOutput(self);
            var completionMessage = `Formatted Learning Objectives HTML created successfully! Check your output folder for the file: ${outputFile()}`;
            result = utils.cleanHTML.cleanEntities(result);
            utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
            callback();                                     
        } catch (error) {
            self.log(error.message);
            callback(); 
        }   
    });
    // vorpal.on('client_prompt_submit', function (program){
    //     cliTools.resetProgram(program);
    // });
};

// vorpal.on('client_prompt_submit', function (command){
//     if (command === "properties") {
//         self.log(newComponents);
//         callback();
//     } 
// });