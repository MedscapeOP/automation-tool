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
    - Clinical Implications
*/
var fs = require('fs');
var _ = require("lodash");
var utils = require("./utils2");

var prodTicket = fs.readFileSync(__dirname + '/article.html', 'utf8');

/* STUDY SYNOPSIS AND PERSPECTIVE  
-------------------------------------- */
function getSynopsisAndPerspective(ticket) {
    var startIndex = ticket.indexOf("<strong>Study Synopsis and Perspective</strong>");
    var endIndex = ticket.indexOf("<strong>Study Highlights");
    // xml2js needs 1 root node 
    // To handle this wrapper is used around the main result string. 
    var mainBlock = "<wrapper><p>" + ticket.substring(startIndex, endIndex - 3) + "</wrapper>";
    return utils.xmlStringToJS(mainBlock);
}



/* CLINICAL CONTEXT 
-------------------------------------- */
function getClinicalContext(ticket) {
    // ticket.replace(/<\Sp>\\n.*<\Sli>/g, "</li>\\n</ul>");
    // ticket.replace(/<\Sp>\\n.*<p><tt>o\t<\Stt>/g, "</li><li>");
    // ticket.replace(/<p><tt>o\t<\Stt>/g,"<ul><li>");
    // ticket.replace(/<S+>&nbsp;<\S\S+>/g,"");
    var startIndex = ticket.indexOf("<strong>Clinical Context</strong>");
    var endIndex = ticket.indexOf("<strong>Study Synopsis");
    var mainBlock = ticket.substring(startIndex, endIndex);
    mainBlock = "<wrapper>" + utils.cleanHTML(mainBlock) + "</p></wrapper>";
    // mainBlock = _.split(utils.cleanHTML(mainBlock).replace("Clinical Context", ""), /\n/);
    // _.remove(mainBlock, function (n) {
    //     if (n.length > 10) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // });
    return mainBlock;
    // return utils.xmlStringToJS(mainBlock); 
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


var clinicalContextArray = getClinicalContext(prodTicket);
var synopsisAndPerspective = getSynopsisAndPerspective(prodTicket);

console.log(clinicalContextArray);

// fs.writeFileSync(__dirname + '/article2.json', JSON.stringify((clinicalContextArray)));

// fs.writeFileSync(__dirname + '/article2.html', synopsisAndPerspective);

// console.log(synopsisAndPerspective);
// utils.writeXMLFromObject(synopsisAndPerspective, __dirname + "/article2.xml");