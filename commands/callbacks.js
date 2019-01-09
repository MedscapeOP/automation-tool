const stringOps = require('../utils').stringOps;

// PROMISE THEN CALLBACK 
// ------------------------------------------------------------
function promiseCallback(self, callback, program, answers, nameOfPrompt, nextFunction) {
    if (answers) {
        if (answers[nameOfPrompt]) {
            program[nameOfPrompt] = answers[nameOfPrompt];
        } 
        if (nextFunction) {
            return nextFunction(self);                                         
        } else {
            callback();
        }                
    } else {
        self.log(`Not getting answers for ${nameOfPrompt}`);
        callback();
    } 
} 

function delimitedAnswerCallback(self, callback, program, answers, nameOfPrompt, nextFunction, delimiter=",") {
    if (answers) {
        if (answers[nameOfPrompt]) {
            if (answers[nameOfPrompt].indexOf(delimiter) != -1) {
                program[nameOfPrompt] = answers[nameOfPrompt].split(delimiter);
            } else {
                program[nameOfPrompt] = answers[nameOfPrompt];
            }
            // program[nameOfPrompt] = answers[nameOfPrompt].split(delimiter);
            // self.log(answers[nameOfPrompt]);
        } 
        if (nextFunction) {
            return nextFunction(self); 
        } else {
            callback();
        }                
    } else {
        self.log(`Not getting answers for ${nameOfPrompt}`);
        callback();
    } 
} 


module.exports = {
    promiseCallback,
    delimitedAnswerCallback
}