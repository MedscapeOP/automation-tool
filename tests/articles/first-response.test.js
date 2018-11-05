const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../commands');
const utils = app.utils;
const firstResponse = app.articles.firstResponse;

describe('First Response', function () {
 
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
    var completeFirstResponse;
    var completeSlidesTOCs;

    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/first-response/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeFirstResponse = fs.readFileSync(__dirname + '/input/first-response/first-response.xml').toString();
        
        completeSlidesTOCs = fs.readFileSync(__dirname + '/input/first-response/slides-fr.xml').toString();

        program = app.config.programs.firstResponse;

    });
    
    describe('#getSlidesTOCs()', function () {
        it('should return slides TOC', function () {
            program.hasLLA = false;

            var slideTOCs= firstResponse.getSlidesTOCs(prodTicket, program);
            var result = "";
            var currentTOC = null;

            for (var i = 0; i < slideTOCs.length; i++) {
                // currentTOC = slideTOCs[i].toObjectLiteral();
                // currentTOC = utils.xmlOps.objectToXMLString(currentTOC);
                // // currentTOC = utils.cleanHTML.cleanEntities(currentTOC);
                // result += """\n" + currentTOC; 
                result += "\n\n" + slideTOCs[i].rawSlides;
            }

            result = app.articles.articleUtils.buildSlides(result);
            fs.writeFileSync(__dirname + '/output/first-response/fr-slides.xml', result);
            // expect(result).to.equalIgnoreSpaces(completeSlidesTOCs);
        });
    });

    describe('#getLLAPreTOC()', function () {
        it('should return LLA Pre TOC with program goal statement', function () {
            // Uses same function as spotlight see that test suite 
        });
    });

    describe('#buildFirstResponse()', function () {
        it('should return complete XML string of First Response article', function () {
            program.hasCollectionPage = false;
            program.hasPeerReviewer = true;
            program.hasForYourPatient = false;
            program.hasLLA = false;
            // program.articleID = "897160";

            var result = firstResponse.buildFirstResponse(prodTicket, program).toObjectLiteral();

            // console.log("RESULT: ", JSON.stringify(result, undefined, 2));

            var differences = [                
            ];

            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));

            // fs.writeFileSync(__dirname + '/output/spotlight/finished-sl.xml', result);

            // console.log("RESULT: ", result);
            // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

            // result = utils.xmlOps.objectToXMLString(result);
            // expect(result).to.equalIgnoreSpaces(completeFirstResponse)
        });
    });
});

