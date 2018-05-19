var fs = require('fs');
var xml2js = require('xml2js');
var builder = new xml2js.Builder();
var parser = new xml2js.Parser();
var parseString = xml2js.parseString;


function cleanHTML(string) {
    // Case for empty formatting tags 
    var str = string.replace(/\(Insert.*\)/, "").replace(/<{1}[^<>]{1,}>{1}/g," ");
    return str; 
}

function parseXMLString(xmlString){
    var options = {};
    return new Promise(function(resolve, reject){
        parseString(xmlString, options, function (err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function parseXMLFile(pathToFile) {
    return new Promise(function(resolve, reject){
        fs.readFile(pathToFile, function(err, data) {
            if (err) {
                reject(err);
            } else {
                parser.parseString(data, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }                    
                });
            }
        });
    });
}

function writeXMLFromObject(object, pathToFile) {
    var newXmlFile = builder.buildObject(object);
    fs.writeFile(pathToFile, newXmlFile, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The new file was created!");
    }); 
} 

async function getJSONFromXMLString(xml){
    const result = await parseXMLString(xml);
    return result;
}

async function getJSONFromXMLFile(pathToFile){
    const result = await parseXMLFile(pathToFile);
    return result; 
}


module.exports = {
    getJSONFromXMLFile,
    getJSONFromXMLString,
    writeXMLFromObject,
    cleanHTML
};