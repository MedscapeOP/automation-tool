// ------------------------------------------------------------
// COMMAND FOR GENERATING CLINICAL BRIEF XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs');

const utils = require('../../utils');
const articles = require('../../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
let config = require('../../config');
let actions = require('../actions');
let prompts = require('../prompts');


// VARS
// ------------------------------------------------------------
const briefHelp = `
Generates Clinical Brief XML code from R2Net html file. Input directory: /brief/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/brief/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}/${program.articleID}.xml`,
        checklist: `${program.articleID}/${program.articleID}_checklist.html`,
        activity: `${program.articleID}/${program.articleID}_activity.xml`
    };
};  

let program = config.programs.clinicalBrief;


// PROMPTS 
// ------------------------------------------------------------
// hasPreAssessment: false,
// hasPostAssessment: false,
let preAssessmentPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'hasPreAssessment',
        message: 'Has Pre-Assessment?'                  
    });
};

let postAssessmentPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'hasPostAssessment',
        message: 'Has Post-Assessment?'                  
    });
};


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
        let self = this;
        
        prompts.qnaPrompt(self)
        .then((answers) => {
            if (answers) {
                program.qnaID = answers.questionnaire;
                return preAssessmentPrompt(self);
            }
        })
        .then((answers) => {
            if (answers) {
                var completionMessages = {};
                completionMessages.xmlFile = `${program.name} XML created successfully! Check your output folder for the file: ${chalk.cyan(outputFiles().xmlFile)}`;
                completionMessages.checklist = `${program.name} Checklist created successfully! Check your output folder for the file: ${chalk.cyan(outputFiles().checklist)}`;
                if (answers.hasPreAssessment) {
                    program.hasPreAssessment = true;
                    actions.completeGenerateAction(this, callback, buildFinalOutput, "", "", outputFiles(), completionMessages);
                    vorpal.emit('client_prompt_submit', program);
                    callback();
                } else {
                    return postAssessmentPrompt(self)
                    .then((answers) => {
                        if (answers) {
                            program.hasPostAssessment = answers.hasPostAssessment;
                            actions.completeGenerateAction(this, callback, buildFinalOutput, "", "", outputFiles(), completionMessages);
                            vorpal.emit('client_prompt_submit', program);
                            callback();
                        } else {
                            self.log(`Not getting answers for hasPostAssessment`);
                            callback();
                        }
                    })   
                }
            } else {
                self.log(`Not getting answers for hasPreAssessment`);
                callback();
            }
        })
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
