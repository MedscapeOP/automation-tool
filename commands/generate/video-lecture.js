// ------------------------------------------------------------
// COMMAND FOR GENERATING VIDEO LECTURE XML 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');
const fs = require('fs-extra');

const utils = require('../../utils');
const articles = require('../../articles');
const cliTools = utils.cliTools;
const N = cliTools.N;
let config = require('../../config');
let actions = require('../actions');


// VARS
// ------------------------------------------------------------
const videoLectureHelp = `
Generates Video Lecture XML code from R2Net html file. Input directory: video-lecture/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/video-lecture/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}/${program.articleID}.xml`,
        checklist: `${program.articleID}/${program.articleID}_checklist.html`,
        activity: `${program.articleID}/${program.articleID}_activity.xml`
    };
};

let program = config.programs.videoLecture;





// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.spotlight.buildSpotlight(prodTicket, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate video-lecture <articleID>', videoLectureHelp)
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
