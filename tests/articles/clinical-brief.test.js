const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../commands');
const utils = app.utils;
const clinicalBrief = app.articles.clinicalBrief;

describe('Clinical Brief', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
    */

    var prodTicket;
    var prodTicketPreAssessment;
    var prodTicketPostAssessment;
    var program;
    var completeClinicalContext;
    var completeStudySynopsis;
    var completeStudyHighlights;
    var completeClinicalImplications;
    beforeEach(function() {
        program = app.config.programs.clinicalBrief;
        prodTicket = fs.readFileSync(__dirname + '/input/clinical-brief/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-brief/clinical-context'));

        completeClinicalContext = fs.readFileSync(__dirname + '/input/clinical-brief/clinical-context.xml');
        completeStudySynopsis = fs.readFileSync(__dirname + '/input/clinical-brief/study-synopsis.xml');
        completeStudyHighlights = fs.readFileSync(__dirname + '/input/clinical-brief/study-highlights.xml');
        completeClinicalImplications = fs.readFileSync(__dirname + '/input/clinical-brief/clinical-implications.xml');
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
        it('should return complete XML string of Clinical Brief', function () {
            program.hasOUS = false;
            program.qnaID = 55555;

            var result = clinicalBrief.buildClinicalBrief(prodTicket, program).finishedArticleObject.toObjectLiteral();
            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result))
            completeClinicalBrief = fs.readFileSync(__dirname + '/input/clinical-brief/complete-article.xml').toString();
            expect(result).to.equalIgnoreSpaces(completeClinicalBrief);
        });

        it('should return complete XML string of Clinical Brief - Pre Assessment', function () {
            prodTicketPreAssessment = fs.readFileSync(__dirname + '/input/clinical-brief/article-pre-assessment.html', 'utf8');
            program.hasOUS = false;
            program.hasPreAssessment = true;
            program.qnaID = 53918;

            var result = clinicalBrief.buildClinicalBrief(prodTicketPreAssessment, program).finishedArticleObject.toObjectLiteral();
            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            completeClinicalBrief = fs.readFileSync(__dirname + '/input/clinical-brief/complete-article-pre.xml').toString();
            expect(result).to.equalIgnoreSpaces(completeClinicalBrief);
        });

        it('should return complete XML string of Clinical Brief - Post Assessment', function () {
            prodTicketPostAssessment = fs.readFileSync(__dirname + '/input/clinical-brief/article-post-assessment.html', 'utf8');
            program.hasOUS = false;
            program.hasPreAssessment = false;
            program.hasPostAssessment = true;
            program.qnaID = 53498;
            var result = clinicalBrief.buildClinicalBrief(prodTicketPostAssessment, program).finishedArticleObject.toObjectLiteral();
            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            completeClinicalBrief = fs.readFileSync(__dirname + '/input/clinical-brief/complete-article-post.xml').toString();
            expect(result).to.equalIgnoreSpaces(completeClinicalBrief);
        });
    });
});

