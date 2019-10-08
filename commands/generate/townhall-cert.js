// ------------------------------------------------------------
// COMMAND FOR GENERATING TownHall Cert XML 
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
const townHallCertHelp = `
Generates TownHall Cert XML code from R2Net html file. Input directory: /townhall-cert/article.html`;


let inputFile = function () {
    return cliTools.getInputDirectory() + '/townhall-cert/article.html';
}

let outputFiles = function () {
    return {
        xmlFile: `${program.articleID}/${program.articleID}.xml`,
        checklist: `${program.articleID}/${program.articleID}_checklist.html`,
        activity: `${program.articleID}/${program.articleID}_activity.xml`
    };
};    

let program = config.programs.townHallCert;


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    var prodTicket = cliTools.readInputFile(inputFile());  
    return articles.townHallCert.buildTownHallCert(prodTicket, program);
}


// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('generate townhall cert <articleID>', townHallCertHelp)
    .types({string: ['_']})
    .action(function(args, callback) {       
        program.articleID = args.articleID;        
        let self = this;
        actions.townHallCertAction(vorpal, self, callback, chalk, program, buildFinalOutput, outputFiles);
    });
    vorpal.on('client_prompt_submit', function (program){
        cliTools.resetProgram(program);
    });
};
