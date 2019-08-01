// ------------------------------------------------------------
// COMMAND FOR GENERATING SLIDES TRANSCRIPT XML 
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
// const {TOCElement, SectionElement, SubsectionElement, SlideGroup, SlideComponent, ContributorGroup, ContributorElement} = require("../../classes");


// VARS
// ------------------------------------------------------------
const slidesTranscriptHelp = `
Generates XML code for Slides Transcript from R2Net html file. Input directory: /<articleType>/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/${program.dirName}/article.html`;
}

let outputFile = function () {
    return `${program.articleID}/${program.articleID}_slides.xml`
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
    var slideComponents = null;
    var slidesTOCs = null;
    var transcriptXML = null; 

    // GET SLIDES FROM PRODTICKET  
    slideComponents = prodticket.getSlides(ticket, program);


    // SET TRANSCRIPT TO NULL IF THE RESULT RETURNED WAS AN ERROR 
    if (slideComponents instanceof Error) {
        throw slideComponents;
    } else {
        // If no transcriptXML --> then we ran brief or test and teach functions.
        if (
            program.codeName == "spotlight" ||
            program.codeName == "curbside" ||
            program.codeName == "video" 
        ) {
            slidesTOCs = articles.spotlight.getSlidesTOC(slideComponents, program);
            transcriptXML = utils.xmlOps.objectToXMLString(slidesTOCs.toObjectLiteral());
        } else if (program.codeName == "firstResponse") {
            var components = prodticket.getComponents(ticket, program);
            if (components instanceof Error) {
                throw components;
            }
            slidesTOCs = articles.firstResponse.getSlidesTOCs(slideComponents, program, components);
            for (var i = 0; i < slidesTOCs.length; i++) {
                transcriptXML += utils.xmlOps.objectToXMLString(slidesTOCs[i].toObjectLiteral()) + "\n\n\n";
            }
        } else if (program.codeName == "townHall") {
            slidesTOCs = articles.townHallEnduring.getSlidesTOC(slideComponents, program).slidesTOC;
            transcriptXML = utils.xmlOps.objectToXMLString(slidesTOCs.toObjectLiteral());
        } else {
            transcriptXML = "";
        }
    }
    return transcriptXML;
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('component slides-transcript <articleID>', slidesTranscriptHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;

        prompts.productTypePrompt(self, _.pull(_.keys(programOptions), 'Clinical Brief', 'Test and Teach'))
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
                var completionMessage = `Slides Transcript XML created successfully! Check your output folder for the file: ${outputFile()}`;
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