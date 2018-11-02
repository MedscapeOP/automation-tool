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
let prompts = require('./prompts');


// VARS
// ------------------------------------------------------------
const spotlightHelp = `
Generates Spotlight XML code from R2Net html file.`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/spotlight/article.html';
}

let outputFile = function () {
    return `${program.articleID}.xml`; // Make dynamic considering
};  

let program = config.programs.spotlight;


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

        // Has LLA? 
        prompts.llaPrompt(self)
        .then((answers) => {
            // Has OUS?
            return promiseCallback(self, callback, answers, "hasLLA", prompts.ousPrompt);
        })
        .then((answers) => {
            // Has Peer Reviewer?
            return promiseCallback(self, callback, answers, "hasOUS", prompts.peerReviewerPrompt);
        })
        .then((answers) => {
            // Has Collection Page?
            return promiseCallback(self, callback, answers, "hasPeerReviewer", prompts.collectionPagePrompt);
        })
        .then((answers) => {
            // Has Downloadable Slide Deck?
            return promiseCallback(self, callback, answers, "hasCollectionPage", prompts.slideDeckPrompt);
        })
        .then((answers) => {
            // Has For Your Patient PDF?
            return promiseCallback(self, callback, answers, "hasSlideDeck", prompts.forYourPatientPrompt);
        })
        .then((answers) => {
            // Build Final Output
            return promiseCallback(self, callback, answers, "hasForYourPatient", buildFinalOutput);
        })
        .then((finishedArticleObject) => {
            self.log(program);
            vorpal.emit('client_prompt_submit', program);
            var completionMessage = `${program.name} created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
            prompts.completeGenerateAction(this, callback, finishedArticleObject, outputFile(), completionMessage);   
        }) 
        .catch((err) => {
            self.log(err.message);
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