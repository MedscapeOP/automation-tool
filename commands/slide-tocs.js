// ------------------------------------------------------------
// COMMAND FOR IN-LANGUAGE ADDONS  
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const _ = require('lodash');

const articleUtils = require('../articles').articleUtils;
const utils = require('../utils');
const {TOCElement, SectionElement, SubsectionElement, SlideGroup, SlideComponent} = require("../classes");
const callbacks = require('./callbacks');
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const slideTocsHelp = `
Generates XML for TOC elements with empty slide groups. ${N}Similar output as slide lecture Notetab clip`;


let infoObject = {
    articleID: null,
    isMultiComponent: false,
    numberOfComponents: null,
    slideCount: null
};

let outputFile = function () {
    return `${infoObject.articleID}/slide-tocs.xml`; 
}; 

// PROMPTS 
// ------------------------------------------------------------
let multiComponentPrompt = function (self) {
    return self.prompt({
        type: 'confirm',
        name: 'isMultiComponent',
        message: 'Is this a multi-component program?'                  
    });
};

let numberOfComponentsPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'numberOfComponents',
        message: 'Please Enter the Number of components: ',
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must enter the number of components!');
            } else if (parseFloat(Number.isNaN(answer))) {
                return ('You must enter an integer!');
            } else {
                return true;
            }
        }                    
    });
};

let slideCountPrompt = function (self) {
    return self.prompt({
        type: 'input',
        name: 'slideCount',
        message: 'Please Enter the Number of Slides: ',
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must enter the number of slides!');
            } else if (parseFloat(Number.isNaN(answer))) {
                return ('You must enter an integer!');
            } else {
                return true;
            }
        }                    
    });
};

let slideCountPromptMulti = function (self) {
    return self.prompt({
        type: 'input',
        name: 'slideCount',
        message: 'Please enter the number of slides for each component (separate by commas):',
        validate: function (answer) {
            if (answer.indexOf(",") == -1) {
                return ('Integers should be separated by commas!');
            } else if (answer.split(",").length != infoObject.numberOfComponents) {
                return (`You must enter ${infoObject.numberOfComponents} integers!`);
            } else {
                return true;
            }
        }    
    });
};

// BUILD FUNCTION LOGIC 
// ------------------------------------------------------------

let buildFinalOutput = function (self) {
    // For each component 
        // BUILD: slidesTOC Element
        // BUILD: section 
        // BUILD: subsection 
        // BUILD: slideComponent
            // For numberOfSlides in slideComponent
                // BUILD: SlideGroup 
                    // -> Use slideComponent.slidePath
                    // -> Use i + 1 for SlideNumber
                // subsection.insertSlideGroup 
        // slidesTOC.insertSection 
        // section.insertSubsection 
        // push TOC onto tocArray
    // return tocArray 
    // console.log("INFO: ", infoObject);
    let tocArray = []; 
    let componentCount = infoObject.numberOfComponents;

    if (typeof infoObject.slideCount == 'string') {
        infoObject.slideCount = [parseInt(infoObject.slideCount)];
    }

    let slidesTOC = null; 
    let slidesSection = null;
    let slidesSubsection = null;
    let slideComponent = null; 
    let slideGroup = null; 
    
    for (var i = 0; i < componentCount; i++) {
        slidesTOC = new TOCElement();
        slidesSection = new SectionElement(); 
        slidesSubsection = new SubsectionElement(true, false, false);
        slideComponent = new SlideComponent(infoObject.articleID, (componentCount == 1 ? null: i + 1), '', infoObject.slideCount[i]).toObjectLiteral();
        for (var s = 0; s < slideComponent.numberOfSlides; s++) {
            slideGroup = new SlideGroup(slideComponent.slidePath, s + 1);
            slidesSubsection.insertSlideGroup(slideGroup);
        }
        slidesTOC.insertSectionElement(slidesSection);
        slidesSection.insertSubsectionElement(slidesSubsection);
        tocArray.push(slidesTOC);
    }
    return tocArray;
}



// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('snippet slide-tocs <articleID>', slideTocsHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        infoObject.articleID = args.articleID;        
        let self = this;

        if (typeof callback != 'function') {
            callback = function () {
                return;
            }
        }

        // Get TITLE
        multiComponentPrompt(self)
        .then(answers => {           
            if (answers) {
                infoObject["isMultiComponent"] = answers.isMultiComponent;
                if (!answers.isMultiComponent) {
                    infoObject.numberOfComponents = 1;
                    return slideCountPrompt(self);
                } else {
                    return numberOfComponentsPrompt(self).then((answers) => {
                        if (answers) {
                            infoObject.numberOfComponents = answers.numberOfComponents;
                            return slideCountPromptMulti(self);
                        } else {
                            self.log(`Not getting answers for numberOfComponents`);
                            callback();                            
                        }
                    });
                }         
            } else {
                self.log(`Not getting answers for isMultiComponent`);
                callback();
            } 
        })
        .then((answers) => {
            // Build Final Output
            return callbacks.delimitedAnswerCallback(self, callback, infoObject, answers, "slideCount", buildFinalOutput);
        })
        .then((tocElements) => {
            // self.log("INFO: ", infoObject);
            var result = "";
            var xmlString = "";
            for (var i = 0; i < tocElements.length; i++) {
                xmlString = utils.xmlOps.objectToXMLString(tocElements[i].toObjectLiteral());
                result += `${xmlString}\n\n`;
            }    
            try {
                var completionMessage = `Slide TOC elements created successfully! Check your output folder for the file: ${outputFile()}`;
                result = utils.cleanHTML.cleanEntities(result);
                utils.cliTools.writeOutputFile(outputFile(), result, self, completionMessage, callback);
                callback();                                     
            } catch (error) {
                self.log(error.message);
                callback(); 
            }   
        }) 
        .catch((err) => {
            self.log(err);
        });
    });
};