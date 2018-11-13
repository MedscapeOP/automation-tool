// const SubsectionElement = require('../../classes/subsec_element');
const fs = require('fs');
const chai = require('chai');

const app = require('../../commands');
const config = app.config;
const utils = app.utils;
const prodticket = app.prodTicket;

chai.use(require('chai-string'));
let expect = chai.expect;


describe('Prodticket Module Functions', function () {

    let prodticketCB;
    let prodticketCC;
    let prodticketSL;
    let prodticketFR;

    beforeEach(function() {
        prodticketCB = fs.readFileSync(__dirname + '/input/prodticket-cb.html').toString();
        prodticketCC = fs.readFileSync(__dirname + '/input/prodticket-cc.html').toString();      
        prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
        prodticketFR = fs.readFileSync(__dirname + '/input/prodticket-fr.html').toString();
        prodticketTH = fs.readFileSync(__dirname + '/input/prodticket-th.html').toString();
    });

    describe("prodticket.getTitle()", function () {
        it("should return the program title from the .html - Clinical Brief", function () {
            var result = prodticket.getTitle(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equal("Common Nonphysical Problems Seen After Stroke");
        });

        // it("should return the program title from the .html - Spotlight", function () {
        //     var result = prodticket.getTitle(prodticketSL, config.programs.spotlight);
        //     expect(result).to.equal("Cancer&#8208;Associated Thrombosis: Emerging Concepts and Paradigms");
        // });

        it("should return the program title from the .html - Curbside", function () {
            var result = prodticket.getTitle(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal("VTE in Cancer: What Do the Latest Data Suggest?");
        });

        it("should return the program title + subtitle from the .html - TownHall", function () {
            var result = prodticket.getTitle(prodticketTH, config.programs.townHall);
            expect(result).to.equal("Preventing HPV-Related Disease: From Global Perspectives to Local Solutions")
        });
    });

    describe("prodticket.getByline()", function () {
        it("should return the program byline from the .html - Clinical Brief", function () {
            var result = prodticket.getByline(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equal("<p>News Author: Sue Hughes; CME Author: Laurie Barclay, MD</p>");
        });

        it("should return the program byline from the .html - Spotlight", function () {
            var result = prodticket.getByline(prodticketSL, config.programs.spotlight);
            expect(result).to.equal("<p>Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP; Alok A. Khorana, MD; Jeffrey I. Weitz, MD, FRCP</p>");
        });

        it("should return the program byline from the .html - Curbside", function () {
            var result = prodticket.getByline(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal("<p>Jeffrey I. Weitz, MD, FRCP(C); Alok A. Khorana, MD</p>");
        });

        it("should return the program byline from the .html - TownHall", function () {
            var result = prodticket.getByline(prodticketTH, config.programs.townHall);
            expect(result).to.equal();
        });
    });

    describe("prodticket.getAbbreviations()", function () {
        var abbreviationsCC = fs.readFileSync(__dirname + '/input/abbreviations-cc.html').toString();
        var abbreviationsSL = fs.readFileSync(__dirname + '/input/abbreviations-sl.html').toString();

        it("should return the program abbreviations from the .html - Spotlight", function () {
            var result = prodticket.getAbbreviations(prodticketSL, config.programs.spotlight);
            expect(result).to.equal(abbreviationsSL);
        });

        it("should return the program abbreviations from the .html - Curbside", function () {
            var result = prodticket.getAbbreviations(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal(abbreviationsCC);
        });
    });

    describe("prodticket.getReferences()", function () {
        var referencesCB = fs.readFileSync(__dirname + '/input/references-cb.html').toString();
        var referencesSL = fs.readFileSync(__dirname + '/input/references-sl.html').toString();
        var referencesCC = fs.readFileSync(__dirname + '/input/references-cc.html').toString();

        it("should return the program references from the .html - Clinical Brief", function () {
            var result = prodticket.getReferences(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(referencesCB);
        });

        it("should return the program references from the .html - Spotlight", function () {
            var result = prodticket.getReferences(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(referencesSL);
        });

        it("should return the program references from the .html - Curbside", function () {
            var result = prodticket.getReferences(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(referencesCC);
        });
    });

    describe("prodticket.getPeerReviewer()", function () {
        var peerReviewerSL = fs.readFileSync(__dirname + '/input/peer-reviewer-sl.html').toString();
        var peerReviewerCC = fs.readFileSync(__dirname + '/input/peer-reviewer-cc.html').toString();
    
        it("should return the program peer reviewer statement from .html - Spotlight", function () {
            var result = prodticket.getPeerReviewer(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(peerReviewerSL);
        });

        it("should return the program peer reviewer statement from .html - Curbside", function () {
            var result = prodticket.getPeerReviewer(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(peerReviewerCC);
        });
    });

    describe("prodticket.getSlides()", function () {
        var slideComponentsSL = require('./input/slide-components-sl');
        var slideComponentsCC = require('./input/slide-components-cc');
        var slideComponentsFR = require('./input/slide-components-fr');

        it("should return an array of slide components from .html - Spotlight", function () {
            var result = prodticket.getSlides(prodticketSL, config.programs.spotlight);
            expect(result[0].articleID).to.equal(slideComponentsSL[0].articleID);
            expect(result[0].componentNumber).to.equal(slideComponentsSL[0].componentNumber);
            expect(result[0].slidePath).to.equal(slideComponentsSL[0].slidePath);
            expect(result[0].rawSlides).to.equalIgnoreSpaces(slideComponentsSL[0].rawSlides);
        });

        it("should return an array of slide components from .html - Curbside", function () {
            var result = prodticket.getSlides(prodticketCC, config.programs.curbsideConsult);
            expect(result[0].articleID).to.equal(slideComponentsCC[0].articleID);
            expect(result[0].componentNumber).to.equal(slideComponentsCC[0].componentNumber);
            expect(result[0].slidePath).to.equal(slideComponentsCC[0].slidePath);
            expect(result[0].rawSlides).to.equalIgnoreSpaces(slideComponentsCC[0].rawSlides);
        });

        it("should return an array of slide components from .html - First Response", function () {
            var result = prodticket.getSlides(prodticketFR, config.programs.firstResponse);
            for (var i = 0; i < slideComponentsFR.length; i++) {
                expect(result[i].articleID).to.equal(slideComponentsFR[i].articleID);
                expect(result[i].componentNumber).to.equal(slideComponentsFR[i].componentNumber);
                expect(result[i].slidePath).to.equal(slideComponentsFR[i].slidePath);
                expect(result[i].rawSlides).to.equalIgnoreSpaces(slideComponentsFR[i].rawSlides);
            }
            // expect(result).to.deep.equal(slideComponentsFR);
        });
    });

    describe("prodticket.getGoalStatement()", function () {
        var goalStatementCB = fs.readFileSync(__dirname + '/input/goal-statement-cb.html').toString();
        var goalStatementSL = fs.readFileSync(__dirname + '/input/goal-statement-sl.html').toString();
        var goalStatementCC = fs.readFileSync(__dirname + '/input/goal-statement-cc.html').toString();

        it("should return the program goal statement - Clinical Brief", function () {
            var result = prodticket.getGoalStatement(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(goalStatementCB);
        });

        it("should return the program goal statement from .html - Spotlight", function () {
            var result = prodticket.getGoalStatement(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(goalStatementSL);
        });

        it("should return the program goal statement from .html - Curbside", function () {
            var result = prodticket.getGoalStatement(prodticketCC, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(goalStatementCC);
        });
    });

    describe("prodticket.getTargetAudience()", function () {
        var targetAudienceCB = fs.readFileSync(__dirname + '/input/target-audience-cb.html').toString();
        var targetAudienceSL = fs.readFileSync(__dirname + '/input/target-audience-sl.html').toString();
        var targetAudienceCC = fs.readFileSync(__dirname + '/input/target-audience-cc.html').toString();

        it("should return the program target audience from .html - Clinical Brief", function () {
            var result = prodticket.getTargetAudience(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(targetAudienceCB);
        });

        it("should return the program target audience from .html - Spotlight", function () {
            var result = prodticket.getTargetAudience(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(targetAudienceSL);
        });

        it("should return the program target audience from .html - Curbside", function () {
            var result = prodticket.getTargetAudience(prodticketCC, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(targetAudienceCC);
        });
    });

    describe("prodticket.getLearningObjectives()", function () {
        var learningObjectivesCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var learningObjectivesSL = fs.readFileSync(__dirname + '/input/learning-objectives-sl.html').toString();
        var learningObjectivesCC = fs.readFileSync(__dirname + '/input/learning-objectives-cc.html').toString();

        it("should return the program learning objectives from .html - Clinical Brief", function () {
            var result = prodticket.getLearningObjectives(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(learningObjectivesCB);
        });

        it("should return the program learning objectives from .html - Spotlight", function () {
            var result = prodticket.getLearningObjectives(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(learningObjectivesSL);
        });

        it("should return the program learning objectives from .html - Curbside", function () {
            var result = prodticket.getLearningObjectives(prodticketCC, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(learningObjectivesCC);
        });
    });

    describe("prodticket.getComponents()", function () {
        var componentsArray = require('./input/components-fr');

        it("should return an array of components from .html - First Response", function () {
            var result = prodticket.getComponents(prodticketFR, config.programs.firstResponse);
            for (var i = 0; i < componentsArray.length; i++) {
                expect(result[i].componentNumber).to.equal(componentsArray[i].componentNumber);

                expect(result[i].title).to.equalIgnoreSpaces(componentsArray[i].title);

                expect(result[i].teaser).to.equalIgnoreSpaces(componentsArray[i].teaser);

                expect(result[i].byline).to.equalIgnoreSpaces(componentsArray[i].byline);

                expect(result[i].contentType).to.equalIgnoreSpaces(componentsArray[i].contentType);
            }
            // console.log("COMPONENTS RESULT: ", result);
        });
    });
});

