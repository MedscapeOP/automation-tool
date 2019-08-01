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
let prompts = require('../prompts');


// VARS
// ------------------------------------------------------------
const disclosuresHelp = `
Formats raw Disclosures from the prodticket into the proper format for D2. ${N+N} Using the R2Net HTML, select everything from the first "Have increased..." up to but not including "<p>Click <strong>+</strong> to add another table row</p>". ${N+N} Run this command after you paste that section of HTML into this file: /format/format.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/format/format.html`;
}

let outputFile = function () {
    return `formatted/disclosures.html`
};  

let programOptions = _.mapKeys(config.programs, function (value, key) {
    return value.name;
});

// console.log("PROGRAM OPTIONS 1: ", programOptions);

programOptions = _.mapValues(programOptions, function (o){
    return {codeName: o.codeName, dirName: o.dirName};
});

// console.log("PROGRAM OPTIONS 2: ", programOptions);

// Make names be the keys --> Map keys 
// then set value of key to be codeName and dirName--> Map values

let program = null;

let infoObject = {
    articleID: null
}


// PROMPTS 
// ------------------------------------------------------------


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------
let buildFinalOutput = function (self) {
    // var learningObjectivesHTML = cliTools.readInputFile(inputFile()); 
    // if (utils.stringOps.isBlankOrWhiteSpace(learningObjectivesHTML) || utils.stringOps.isEmptyString(learningObjectivesHTML)) {
    //     throw new Error("Please paste html into format/format.html");
    // } else {
    //     learningObjectivesHTML = utils.cleanHTML.learningObjectives(learningObjectivesHTML);
    //     learningObjectivesHTML = utils.cleanHTML.onlyParagraphTags(learningObjectivesHTML, removeFluff=false).trim();
    //     // console.log(learningObjectivesHTML);
    //     return utils.formatLearningObjectives(learningObjectivesHTML);
    // }
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('format disclosures', disclosuresHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);      
        let self = this;
        prompts.productTypePrompt(self, _.keys(programOptions))
        .then((answers) => {
            if (answers) {
                var productType = answers.productType;                
                for (var key in config.programs) {
                    if (config.programs[key].name == productType) {
                        program = config.programs[key];
                    }
                }
                return buildFinalOutput(self);
            } else {
                self.log(`Not getting answers for productType`);
                callback();
            } 
        }).then((result) => {
            try {
                var result = buildFinalOutput(self);
                var completionMessage = `Formatted contributor disclosures created successfully! Check your output folder for the file: ${outputFile()}`;
                result = utils.cleanHTML.cleanEntities(result);
                utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                callback();                                     
            } catch (error) {
                self.log(error.message);
                callback(); 
            }   
        }).catch((error) => {
            self.log(error);
            callback();
        });
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