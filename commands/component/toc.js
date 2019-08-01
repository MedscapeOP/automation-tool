// ------------------------------------------------------------
// COMMAND FOR GENERATING MULTICOMPONENT TABLE OF CONTENTS XML 
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
const tocHelp = `
Generates Multicomponent TOC XML code from R2Net html file. Input directory: /<articleType>/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/${program.dirName}/article.html`;
}

let outputFile = function () {
    return `${program.articleID}/${program.articleID}_toc.xml`
};  

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
    var tocXML = null;
    var components = null; 

    components = prodticket.getComponents(ticket, program);

    if (components instanceof Error) {
        throw components;
    } else if (!components) {
        throw new Error("Something went wrong when searching for components!");
    } else {
        tocXML = utils.xmlOps.objectToXMLString(articles.articleUtils.buildTableOfContentsTOC(components, program).toObjectLiteral());
    }
    return tocXML;
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('component table-of-contents <articleID>', tocHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;

        prompts.productTypePrompt(self, [config.programs.firstResponse.name])
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
                return buildFinalOutput(self);
            } else {
                self.log(`Not getting answers for productType`);
                callback();
            }        
        }).then((result) => {
            try {
                var completionMessage = `Table of Contents XML created successfully! Check your output folder for the file: ${outputFile()}`;
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