// ------------------------------------------------------------
// COMMAND FOR GENERATING CLINICAL BRIEF XML 
// ------------------------------------------------------------

/*

*/

// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');

const utils = require('../utils');
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const cliTools = utils.cliTools;
const N = cliTools.N;
let config = require('../config');
let prompts = require('./prompts');


// VARS
// ------------------------------------------------------------
const spotlightHelp = `
Generates Spotlight XML code from R2Net html file.`;

let program = config.programs.spotlight;
let outputFile = function () {
    return `${program.articleID}.xml`; // Make dynamic considering
};  


// PROMPTS 
// ------------------------------------------------------------


// PROMISE THEN CALLBACK
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
    var tocElements = [];
    var keys = _.keys(infoObject.addons);
    var currentKey = "";
    var addonObject = null;
    var languageString = null;
    var languageObject = null;
    for (var i = 0; i < 4; i++) {
        currentKey = keys[i];
        addonObject = infoObject.addons[currentKey];
        // self.log("CURRENT KEY: ", keys[i]);
        // self.log("KEYS: ", keys);
        // self.log("ADDON OBJECT: ", addonObject);        
        if (addonObject.has) {
            for (var z = 0; z < addonObject.languages.length; z++) {
                // (articleID, language, programTitle)
                languageString = addonObject.languages[z];
                languageObject = languages[languageString];
                tocElements.push(snippets.inLanguage[currentKey](infoObject.articleID, languageObject, infoObject.articleTitle));
            }
        } 
    }
    // self.log(tocElements);
    return tocElements;
}



// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('il <articleID>', inLanguageHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;

        // Get TITLE
        articleTitlePrompt(self)
        .then(answers => {           
            // Get Has Expert Commentary?
            if (answers) {
                infoObject.articleTitle = answers.title;
                return expertCommentaryPrompt(self);
            } else {
                self.log('Not getting answer for article title');
                callback();
            }  
        })
        .then((answers) => {
            // Get Has Downloadable PDF?
            return promiseCallback(self, callback, answers, "expertCommentary", downloadablePDFPrompt);
        })
        .then((answers) => {
            // Get Has Transcript PDF?
            return promiseCallback(self, callback, answers, "downloadablePDF", transcriptPDFPrompt);
        })
        .then((answers) => {
            // Get Has Subtitles?
            return promiseCallback(self, callback, answers, "transcriptPDF", subtitlesPrompt);
        })
        .then((answers) => {
            // Build Final Output
            return promiseCallback(self, callback, answers, "subtitles", buildFinalOutput);
        })
        .then((tocElements) => {
            var result = "";
            var xmlString = "";
            for (var i = 0; i < tocElements.length; i++) {
                xmlString = utils.xmlOps.objectToXMLString(tocElements[i].toObjectLiteral());
                result += `${xmlString}\n\n`;
            }    
            try {
                result = utils.cleanHTML.cleanEntities(result);
                utils.cliTools.writeOutputFile(outputFile, result);
                callback();                                     
            } catch (error) {
                self.log(error);
                callback(); 
            }   
        }) 
        .catch((err) => {
            self.log(err);
        });
    });
};

// vorpal.on('client_prompt_submit', function (command){
//     if (command === "properties") {
//         self.log(newComponents);
//         callback();
//     } 
// });