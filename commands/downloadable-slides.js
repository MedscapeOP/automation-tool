// ------------------------------------------------------------
// COMMAND FOR DOWNLOADABLE SLIDES SNIPPET 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const utils = require('../utils');
const snippets = require('../snippets');
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const dlSlidesHelp = `
Generates HTML snippet for downloadable slides.`;

let outputFile = function () {
    return `${infoObject.articleID}/downloadable-slides.html`; 
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
    .command('snippet downloadable-slides <articleID>', dlSlidesHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;
        var result = snippets.downloadableSlides(args.articleID);  
        try {
            var completionMessage = `Downloadable slides snippet created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
            result = utils.cleanHTML.cleanEntities(result);
            utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
            callback();                                     
        } catch (error) {
            self.log(error.message);
            callback(); 
        }   
    });
};