/*
Main algorithm 
- read in string file of prodticket
    - write functions to grab each important piece of the ticket.
    
- Pieces to grab from the prod ticket
    - Clinical Context 
    - Synopsis and Perspective
    - Study Highlights
- Grabbing pieces of the prod ticket 
    - get starting index of chunk using indexOf()
    - get ending index 
    - get substrings using indeces 
    - clean the html 
    - wrap the html 
    - turn string into JS object 
    - Take JS object and turn into xml
    - Take xml and write to file. 
*/
var fs = require('fs');
var _ = require("lodash");
var utils = require("./utils2");

var prodTicket = fs.readFileSync(__dirname + '/article.html', 'utf8');

/* STUDY SYNOPSIS AND PERSPECTIVE  
-------------------------------------- */
function getSynopsisAndPerspective(ticket) {
    var startIndex = ticket.indexOf("Study Synopsis and Perspective");
    var endIndex = ticket.indexOf("Study Highlights");
    var mainBlock = ticket.substring(startIndex, endIndex);
    mainBlock = mainBlock.replace('Study Synopsis and Perspective','');
    mainBlock = "<subsec_content>" + utils.cleanHTML(mainBlock) + "</subsec_content>";
    // xml2js needs 1 root node 
    // To handle this, subsec_content is used around the main result string as wrapper.     
    return utils.xmlStringToJS(mainBlock);
}



/* CLINICAL CONTEXT 
-------------------------------------- */
function getClinicalContext(ticket) {
    // ticket.replace(/<\Sp>\\n.*<\Sli>/g, "</li>\\n</ul>");
    // ticket.replace(/<\Sp>\\n.*<p><tt>o\t<\Stt>/g, "</li><li>");
    // ticket.replace(/<p><tt>o\t<\Stt>/g,"<ul><li>");
    // ticket.replace(/<S+>&nbsp;<\S\S+>/g,"");
    var startIndex = ticket.indexOf("Clinical Context");
    var endIndex = ticket.indexOf("Study Synopsis");
    var mainBlock = ticket.substring(startIndex, endIndex);
    mainBlock = mainBlock.replace('Clinical Context','');
    mainBlock = "<subsec_content>" + utils.cleanHTML(mainBlock) + "</subsec_content>";
    return utils.xmlStringToJS(mainBlock); 
}

function buildClinicalContext(ccArray) {
    var element = [];
    var p;
    for (var i = 0; i < ccArray.length; i++) {
        p = {"p": [ccArray[i]]};
        element.push(p);
    }
    return element;
}


var clinicalContext = getClinicalContext(prodTicket);
var synopsisAndPerspective = getSynopsisAndPerspective(prodTicket);

// console.log(clinicalContext);

// fs.writeFileSync(__dirname + '/article2.json', JSON.stringify((clinicalContext)));

// fs.writeFileSync(__dirname + '/article2.html', clinicalContext);

// console.log(synopsisAndPerspective);
utils.writeXMLFromObject(clinicalContext, __dirname + "/article2.xml");