const fs = require('fs');
const _ = require("lodash");
const expect = require('chai').expect;

const app = require('../../commands');
const {ProfActivity, ContributorGroup} = app.classes;
const TOCElement = app.classes.TOCElement;
const utils = app.utils;


describe('Prof Activity Element', function () {
    var learningObjectives = fs.readFileSync(__dirname + '/../utils/input/formatted-objectives-cc.html', 'utf8');

    var creditInstructions = fs.readFileSync(__dirname + '/../snippets/input/credit-instructions-cb.html', 'utf8');

    var contrbtrGroupEditors = new ContributorGroup("Editors");

    var contrbtrGroupAuthors = new ContributorGroup("CME Authors");

    var profActivityInstance; 
    beforeEach(function() {        
        // sectionText = require('./input/section_text'); 
        // completeProfArticle = require('./input/slide_group');
        profActivityInstance = new ProfActivity();
    });

    /* TEST GETTERS AND SETTERS FOR TITLE */
    describe('#get/set .title', function () {
        it('should set and get title and return null if field is set to falsy value', function () {
            profActivityInstance.title = "Extraordinary Cases of VTE Prevention in Patient with Cancer";
            expect(profActivityInstance.title).to.equal('Extraordinary Cases of VTE Prevention in Patient with Cancer');
            
            profActivityInstance.title = undefined;
            expect(profActivityInstance.title).to.equal(null);
            
        });
    });

    /* TEST GETTERS AND SETTERS FOR LEARNING OBJECTIVES */
    describe('#get/set .learningObjectives', function () {
        it('should set and get learning objective markup and return null if none are set', function (done) {
            profActivityInstance.learningObjectives = learningObjectives;

            // console.log(JSON.stringify(profActivityInstance.toObjectLiteral(), undefined, 2));
            expect(profActivityInstance.learningObjectives).to.equalIgnoreSpaces(learningObjectives);
            done();
        });
    });

    /* TEST GETTERS AND SETTERS FOR GOAL STATEMENT */
    describe('#get/set .goalStatement', function () {
        it('should set and get goal statement and return null if set to falsy - text field', function () {
            profActivityInstance.goalStatement = "The goal of this activity is to improve physician education regarding the role of pharmacologic and nonpharmacologic approaches when managing patients who wish to stop smoking tobacco.";
            
            expect(profActivityInstance.goalStatement).to.equalIgnoreSpaces('The goal of this activity is to improve physician education regarding the role of pharmacologic and nonpharmacologic approaches when managing patients who wish to stop smoking tobacco.');
            
            profActivityInstance.goalStatement = null;

            expect(profActivityInstance.goalStatement).to.equal(null);
        });
    });

    describe('#get/set .targetAudience', function () {
        it('should set and get target audience markup and return null if set to falsy - Text field', function (done) {

            profActivityInstance.targetAudience = "<p>This activity is intended for cardiologists, hematology and oncology specialists, and primary care physicians.</p>";

            expect(profActivityInstance.targetAudience).to.equal('<p>This activity is intended for cardiologists, hematology and oncology specialists, and primary care physicians.</p>');
            done();
        });
    });


    /* TEST GETTERS AND SETTERS FOR CONTRIBUTOR POST CONTENT (PEER REVIEWER) */
    describe('#get/set .creditInstructions', function () {
        it('should set and get credit instructions markup and return null if set to falsy value', function (done) {
            profActivityInstance.creditInstructions = `<div>${creditInstructions}</div>`;

            expect(profActivityInstance.creditInstructions).to.equalIgnoreSpaces(creditInstructions);
            done();
        });
    });


    /* TEST INSERT METHODS */
    describe('#insertContributorGroup()', function () {
        it('should insert contributor groups into activity', function (done) {
            
            profActivityInstance.insertContributorGroup(contrbtrGroupEditors);

            profActivityInstance.insertContributorGroup(contrbtrGroupAuthors);

            var activityXML = profActivityInstance.toFinalXML();

            fs.writeFileSync(__dirname + '/output/finished-activity.xml', activityXML);
            done();
        });
    });
});
