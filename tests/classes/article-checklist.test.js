const fs = require('fs');
const _ = require("lodash");
const utils = require("../../utils");
const chai = require('chai');
chai.use(require('chai-string'));
let expect = chai.expect;

const app = require("../../commands");
const { ArticleChecklist, ProgramTimeline } = app.classes;

describe('Article Checklist', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
      6) 
    */

    var abbreviations = fs.readFileSync(__dirname + '/../prodticket/input/abbreviations-cc.html').toString();
    var abbreviationsPrint = fs.readFileSync(__dirname + '/input/abbreviations-print.html').toString();

    var accreditationStatement = fs.readFileSync(__dirname + '/../prodticket/input/accreditation-statement-th.html').toString();
    var accreditationStatementPrint = fs.readFileSync(__dirname + '/input/accreditation-statement-print.html').toString();
    
    var activityOverview = fs.readFileSync(__dirname + '/../prodticket/input/activity-overview-th.html').toString();
    var activityOverviewPrint = fs.readFileSync(__dirname + '/input/activity-overview-print.html').toString();
    
    var components = require('../prodticket/input/components-fr');
    var componentsPrint = fs.readFileSync(__dirname + '/input/components-print.html').toString();

    var slideComponents = require('../prodticket/input/slide-components-fr');
    var slideComponentsPrint = fs.readFileSync(__dirname + '/input/slide-components-print.html').toString();

    var programDetails = require('../prodticket/input/program-details');
    var programDetailsPrint = fs.readFileSync(__dirname + '/input/program-details-print.html').toString();

    var dateTime = {
        date: "Wednesday, 3 October, 2018",
        time: "13:00 &#8211; 14:30"
    };
    var dateTimePrint = fs.readFileSync(__dirname + '/input/date-time-print.html').toString();

    var contributors = require('../prodticket/input/contributors-th');
    var contributorsPrint = fs.readFileSync(__dirname + '/input/contributors-print.html').toString();

    var articleChecklist = new ArticleChecklist();
    articleChecklist.abbreviations.result = abbreviations;
    articleChecklist.accreditationStatement.result = accreditationStatement;
    articleChecklist.activityOverview.result = activityOverview;
    articleChecklist.components.result = components;
    articleChecklist.slides.result = slideComponents;

    var realProgramDetails = [];
    for (var i = 0; i < programDetails.length; i++) {
        realProgramDetails.push(new ProgramTimeline(programDetails[i].schedule, programDetails[i].infoTitle, programDetails[i].infoSubtitle));
    }
    articleChecklist.programDetails.result = realProgramDetails;
    articleChecklist.dateTime.result = dateTime;
    articleChecklist.contributors.result = contributors;
    beforeEach(function () {

    });

    describe('printStringProp()', function () {
        it('should return a readable string of the Abbreviations property passed', function () {
            var result = articleChecklist.abbreviations.printFn(articleChecklist.abbreviations);
            // console.log(result);
            expect(result).to.equalIgnoreSpaces(abbreviationsPrint);
        });

        it('should return a readable string of the Accreditation Statement property passed', function () {
            var result = articleChecklist.accreditationStatement.printFn(articleChecklist.accreditationStatement);
            expect(result).to.equalIgnoreSpaces(accreditationStatementPrint);
        });

        it('should return a readable string of the Activity Overview passed', function () {
            var result = articleChecklist.activityOverview.printFn(articleChecklist.activityOverview);
            expect(result).to.equalIgnoreSpaces(activityOverviewPrint);
        });
    });

    describe('printProgramDetails()', function () {
        it('should return a readable string of Program Details', function () {
            var result = articleChecklist.programDetails.printFn(articleChecklist.programDetails);
            // console.log(result);

            expect(result).to.equalIgnoreSpaces(programDetailsPrint);
        });
    });

    describe('printContributors()', function () {
        it('should return a readable string of Contributors', function () {
            var result = articleChecklist.contributors.printFn(articleChecklist.contributors);
            // console.log(result);
            expect(result).to.equalIgnoreSpaces(contributorsPrint);
        });
    });

    describe('printSlides()', function () {
        it('should return a readable string of Slides Components', function () {
            var result = articleChecklist.slides.printFn(articleChecklist.slides);
            // console.log(result);
            expect(result).to.equalIgnoreSpaces(slideComponentsPrint);
        });
    });

    describe('printComponents()', function () {
        it('should return a readable string of Program Components', function () {
            var result = articleChecklist.components.printFn(articleChecklist.components);
            // console.log(result);
            expect(result).to.equalIgnoreSpaces(componentsPrint);
        }); 
    });

    describe('printDateTime()', function () {
        it('should return a readable string of article Date and Time', function () {
            var result = articleChecklist.dateTime.printFn(articleChecklist.dateTime);
            // console.log(result);
            expect(result).to.equalIgnoreSpaces(dateTimePrint);
        });
    });
});