// ------------------------------------------------------------
// COMMAND FOR GENERATING ACTIVITY XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs');

const utils = require('../../utils');
const articles = require('../../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
const prodticket = require('../../prodticket');
let config = require('../../config');
let prompts = require('../prompts');
let callbacks = require('../callbacks');


// VARS
// ------------------------------------------------------------
const activityHelp = `
Generates Activity XML code from R2Net html file. Input directory: /<articleType>/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/${program.dirName}/article.html`;
}

let outputFile = function () {
    return `${program.articleID}/${program.articleID}_activity.xml`
};  

let programOptions = _.mapKeys(config.programs, function (value, key) {
    return value.name;
});

// console.log("PROGRAM OPTIONS 1: ", programOptions);

programOptions = _.mapValues(programOptions, function (o){
    return {codeName: o.codeName, dirName: o.dirName};
});

// console.log("PROGRAM OPTIONS 2: ", programOptions);

// Make names be the keys --> Map keys 
// then set value of key to be codeName and dirName--> Map values

let program = null;

let infoObject = {
    articleID: null
}

// PROMPTS 
// ------------------------------------------------------------



// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------
let buildFinalOutput = function (self) {
    var ticket = cliTools.readInputFile(inputFile());  

    var activityXML = "";

    if (program.codeName == "brief") {
        activityXML = articles.activity.buildActivityCB(ticket, program);
    } else {
        activityXML = articles.activity.buildActivity(ticket, program);
    }
    return activityXML;
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('component activity <articleID>', activityHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;

        prompts.productTypePrompt(self, _.keys(programOptions))
        .then((answers) => {
            // Has OUS?
            if (answers) {
                var productType = answers.productType;                
                for (var key in config.programs) {
                    if (config.programs[key].name == productType) {
                        program = config.programs[key];
                        program.articleID = infoObject.articleID;
                    }
                }
                return prompts.ousPrompt(self);
            } else {
                self.log(`Not getting answers for productType`);
                callback();
            }        
        }).then((answers) => {            
            return callbacks.promiseCallback(self, callback, program, answers, "hasOUS", buildFinalOutput);
        }).then((result) => {
            try {
                var completionMessage = `Activity XML file created successfully! Check your output folder for the file: ${outputFile()}`;
                result = utils.cleanHTML.cleanEntities(result);
                utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                callback();                                     
            } catch (error) {
                self.log(error.message);
                callback(); 
            }   
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