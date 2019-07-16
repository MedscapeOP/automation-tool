// ------------------------------------------------------------
// COMMAND FOR MISC PROVIDER STATEMENT SNIPPET 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const utils = require('../utils');
const snippets = require('../snippets');
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const miscProviderStatementHelp = `
Generates HTML snippet for "Misc Provider Statement" field. Comes with Interprofessional CE logo and Medscape logo.`;

let outputFile = function () {
    return `${infoObject.articleID}/misc-provider-statement.html`; 
}; 

let infoObject = {
    articleID: null
};

// PROMPTS 
// ------------------------------------------------------------


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('snippet misc-provider-statement <articleID>', miscProviderStatementHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;
        var result = snippets.activity.medscapeProviderStatement();  
        try {
            var completionMessage = `Misc Provider snippet created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
            result = utils.cleanHTML.cleanEntities(result);
            utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
            callback();                                     
        } catch (error) {
            self.log(error.message);
            callback(); 
        }   
    });
};