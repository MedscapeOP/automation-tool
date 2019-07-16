// ------------------------------------------------------------
// COMMAND FOR COMBINING SNIPPET SUB-COMMANDS   
// ------------------------------------------------------------


// REQUIRES
// ------------------------------------------------------------
const utils = require('../utils');
const snippets = require('../snippets');
const cliTools = utils.cliTools;
const N = cliTools.N;


// VARS
// ------------------------------------------------------------
const snippetChooserHelp = `This command allows you to run a combination of snippet commands at once.`;

let commandChoices = ["in-language", "certificate-links", "certificate-links", "downloadable-slides"]; 

let infoObject = {
    articleID: null,
    activityID: null,
    commandStringArray: null,
    callback: null 
};

// PROMPTS 
// ------------------------------------------------------------
let commandsPrompt = function (self) {
    return self.prompt({
        type: 'checkbox',
        name: 'commands',
        choices: commandChoices,
        message: `Please choose which snippet commands to run.`,
        validate: function (answer) {
            if (answer.length < 1) {
                return ('You must choose at least 1 command');
            } else {
                return true;
            }
        }                    
    });
};

const promiseSerial = funcs =>
  funcs.reduce((promise, func) =>
    promise.then(result =>
      func().then(Array.prototype.concat.bind(result))),
      Promise.resolve([]))

// BUILD PROMISE ALL ARRAY
// ------------------------------------------------------------
let callCommands = async function (vorpal, commands, fn) {
    // return vorpal.exec(commands[commands.length - 1]).then(() => {
    //     vorpal.exec(commands[commands.length - 2]);
    // });
    console.log("CALL COMMANDS: ");
    var promises = [];
    for (const command of commands) {
        promises.push(
            function () {
                return vorpal.exec(command);
            }
        );
    }
    return promiseSerial(promises);
}

let buildCommandArray = function (vorpal, callback, answers, articleID, fn) {
    var commands = answers.commands;
    var result = [];
    commands.forEach((command) => {
        result.push(`snippet ${command} ${articleID}`);
    });
    return result; 
}

// EXPORT
// ------------------------------------------------------------
module.exports = function (vorpal) {
    let chalk = vorpal.chalk;    
    vorpal
    .command('snippet chooser <articleID>', snippetChooserHelp)
    // .parse(function (command, args) { 
    //     args.articleID = String(args.articleID);
    //     return command + ` ` + args.articleID;   
    // })
    .types({string: ['_']})
    .action(function(args, callback) {
        // this.log("RAW ARTICLE ID: ", args.articleID);
        var articleID = args.articleID;        
        let self = this;
        var result = null;
        commandsPrompt(self)
        .then((answers) => {
            if (answers) {                
                infoObject.commandStringArray = buildCommandArray(vorpal, callback, answers, articleID, buildCommandArray);
                infoObject.callback = callback;
                callback();
                vorpal.emit("start_commands");
            } else {
                self.log('Not getting answer for activity ID');
                callback();
            }
        })
    });
    vorpal.on('start_commands', function (){
        console.log("HERE: ");
        callCommands(vorpal, infoObject.commandStringArray, callCommands);
    });
};


/*
****** NEW IDEA: 7/16/19 ******  
var choices = {
    downloadableSlides: function () {
        return (series of prompts) 
    },
    certificateLinks: function () {
        return (series of prompts) 
    }
} 

var choiceOptionArray = choices.keys(); 

mainPrompt(self)
.then((answers) => {
    answers.options.forEach((option) => {
        infoObject.choiceFunctions.push(infoObject.choices[option]);
    });
    return optionCallback(infoObject)
})

function optionCallback(infoObject) {
    for (var i = 0; i < infoObject.choiceFunctions)
}

*/