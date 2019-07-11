// ------------------------------------------------------------
// COMMAND FOR IN-LANGUAGE ADDONS  
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');

const utils = require('../utils');
const prodticket = require('../prodticket');
const snippets = require('../snippets');
const languages = require('../config').languages;
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const inLanguageHelp = `
Generates code for in language add-ons. ${N}Use flags for components you wish to include.`;

const languageChoices = _.keys(languages);
let outputFile = function () {
    return `${infoObject.articleID}/in-language.xml`; 
}; 


let infoObject = {
    articleID: null,
    articleTitle: "",
    addons: {
        expertCommentary: {
            has: false,
            languages: []
        },
        downloadablePDF: {
            has: false, 
            languages: []
        },
        transcriptPDF: {
            has: false,
            languages: []
        },
        subtitles: {
            has: false, 
            languages: []
        }
    }
};

// PROMPTS 
// ------------------------------------------------------------
let articleTitlePrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'title',
        message: 'Please Enter the Article Title: ',
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must enter a title!');
            } else {
                return true;
            }
        }                    
    });
};

let expertCommentaryPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'expertCommentary',
        message: 'Has Expert Commentary?'                  
    });
};

let downloadablePDFPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'downloadablePDF',
        message: 'Has Downloadable PDF?'                  
    });
};

let transcriptPDFPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'transcriptPDF',
        message: 'Has Transcript PDF?'                  
    });
};

let subtitlesPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'subtitles',
        message: 'Has Subtitles?'                  
    });
};

let languagePrompt = function (self) {
    return self.prompt({
        type: 'checkbox',
        name: 'languages',
        choices: languageChoices,
        message: `Please choose which languages.`,
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must choose at least 1 language');
            } else {
                return true;
            }
        }                    
    });
};


// PROMISE THEN CALLBACK 
// ------------------------------------------------------------
let promiseCallback = async function (self, callback, answers, addOn, nextFunction) {
    if (answers) {
        // message = 'Please choose which addons you need!'
        infoObject.addons[addOn].has = answers[addOn];
        if (answers[addOn]) {
            // Get Languages 
            try {
                await languagePrompt(self)
                .then((answers) => {
                    if (answers) {
                        infoObject.addons[addOn].languages = answers.languages;
                    } else {
                        self.log(`Not getting answers for ${addOn} languages`);
                        callback();
                    }
                });
            } catch (err) {
                self.log(err);
                callback();
            }
        } 
        if (nextFunction) {
            return nextFunction(self);                                         
        } else {
            callback();
        }                
    } else {
        self.log(`Not getting answers for ${addOn}`);
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
    .command('component il <articleID>', inLanguageHelp)
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
                var completionMessage = `In language TOC elements created successfully! Check your output folder for the file: ${outputFile()}`;
                result = utils.cleanHTML.cleanEntities(result);
                utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                callback();                                     
            } catch (error) {
                self.log(error.message);
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