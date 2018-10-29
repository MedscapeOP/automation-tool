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

let outputFile = 'inLanguage.xml';

// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('il <articleID> <articleTitle>', inLanguageHelp)
    .option('--ec')
    .option('--pdf')
    .option('--tpdf')
    .option('--sub')
    .action(function(args, callback) {
        let articleID = args.articleID;
        let articleTitle = args.articleTitle;
        // this.log(args); WORKS 
        let inLanguageFunction; 
        let message = `Please choose which languages.`;
        let self = this;
        // self.log("Current Working Dir: ", cliTools.getOutputDirectory()); WORKS
        if (args.options.ec) {
            inLanguageFunction = snippets.inLanguage.expertCommentary;
        } else if (args.options.pdf) {
            inLanguageFunction = snippets.inLanguage.downloadablePDF;
        } else if (args.options.tpdf) {
            inLanguageFunction = snippets.inLanguage.transcriptPDF;
        } else {
            inLanguageFunction = snippets.inLanguage.subtitles;
        }
        var chosenLanguages = self.prompt({
            type: 'checkbox',
            name: 'languageChooser',
            choices: languageChoices,
            message: message,
            validate: function (answer) {
                if (answer.length < 1) {
                    return ('You must choose at least 1 language');
                } else {
                    return true;
                }
            }
        }, (answers) => {            
            // if (answers) {
            //     var xmlString = "";
            //     var result = "";
            //     var language = "";
            //     var tocElements = [];
            //     // self.log("FUNCTION: ", inLanguageFunction); WORKS 
            //     for (var i = 0; i < answers.length; i++) {
            //         language = languages[answers[i]];
            //         tocElements.push(inLanguageFunction(articleID, language, articleTitle));
            //     }
            //     self.log("LANGUAGE OBJECT: ", language);
            //     self.log("ANSWERS: ", answers);
            //     self.log(tocElements);
            //     for (var i = 0; i < tocElements.length; i++) {
            //         xmlString = utils.xmlOps.objectToXMLString(tocElements[i].toObjectLiteral());
            //         result += `${xmlString}\n\n`;
            //     } 
            //     callback();   
            //     // il 000000 test --ec    
            //     // try {                                                             
            //     //     utils.cliTools.writeOutputFile(outputFile, result);
            //     //     callback();                                     
            //     // } catch (error) {
            //     //     self.log(error);
            //     //     callback(); 
            //     // }                                
            // } 
            // else {
            //     self.log('Not getting answers');
            //     callback();
            // }      
            return answers;                      
        });
        self.log("LANGUAGES: ", chosenLanguages);
    });
};

// vorpal.on('client_prompt_submit', function (command){
//     if (command === "properties") {
//         self.log(newComponents);
//         callback();
//     } 
// });