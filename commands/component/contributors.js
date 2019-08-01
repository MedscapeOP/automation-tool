// ------------------------------------------------------------
// COMMAND FOR GENERATING CONTRIBUTOR XML 
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
let prompts = require('../prompts');
let config = require('../../config');


// VARS
// ------------------------------------------------------------
const contributorsHelp = `
Generates XML code for contributors using the R2Net html file. Input directory: /<articleType>/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/${program.dirName}/article.html`;
}

let outputFile = function () {
    return `${program.articleID}/${program.articleID}_contributors.xml`
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
    let ticketHTML  = cliTools.readInputFile(inputFile()); 
    let contributorObjects = prodticket.getContributors(ticketHTML, program);
    let contributorGroups = null; 
    let contributorXML = ""; 
    if (contributorObjects instanceof Error) {
        throw contributorObjects;
    } else if (!contributorObjects) {
        throw new Error("Something went wrong when searching for contributors!");
    } else {
        contributorGroups = articles.articleUtils.buildContributorGroups(contributorObjects);
        for (var i = 0; i < contributorGroups.length; i++) {
            contributorXML += utils.xmlOps.objectToXMLString(contributorGroups[i].toObjectLiteral()) + "\n\n";
        }
        return contributorXML;
    }
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('component contributors', contributorsHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);      
        let self = this;
        prompts.productTypePrompt(self, _.keys(programOptions))
        .then((answers) => {
            if (answers) {
                var productType = answers.productType;                
                for (var key in config.programs) {
                    if (config.programs[key].name == productType) {
                        program = config.programs[key];
                    }
                }
                return buildFinalOutput(self);
            } else {
                self.log(`Not getting answers for productType`);
                callback();
            } 
        }).then((result) => {
            try {
                var completionMessage = `Contributor groups created successfully! Check your output folder for the file: ${outputFile()}`;
                result = utils.cleanHTML.cleanEntities(result);
                utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                callback();                                     
            } catch (error) {
                self.log(error.message);
                callback(); 
            }   
        }).catch((error) => {
            self.log(error);
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