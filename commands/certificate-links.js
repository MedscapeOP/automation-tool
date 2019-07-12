// ------------------------------------------------------------
// COMMAND FOR ACTIVITY CERTIFICATE LINKS SNIPPET 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const utils = require('../utils');
const snippets = require('../snippets');
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const certificateLinksHelp = `
Generates snippet for activity certificate links.`;

let eligibilityChoices = ["loc", "cme", "nurse_ce", "pharma_ce"];

let outputFile = function () {
    return `${infoObject.articleID}/certificate-links-${infoObject.activityID}.html`; 
}; 

let infoObject = {
    articleID: null,
    activityID: null,
    eligibilities: [
        {type: 'loc', activityID: null, inActivity: false},
        {type: 'cme', activityID: null, inActivity: false},
        {type: 'nurse_ce', activityID: null, inActivity: false},
        {type: 'pharma_ce', activityID: null, inActivity: false}
    ]
};

// PROMPTS 
// ------------------------------------------------------------
let activityIDPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'activityID',
        message: 'Please Enter the Activity ID: ',
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must enter an Activity ID!');
            } else {
                return true;
            }
        }                    
    });
};

let eligibilitiesPrompt = function (self) {
    return self.prompt({
        type: 'checkbox',
        name: 'eligibilities',
        choices: eligibilityChoices,
        message: `Please choose which eligibilities.`,
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must choose at least 1 eligibility');
            } else {
                return true;
            }
        }                    
    });
};

// PROMISE THEN CALLBACK 
// ------------------------------------------------------------


// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------
let buildFinalOutput = function (self, answers) {
    // eligibilities   
    var eligibilitiesChosen = answers.eligibilities;
    for (var i = 0; i < infoObject.eligibilities.length; i++) {
        // console.log("ELIGIBILITIES CHOSEN: ", eligibilitiesChosen);
        if (eligibilitiesChosen.indexOf(infoObject.eligibilities[i].type) != -1) {
            infoObject.eligibilities[i].activityID = infoObject.activityID;
            infoObject.eligibilities[i].inActivity = true;
            // console.log("ELIGIBILITY: ", infoObject.eligibilities[i]);
        }
    }
    return snippets.customForm.certificateLinks(infoObject.eligibilities);
}

// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('snippet certificate-links <articleID>', certificateLinksHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        if (typeof callback != "function") {
            callback = () => {
                return null;
            };                                     
        } 
        infoObject.articleID = args.articleID;        
        let self = this;
        var result = null;
        activityIDPrompt(self)
        .then((answers) => {
            if (answers) {
                infoObject.activityID = answers.activityID;
                return eligibilitiesPrompt(self);
            } else {
                self.log('Not getting answer for activity ID');
                callback();
            }
        })
        .then((answers) => {
            if (answers) {
                result = buildFinalOutput(self, answers);
                try {
                    var completionMessage = `Activity certificates snippet created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
                    result = utils.cleanHTML.cleanEntities(result);
                    utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                    callback();                                     
                } catch (error) {
                    self.log(error.message);
                    callback(); 
                }   
            } else {
                self.log('Not getting answers for eligibilities');
                callback();
            }
        })
    });
};