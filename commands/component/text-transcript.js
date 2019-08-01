// ------------------------------------------------------------
// COMMAND FOR GENERATING TEXT TRANSCRIPT XML (SIDEBAR TOC) 
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
const {TOCElement, SectionElement, SubsectionElement, SlideGroup, SlideComponent, ContributorGroup, ContributorElement} = require("../../classes");


// VARS
// ------------------------------------------------------------
const textTranscriptHelp = `
Generates XML code for Sidebar Transcript from R2Net html file. Input directory: /<articleType>/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + `/${program.dirName}/article.html`;
}

let outputFile = function () {
    return `${program.articleID}/${program.articleID}_transcript.xml`
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
    var transcriptHTML = null;
    var transcriptXML = null; 

    // GET TRANSCRIPT FROM PRODTICKET BASED ON TRASCRIPT TYPE 
    if (program.codeName == "brief") {
        var mainTOCInstance = new TOCElement();
        // CLINICAL CONTEXT  
        var clinicalContext = articles.clinicalBrief.getClinicalContext(ticket);
        // SYNOPSIS AND PERSPECTIVE 
        var synopsisAndPerspective = articles.clinicalBrief.getSynopsisAndPerspective(ticket);
        // STUDY HIGHLIGHTS 
        var studyHighlights = articles.clinicalBrief.getStudyHighlights(ticket);
        // CLINICAL IMPLICATIONS 
        var clinicalImplications = articles.clinicalBrief.getClinicalImplications(ticket);
        ;
        mainTOCInstance.insertSectionElement(clinicalContext);
        mainTOCInstance.insertSectionElement(synopsisAndPerspective);
        mainTOCInstance.insertSectionElement(studyHighlights);
        mainTOCInstance.insertSectionElement(clinicalImplications);
        transcriptXML = utils.xmlOps.objectToXMLString(mainTOCInstance.toObjectLiteral());
    } else if (program.codeName == "testAndTeach") {
        var mainContentTOCs = articles.testAndTeach.getMainContent(ticket, program);
        var resultXML = "";
        for (var i = 0; i < mainContentTOCs.mainTOCs.length; i++) {
            resultXML += utils.xmlOps.objectToXMLString(mainContentTOCs.mainTOCs[i].toObjectLiteral()) + "\n\n\n";
        }
        transcriptXML = resultXML;
    } else {
        transcriptHTML = prodticket.getArticleContent(ticket, program);
    }


    // SET TRANSCRIPT TO NULL IF THE RESULT RETURNED WAS AN ERROR 
    if (transcriptHTML instanceof Error) {
        throw transcriptHTML;
    } else if (!transcriptXML) {
        // If no transcriptXML --> then we ran brief or test and teach functions.
        if (
            program.codeName == "spotlight" ||
            program.codeName == "curbside" ||
            program.codeName == "video" 
        ) {
            transcriptXML = utils.xmlOps.objectToXMLString(articles.spotlight.getTranscriptTOC(transcriptHTML, program).toObjectLiteral());
        } else if (program.codeName == "firstResponse") {
            transcriptXML = utils.xmlOps.objectToXMLString(articles.firstResponse.getTranscriptTOC(transcriptHTML, program).toObjectLiteral());
        } else if (program.codeName == "townHall") {
            transcriptXML = utils.xmlOps.objectToXMLString(articles.townHallEnduring.getTranscriptTOC(transcriptHTML, program).toObjectLiteral());
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
    .command('component text-transcript <articleID>', textTranscriptHelp)
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
                return buildFinalOutput(self);
            } else {
                self.log(`Not getting answers for productType`);
                callback();
            }        
        }).then((result) => {
            try {
                var completionMessage = `Transcript Sidebar XML created successfully! Check your output folder for the file: ${outputFile()}`;
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