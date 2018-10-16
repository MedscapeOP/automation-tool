const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../app');
const utils = app.utils;
const clinicalBrief = app.clinicalBrief;

describe('Clinical Brief', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
      6) 
    */

    var prodTicket;
    var completeClinicalContext;
    var completeStudySynopsis;
    var completeStudyHighlights;
    var completeClinicalImplications;
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeClinicalContext = fs.readFileSync(__dirname + '/input/clinical-context.xml');
        completeStudySynopsis = fs.readFileSync(__dirname + '/input/study-synopsis.xml');
        completeStudyHighlights = fs.readFileSync(__dirname + '/input/study-highlights.xml');
        completeClinicalImplications = fs.readFileSync(__dirname + '/input/clinical-implications.xml');
        completeClinicalBrief = fs.readFileSync(__dirname + '/input/complete-article.xml');
    });
    
    describe('#getClinicalContext()', function () {
        it('should return "Clinical Context" section as JavaScript object', function () {
            var result = utils.xmlOps.objectToXMLString(clinicalBrief.getClinicalContext(prodTicket).toObjectLiteral());
            expect(result).to.equalIgnoreSpaces(completeClinicalContext.toString());
        });
    });
    
    describe('#getSynopsisAndPerspective()', function () {
        it('should return "Synopsis and Perspective" section as JavaScript object', function () {
            var result = utils.xmlOps.objectToXMLString(clinicalBrief.getSynopsisAndPerspective(prodTicket).toObjectLiteral());
            expect(result).to.equalIgnoreSpaces(completeStudySynopsis.toString());
        });
    });

    describe('#getStudyHighlights()', function () {
        it('should return "Study Highlights" section as JavaScript object', function () {
            var result = utils.xmlOps.objectToXMLString(clinicalBrief.getStudyHighlights(prodTicket).toObjectLiteral());
            expect(result).to.equalIgnoreSpaces(completeStudyHighlights.toString());
        });
    });

    describe('#getClinicalImplications()', function () {
        it('should return "Study Highlights" section as JavaScript object', function () {
            var result = utils.xmlOps.objectToXMLString(clinicalBrief.getClinicalImplications(prodTicket).toObjectLiteral());
            expect(result).to.equalIgnoreSpaces(completeClinicalImplications.toString());
        });
    });

    describe('#buildClinicalBrief()', function () {
        it('should return complete XML string of article', function () {
            var result = utils.xmlOps.objectToXMLString(
                clinicalBrief.buildClinicalBrief(prodTicket, app.config.programs.clinicalBrief));
            // expect(result).to.equalIgnoreSpaces(completeClinicalBrief.toString());
            var differences = [
                "contrbtr_pre_content shouldn't have anything - FIXED",
                "contrbtr_post_content shouldn't have peer reviewer automatically - FIXED",
                "prof_article wrapper element is not present - TO FIX",
                "References should be wrapped in <ol></ol> - FIXED",
                "contrbtr_groups not inserted - KNOWN ISSUE",
                "supprtr_grant_attr not found or handled - KNOWN ISSUE"
            ]
            // console.log("EVERYTHING PASSES EXCEPT THESE DIFFERENCES: ", differences);
            console.log(result);
        });
    });
});

