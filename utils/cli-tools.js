const fs = require('fs');
const path = require('path');

const N = "\n";

function BadInputException(message) {
    this.message = message;
    this.name = "Bad Input Exception";
}

function RandomException(message) {
    this.message = message;
    this.name = "Random Unforseen Exception";
}

function ProdticketException(message) {
    this.message = message;
    this.name = "Malformed Prodticket HTML"
}

function getOutputDirectory () {
    // process.cwd() returns the directory from which you ran Node process 
    var currentDir = process.cwd();
    return path.join(currentDir, 'output');
} 

function headlineTextFlag(headlineText) {
    headlineText = headlineText.toUpperCase();
    return `
// ------------------------------------------------------------
// ${headlineText}
// ------------------------------------------------------------
`;
}

function writeOutputFile(filename, data) {
    var pathToFile = path.join(getOutputDirectory(), filename);
    try {
        fs.writeFileSync(pathToFile, data);
    } catch (e) {
        // console.log(e);
        if (e.code == 'ENOENT') {
            throw new BadInputException(`No such directory exists: "${getOutputDirectory()}". ${N} Be sure to create an "output" folder in your current directory.`);
        } else {
            throw new RandomException(`Something went wrong writing to the output folder!`);
        }
    }   
};


module.exports = {
    N,
    headlineTextFlag,
    getOutputDirectory,
    writeOutputFile,
    BadInputException,
    RandomException,
    ProdticketException 
};
