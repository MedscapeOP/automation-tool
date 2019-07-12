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

// let infoObject = {
//     articleID: null,
//     activityID: null,
//     eligibilities: [
//         {type: 'loc', activityID: null, inActivity: false},
//         {type: 'cme', activityID: null, inActivity: false},
//         {type: 'nurse_ce', activityID: null, inActivity: false},
//         {type: 'pharma_ce', activityID: null, inActivity: false}
//     ]
// };

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

// BUILD PROMISE ALL ARRAY
// ------------------------------------------------------------
// let callCommands = function (vorpal, self, commands, fn) {
//     return new Promise(function (resolve, reject) {
//         var command = null;
//         if (commands.length >= 1)  {
//             command = commands.pop();
//             console.log("COMMAND: ", command);
//             // vorpal.exec(command).then(function () {
//             //     return fn(vorpal, self, commands, callback, callCommands);    
//             // }).catch(function (error) {
//             //     self.log(`ERROR at ${command} COMMAND: `, error);
//             // });
//             vorpal.exec(command).then(function () {
//                 return fn(vorpal, self, commands, callCommands);
//             });
//         } else {
//             return resolve();
//         }
//     });
// }

let buildCommandArray = function (vorpal, callback, answers, articleID, fn) {
    // 
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
                buildCommandArray(vorpal, callback, answers, articleID, buildCommandArray).then(() => {
                    callback();
                });
            } else {
                self.log('Not getting answer for activity ID');
                callback();
            }
        })
    });
};