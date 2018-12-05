const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../commands');
const {SubsectionElement} = app.classes;
const utils = app.utils;
const townHallEnduring = app.articles.townHallEnduring;

describe('Town Hall', function () {
 
    /*
    QNA; ACTIVITY; CONTRIBUTORS; THUMBNAIL; - - NOT DOING 
    BACK MATTER; UPLOAD/LINK SLIDE DECK; - NOT DOING
    
    - Test in buildFirstResponse() Master function 
    TITLE
    CONTRIBUTOR PAGE INFO 
    BANNER
    (Slides && Pre/Post)
    BLANK RESULTS PAGE
    ABBREVIATIONS
    REFERENCES

    - Test in separate suites
    SLIDES 
    PRE/POST ASSESSMENT  
    
    */ 

    var program; 
    var prodTicket;
    var completeTownHallEnduring;
    var completeTownHallReg;

    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/town-hall/article-enduring.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeTownHallEnduring = fs.readFileSync(__dirname + '/input/town-hall/town-hall-enduring.xml').toString();

        completeTownHallReg = fs.readFileSync(__dirname + '/input/town-hall/town-hall-reg.jsp').toString();
        
        completeSlidesTOCs = fs.readFileSync(__dirname + '/input/first-response/slides-fr.xml').toString();

        program = app.config.programs.townHall;

    });

    describe('#buildTownHallEnduring()', function () {
        it('should return complete XML string of Town Hall Enduring article', function () {
            program.hasCollectionPage = false;
            program.hasPeerReviewer = false;
            program.hasForYourPatient = false;
            program.hasLLA = false;
            program.hasOUS = true; 
            // program.articleID = "902206";

            var result = townHallEnduring.buildTownHallEnduring(prodTicket, program).toObjectLiteral();

            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));

            fs.writeFileSync(__dirname + '/output/town-hall/finished-th.xml', result);

            // console.log("RESULT: ", result);
            // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

            expect(result).to.equalIgnoreSpaces(completeTownHallEnduring);
        });

        // it('should return complete XML string of First Response article - with LLA', function () {
        //     program.hasCollectionPage = false;
        //     program.hasPeerReviewer = true;
        //     // Tested and working with For your patient
        //     program.hasForYourPatient = false;
        //     program.hasLLA = true;
        //     // program.articleID = "897160";

        //     var result = firstResponse.buildFirstResponse(prodTicket, program).toObjectLiteral();

        //     // console.log("RESULT: ", JSON.stringify(result, undefined, 2));

        //     var differences = [                
        //     ];

        //     result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
        //     // result = utils.xmlOps.objectToXMLString(result);

        //     fs.writeFileSync(__dirname + '/output/first-response/finished-fr.xml', result);

        //     // console.log("RESULT: ", result);
        //     // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

        //     expect(result).to.equalIgnoreSpaces(completeTownHallReg);
        // });
    });
});

