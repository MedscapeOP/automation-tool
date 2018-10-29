// ------------------------------------------------------------
// COMMAND FOR IN-LANGUAGE ADDONS  
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const utils = require('../utils');
const prodticket = require('../prodticket');
const snippets = require('../snippets');
let languages = require('../config').languages;
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const inLanguageHelp = `
Generates code for in language add-ons. ${N}Use flags for components you wish to include.`;

const languageChoices = _.keys(languages);


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('il <articleID>', inLanguageHelp)
    .option('--ec')
    .option('--pdf')
    .option('--tpdf')
    .option('--sub')
    .action(function(args, callback) {
        let message = `Please choose which languages.`;
        let self = this;
        self.log(args.stdin[0]);
        // args.options.template --> option flag value (true/false)
        // args.stdin[0] --> input from the user         
        self.prompt({
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
            if (answers) {
                try {                                         
                    // vorpal.emit('client_prompt_submit', 'properties');
                    self.log(answers);
                    callback();                                     
                } catch (error) {
                    self.log(error);
                    callback(); 
                }                                
            } else {
                self.log('Not getting answers');
                callback();
            }                            
        });
    });
};

// vorpal.on('client_prompt_submit', function (command){
//     if (command === "properties") {
//         self.log(newComponents);
//         callback();
//     } 
// });