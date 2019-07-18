// ------------------------------------------------------------
// COMMAND FOR GENERATING SPOTLIGHT XML 
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


// VARS
// ------------------------------------------------------------
const spotlightHelp = `
Generates Activity XML code from R2Net html file. Input directory: /<articleType>/article.html`;


let inputFile = function () {

    return cliTools.getInputDirectory() + '/spotlight/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}/${program.articleID}.xml`,
        checklist: `${program.articleID}/${program.articleID}_checklist.html`,
        activity: `${program.articleID}/${program.articleID}_activity.xml`
    };
};  

let programOptions = _.mapKeys(config.programs, function (value, key) {
    return value.name;
});

programOptions = _.mapValues(programOptions, function (o){
    return o.codeName;
});

// Make names be the keys --> Map keys 
// then set value of key to be codeName --> Map values

let program = config.propertiesChecklist;


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------
let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    var checklist = articles.propertiesChecklist.getChecklist(prodTicket, program);
    return articles.propertiesChecklist.buildChecklist(checklist, program);
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
        actions.basicArticleAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles, config.transcriptTypes);
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