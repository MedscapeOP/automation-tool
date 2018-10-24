const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../app');
const utils = app.utils;
const spotlight = app.articles.spotlight;

describe('Spotlight', function () {
 
    /*
    QNA; ACTIVITY; CONTRIBUTORS; THUMBNAIL; - - NOT DOING 
    BACK MATTER; UPLOAD/LINK SLIDE DECK; - NOT DOING
    
    - Test in buildSpotlight() Master function 
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
    var completeSpotlight;
    var completeSlidesTOC;
    var completeSlidesTOCLLA;
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/spotlight/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeSpotlight = fs.readFileSync(__dirname + '/input/spotlight/spotlight.xml').toString();
        
        completeSlidesTOC = fs.readFileSync(__dirname + '/input/spotlight/slides-sl.xml').toString();

        completeSlidesTOCLLA = fs.readFileSync(__dirname + '/input/spotlight/slides-sl-lla.xml').toString();

        program = app.config.programs.spotlight;

    });
    
    describe('#getSlidesTOC()', function () {
        it('should return slides TOC', function () {
            program.hasLLA = false;

            var result = spotlight.getSlidesTOC(prodTicket, program).toObjectLiteral();

            result = utils.xmlOps.objectToXMLString(result);
            result = utils.cleanHTML.cleanEntities(result);

            expect(result).to.equalIgnoreSpaces(completeSlidesTOC)
        });

        it('should return slides TOC with Embed and Impact Challenge - if program.hasLLA', function () {
            program.hasLLA = true;

            var result = spotlight.getSlidesTOC(prodTicket, program).toObjectLiteral();
            
            result = utils.xmlOps.objectToXMLString(result);
            result = utils.cleanHTML.cleanEntities(result);
            
            expect(result).to.equalIgnoreSpaces(completeSlidesTOCLLA);
        });
    });

    describe('#buildSpotlight()', function () {
        it('should return complete XML string of Spotlight article', function () {
            // var result = spotlight.buildSpotlight(prodTicket, program).toObjectLiteral();

            // var differences = [                
            // ];

            // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

            // result = utils.xmlOps.objectToXMLString(result);
            // expect(result).to.equalIgnoreSpaces(completeSpotlight)
        });
    });
});

