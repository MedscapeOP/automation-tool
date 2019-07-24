// ------------------------------------------------------------
// COMMAND FOR MEDIA INFO CUSTOM FORM SNIPPET 
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const utils = require('../../utils');
const snippets = require('../../snippets');
const cliTools = utils.cliTools;
const N = cliTools.N;
const callbacks = require('../callbacks');


// VARS
// ------------------------------------------------------------
const mediaInfoHelp = `
Generates snippet for custom form media info.`;

// let eligibilityChoices = ["loc", "cme", "nurse_ce", "pharma_ce"];

let outputFile = function () {
    return `${infoObject.articleID}/media-info.html`; 
}; 

/*
Dynamic information for snippet 
- Video RSS link 
- article ID 
- Component numbers??
    - Ask if multi-component
    - then ask how many 
    - Use this to generate output snippets 
*/

let infoObject = {
    articleID: null,
    isMulticomponent: false, 
    componentCount: 1,
    rssLinks: [],
    components: []
};

// PROMPTS 
// ------------------------------------------------------------
let componentCountPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'componentCount',
        message: 'Enter the number of components: ',
        validate: function (answer) {
            if (parseFloat(Number.isNaN(answer))) {
                return ('You must enter an integer!');
            } else {
                return true;
            }
        }                    
    });
};

let multicomponentPrompt = function (self) { 
    return self.prompt({
        type: 'confirm',
        name: 'isMulticomponent',
        message: `Is the program multi-component?`
    }); 
};

let rssLinkPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'rssLinks',
        message: 'Enter Video RSS Link:'  
    });
};

let rssLinksPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'rssLinks',
        message: 'Enter Video RSS Link for each component (separate by commas):',
        validate: function (answer) {
            self.log("Component Count: ", infoObject.componentCount);
            if (answer.indexOf(",") == -1) {
                return ('RSS links should be separated by commas!');
            } else if (answer.split(",").length != infoObject.componentCount) {
                return ('Number of RSS links should equal component count!');
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
    var result = "";
    if (answers.rssLinks) {
        if (answers.rssLinks.indexOf(",") != -1) {
            infoObject.rssLinks = answers.rssLinks.split(",");
        } else {
            infoObject.rssLinks = answers.rssLinks;
        }
    }
    console.log("INFO: ", infoObject);
    if (infoObject.isMulticomponent) {
        for (var i = 1; i < infoObject.componentCount + 1; i++) {
            result += snippets.customForm.mediaInfo(infoObject.articleID, infoObject.rssLinks[i - 1], i) + "\n\n\n";
        }
    } else {
        result = snippets.customForm.mediaInfo(infoObject.articleID, infoObject.rssLinks);
    }
    return result; 
}

// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('snippet media-info <articleID>', mediaInfoHelp)
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
        multicomponentPrompt(self)
        .then((answers) => {
            if (answers) {
                infoObject.isMulticomponent = answers.isMulticomponent;
                // If is multiComponent run Component count prompt
                if (infoObject.isMulticomponent) {
                    return componentCountPrompt(self).then((answers) => {
                        if (answers) {
                            infoObject.componentCount = parseFloat(answers.componentCount);
                            return rssLinksPrompt(self);
                        } else {
                            self.log('Not getting answer for componentCount');
                            callback();
                        }
                    });
                } else {
                    return rssLinkPrompt(self);
                }
            } else {
                self.log('Not getting answer for isMulticomponent');
                callback();
            }
        })
        .then((answers) => {
            if (answers) {
                result = buildFinalOutput(self, answers);
                try {
                    var completionMessage = `Media-info snippet for custom form created successfully! Check your output folder for the file: ${chalk.cyan(outputFile())}`;
                    result = utils.cleanHTML.cleanEntities(result);
                    utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                    callback();                                     
                } catch (error) {
                    self.log(error.message);
                    callback(); 
                }           
            }
        })
    });
};