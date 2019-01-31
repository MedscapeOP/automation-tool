const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../commands');
const {SubsectionElement} = app.classes;
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
    var completeFirstResponseLLA;
    var completeSlidesTOCs;

    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/first-response/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeFirstResponse = fs.readFileSync(__dirname + '/input/first-response/first-response.xml').toString();

        completeFirstResponseLLA = fs.readFileSync(__dirname + '/input/first-response/first-response-lla.xml').toString();
        
        completeSlidesTOCs = fs.readFileSync(__dirname + '/input/first-response/slides-fr.xml').toString();

        program = app.config.programs.firstResponse;

    });
    
    describe('#getSlidesTOCs()', function () {
        it('should return slides TOC', function (done) {
            program.hasLLA = false;

            var checklist = new app.classes.FirstResponseChecklist();
            checklist.slides.result = app.prodTicket.getSlides(prodTicket, program);
            var checklistResult = checklist.print();

            var slideTOCs= firstResponse.getSlidesTOCs(checklistResult.properties.slides.result, program);
            var result = "";
            var currentTOC = null;

            for (var i = 0; i < slideTOCs.length; i++) {
                currentTOC = slideTOCs[i].toObjectLiteral();
                // console.log(`CURRENT TOC: ${i + 1}`, slideTOCs[i] instanceof app.classes.TOCElement);

                // console.log(`CURRENT TOC: ${i + 1}`, JSON.stringify(currentTOC, undefined, 2));
                currentTOC = utils.xmlOps.objectToXMLString(currentTOC);
                currentTOC = utils.cleanHTML.cleanEntities(currentTOC);
                result += "\n" + currentTOC; 
                // result += "\n\n" + slideTOCs[i].rawSlides;
                // console.log("SLIDE TOC HTML: ", slideTOCs[i] + "\n\n\n");
            }

            fs.writeFileSync(__dirname + '/output/first-response/fr-slides.xml', result);
            
            expect(result).to.equalIgnoreSpaces(completeSlidesTOCs);
            done();
        });
    });

    describe('#getLLAPreTOC()', function () {
        it('should return LLA Pre TOC with program goal statement', function () {
            // Uses same function as spotlight see that test suite 
        });
    });

    describe('#buildFirstResponse()', function () {
        it('should return complete XML string of First Response article', function (done) {
            this.timeout(5000);
            program.hasCollectionPage = false;
            program.hasPeerReviewer = true;
            program.hasForYourPatient = false;
            program.hasLLA = false;
            // program.articleID = "897160";

            var result = firstResponse.buildFirstResponse(prodTicket, program).finishedArticleObject.toObjectLiteral();

            // console.log("RESULT: ", JSON.stringify(result, undefined, 2));

            var differences = [                
            ];

            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            // result = utils.xmlOps.objectToXMLString(result);

            // fs.writeFileSync(__dirname + '/output/first-response/finished-fr.xml', result);

            // console.log("RESULT: ", result);
            // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

            // expect(result).to.equalIgnoreSpaces(completeFirstResponse)
            done();
        });

        it('should return complete XML string of First Response article - with LLA', function (done) {
            this.timeout(5000);
            program.hasCollectionPage = false;
            program.hasPeerReviewer = true;
            // Tested and working with For your patient
            program.hasForYourPatient = false;
            program.hasLLA = true;
            // program.articleID = "897160";

            var result = firstResponse.buildFirstResponse(prodTicket, program).finishedArticleObject.toObjectLiteral();

            // console.log("RESULT: ", JSON.stringify(result, undefined, 2));

            var differences = [                
            ];

            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            // result = utils.xmlOps.objectToXMLString(result);

            fs.writeFileSync(__dirname + '/output/first-response/finished-fr.xml', result);

            // console.log("RESULT: ", result);
            // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

            // expect(result).to.equalIgnoreSpaces(completeFirstResponseLLA);
            done();
        });
    });
});

