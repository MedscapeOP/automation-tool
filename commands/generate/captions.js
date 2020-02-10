// ------------------------------------------------------------
// COMMAND FOR IN-LANGUAGE CAPTIONS (XML, VTT)  
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');

const utils = require('../../utils');
const snippets = require('../../snippets');
const languages = require('../../config').languages;
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const captionsHelp = `
Generates .vtt and .xml files for in language captions.`;

const languageChoices = _.keys(languages);

let inputFile = function () {
    return cliTools.getInputDirectory() + '/captions/sheet001.htm';
};

let outputFiles = function () {
    return {
        xmlFileDirectory: `${infoObject.articleID}/captions/${infoObject.xmlFileName}`,
        vttFileDirectory: `${infoObject.articleID}/captions/${infoObject.vttFileName}`,
        outputFolder: `${infoObject.articleID}/captions`
    };
}; 


let infoObject = {
    articleID: null,
    vttFileName: null,
    xmlFileName: null,
    languageString: null
};

// PROMPTS 
// ------------------------------------------------------------
let languagePrompt = function (self) {
    return self.prompt({
        type: 'list',
        name: 'language',
        choices: languageChoices,
        message: `Please choose which language.`,
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
    let rawHTML = cliTools.readInputFile(inputFile());
    let languageObject = null;
    languageObject = languages[infoObject.languageString];
    let vttResult = snippets.captions.buildVttFile(rawHTML, infoObject.articleID, languageObject);
    let xmlResult = snippets.captions.buildXmlFile(rawHTML, infoObject.articleID, languageObject)
    infoObject.vttFileName = vttResult.fileName;
    infoObject.xmlFileName = xmlResult.fileName;
    return {
        xmlResult,
        vttResult
    }
}



// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate captions <articleID>', captionsHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;

        if (typeof callback != 'function') {
            callback = function () {
                return;
            }
        }

        // Get TITLE
        languagePrompt(self)
        .then(answers => {           
            // Get Has Expert Commentary?
            if (answers) {
                infoObject.languageString = answers.language
                return buildFinalOutput(self);
            } else {
                self.log('Not getting answer for language');
                callback();
            }  
        })
        .then((buildResult) => {
            let xmlResult = buildResult.xmlResult.cleanedString;
            let vttResult = buildResult.vttResult.cleanedString;
            try {
                var completionMessageXML = `In language XML captions created successfully! Check your output folder for the files: ${outputFiles().xmlFileDirectory}`;
                var completionMessageVTT = `In language VTT captions created successfully! Check your output folder for the files: ${outputFiles().vttFileDirectory}`;

                xmlResult = utils.cleanHTML.cleanEntities(xmlResult);
                vttResult = utils.cleanHTML.cleanEntities(vttResult);

                utils.cliTools.writeOutputFile(outputFiles().xmlFileDirectory, xmlResult, self, completionMessageXML, callback);

                utils.cliTools.writeOutputFile(outputFiles().vttFileDirectory, vttResult, self, completionMessageVTT, callback);

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