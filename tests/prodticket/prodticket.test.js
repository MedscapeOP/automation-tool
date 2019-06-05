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
    let prodticketTH;
    let prodticketTH_alt;
    let prodticketTH_alt_2;
    let prodticketFail;
    let prodticketTT_902362;
    let prodticketCCTranscript;

    beforeEach(function() {
        prodticketCB = fs.readFileSync(__dirname + '/input/prodticket-cb.html').toString();
        prodticketCC = fs.readFileSync(__dirname + '/input/prodticket-cc.html').toString();      
        prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
        prodticketFR = fs.readFileSync(__dirname + '/input/prodticket-fr.html').toString();
        prodticketTH = fs.readFileSync(__dirname + '/input/prodticket-th.html').toString();
        prodticketTH_alt = fs.readFileSync(__dirname + '/input/prodticket-th-alt.html').toString();
        prodticketTH_alt_2 = fs.readFileSync(__dirname + '/input/prodticket-th-alt-2.html').toString();
        prodticketTT_902362 = fs.readFileSync(__dirname + '/input/prodticket-tt-902362.html').toString();
        prodticketFail = fs.readFileSync(__dirname + '/input/prodticket-fail.html').toString();
    });

    /**
    * TITLE      
    */
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
            var result = prodticket.getTitle(prodticketTH_alt, config.programs.townHall);
            // expect(result).to.equal("Preventing HPV-Related Disease: From Global Perspectives to Local Solutions");
            expect(result).to.equal("The Big Debate: Pharmacologic vs Alternative Approaches in Smoking Cessation");
        });

        it("should return error object with message for missing title", function () {
           
            var result = prodticket.getTitle(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No title found in the prodticket");
    
        });        
    });

    /**
    * BYLINE     
    */
    describe("prodticket.getByline()", function () {
        it("should return the program byline from the .html - Clinical Brief", function () {
            var result = prodticket.getByline(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equal("News Author: Sue Hughes; CME Author: Laurie Barclay, MD");
        });

        it("should return the program byline from the .html - Spotlight", function () {
            var result = prodticket.getByline(prodticketSL, config.programs.spotlight);
            expect(result).to.equal("Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP; Alok A. Khorana, MD; Jeffrey I. Weitz, MD, FRCP");
        });

        it("should return the program byline from the .html - Curbside", function () {
            var result = prodticket.getByline(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal("Jeffrey I. Weitz, MD, FRCP(C); Alok A. Khorana, MD");
        });

        it("should return the program byline from the .html - TownHall", function () {
            var result = prodticket.getByline(prodticketTH_alt, config.programs.townHall);
            // expect(result).to.equal("<p>Kenneth A. Alexander, MD, PhD; Suzanne M. Garland, AO, MBBS, MD, FRCPA, FRANZCOG Ad Eundem, FAChSHM, FASM, FFSc(RCPA); Suresh Kumarasamy, MBBS, MObGyn, FRCOG, FRCPI; Batmunkh Tsetsegsaikhan, PhD, MPH/MHM</p>");

            // expect(result).to.equal("<p>Byline not found in the prodticket!</p>");

            expect(result).to.equal("Henri-Jean Aubin, MD, PhD; Peter Hajek, PhD; Serena Tonstad, MD, PhD");
        });

        it("should return error object with message for missing byline", function () {
           
            var result = prodticket.getByline(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No byline found in the prodticket");
        });  
    });

    /**
    * CONTRIBUTORS     
    */
    describe("prodticket.getContributors()", function () {
        this.timeout(10000);
        var contributorsCC = require("./input/contributors-cc");
        var contributorsSL = require("./input/contributors-sl");
        var contributorsTH = require("./input/contributors-th");
        var contributorsTH_alt = require("./input/contributors-th-alt");
        it("should return the program contributors from the .html - Spotlight", function (done) {
            var result = prodticket.getContributors(prodticketSL, config.programs.spotlight);

            // fs.writeFileSync(__dirname + '/output/contributors.json', JSON.stringify(result, undefined, 2), function(err) {
            //     if(err) {
            //         return console.log(err);
            //     } else {
            //         return;
            //     }
            // });

            for (var i = 0; i < contributorsSL.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(contributorsSL[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(contributorsSL[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(contributorsSL[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(contributorsSL[i].disclosure);
            }
            done()
        });

        it("should return the program contributors from the .html - Curbside", function (done) {
            var result = prodticket.getContributors(prodticketCC, config.programs.curbsideConsult);
            // console.log("RESULT CURBSIDE: ", result);

            // fs.writeFileSync(__dirname + '/output/contributors.json', JSON.stringify(result, undefined, 2), function(err) {
            //     if(err) {
            //         return console.log(err);
            //     } else {
            //         return;
            //     }
            // });

            for (var i = 0; i < contributorsCC.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(contributorsCC[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(contributorsCC[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(contributorsCC[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(contributorsCC[i].disclosure);
            }
            done();
        });

        it("should return the program contributors from the .html - TownHall", function () {
            var result = prodticket.getContributors(prodticketTH_alt, config.programs.townHall);

            for (var i = 0; i < contributorsTH_alt.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(contributorsTH_alt[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(contributorsTH_alt[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(contributorsTH_alt[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(contributorsTH_alt[i].disclosure);
            }
        });

        it("should return the program contributors (With Titles) from the .html - TownHall", function () {
            var result = prodticket.getContributors(prodticketTH, config.programs.townHall);

            for (var i = 0; i < contributorsTH.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(contributorsTH[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(contributorsTH[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(contributorsTH[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(contributorsTH[i].disclosure);
            }
        });

        it("should return error object with message for missing contributors", function () {
        
            var result = prodticket.getContributors(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No contributors found in the Speakers section of the prodticket");
        
        });  
    });

    /**
    * CME REVIEWERS      
    */
   describe("prodticket.getCMEReviewers()", function () {
        this.timeout(7000);
        var reviewersCB = require("./input/cme-reviewers-cb");
        var reviewersCC = require("./input/cme-reviewers-cc");
        var reviewersTH = require("./input/cme-reviewers-th");
        var reviewersTH_alt = require("./input/cme-reviewers-th-alt");
        
        it("should return the program CME Reviewers from the .html - Clinical Brief", function (done) {
            config.programs.clinicalBrief.hasOUS = false;
            var result = prodticket.getCMEReviewers(prodticketCB, config.programs.clinicalBrief);
            for (var i = 0; i < reviewersCB.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(reviewersCB[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(reviewersCB[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(reviewersCB[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(reviewersCB[i].disclosure);
                expect(result[i].chronicleid).to.equalIgnoreSpaces(reviewersCB[i].chronicleid);
            }
            // console.log("RESULT CME REVIEWERS: ", result);
            done();
        });

        it("should return the program CME Reviewers from the .html - Curbside Consult", function (done) {
            var result = prodticket.getCMEReviewers(prodticketCC, config.programs.curbsideConsult);
            for (var i = 0; i < reviewersCC.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(reviewersCC[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(reviewersCC[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(reviewersCC[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(reviewersCC[i].disclosure);
                expect(result[i].chronicleid).to.equalIgnoreSpaces(reviewersCC[i].chronicleid);
            }
            // console.log("RESULT CME REVIEWERS: ", result);
            done();
        });

        it("should return the program CME Reviewers from the .html - Town Hall", function (done) {
            config.programs.townHall.hasOUS = false;
            var result = prodticket.getCMEReviewers(prodticketTH, config.programs.townHall);
            for (var i = 0; i < reviewersTH.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(reviewersTH[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(reviewersTH[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(reviewersTH[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(reviewersTH[i].disclosure);
                expect(result[i].chronicleid).to.equalIgnoreSpaces(reviewersTH[i].chronicleid);
            }
            // console.log("RESULT CME REVIEWERS: ", result);
            done();
        });

        it("should return the program CME Reviewers from the .html - Town Hall Alt", function (done) {
            var result = prodticket.getCMEReviewers(prodticketTH_alt, config.programs.townHall);
            for (var i = 0; i < reviewersTH_alt.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(reviewersTH_alt[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(reviewersTH_alt[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(reviewersTH_alt[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(reviewersTH_alt[i].disclosure);
                expect(result[i].chronicleid).to.equalIgnoreSpaces(reviewersTH_alt[i].chronicleid);
            }
            done();
        });

        it("should return error object with message for missing CME reviewers", function () {
        
            var result = prodticket.getCMEReviewers(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No CME reviewers found in the prodticket");
        
        });  
    });

    /**
    * ABBREVIATIONS     
    */
    describe("prodticket.getAbbreviations()", function () {
        var abbreviationsCC = fs.readFileSync(__dirname + '/input/abbreviations-cc.html').toString();
        var abbreviationsSL = fs.readFileSync(__dirname + '/input/abbreviations-sl.html').toString();
        var abbreviationsTH = fs.readFileSync(__dirname + '/input/abbreviations-th.html').toString();

        it("should return the program abbreviations from the .html - Spotlight", function () {
            var result = prodticket.getAbbreviations(prodticketSL, config.programs.spotlight);
            expect(result).to.equal(abbreviationsSL);
        });

        it("should return the program abbreviations from the .html - Curbside", function () {
            var result = prodticket.getAbbreviations(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal(abbreviationsCC);
        });

        it("should return the program abbreviations from the .html - TownHall", function (){
            var result = prodticket.getAbbreviations(prodticketTH_alt, config.programs.townHall);
            expect(result).to.equal(abbreviationsTH);
        });

        it("should return error object with message for missing abbreviations", function () {
           
            var result = prodticket.getAbbreviations(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No abbreviations found in the prodticket");
            
        });  
        
    });

    /**
    * REFERENCES     
    */
    describe("prodticket.getReferences()", function () {
        var referencesCB = fs.readFileSync(__dirname + '/input/references-cb.html').toString();
        var referencesSL = fs.readFileSync(__dirname + '/input/references-sl.html').toString();
        var referencesCC = fs.readFileSync(__dirname + '/input/references-cc.html').toString();
        var referencesTH = fs.readFileSync(__dirname + '/input/references-th.html').toString();

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

        it("should return the program references from the .html - TownHall", function () {
            var result = prodticket.getReferences(prodticketTH_alt, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(referencesTH);
        });

        it("should return error object with message for missing references", function () {
           
            var result = prodticket.getReferences(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No references found in the prodticket");
            
        });  
    });

    /**
    * PEER REVIEWER     
    */
    describe("prodticket.getPeerReviewer()", function () {
        var peerReviewerSL = fs.readFileSync(__dirname + '/input/peer-reviewer-sl.html').toString();
        var peerReviewerCC = fs.readFileSync(__dirname + '/input/peer-reviewer-cc.html').toString();
        var peerReviewerTH = fs.readFileSync(__dirname + '/input/peer-reviewer-th.html').toString();
    
        it("should return the program peer reviewer statement from .html - Spotlight", function () {
            var result = prodticket.getPeerReviewer(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(peerReviewerSL);
        });

        it("should return the program peer reviewer statement from .html - Curbside", function () {
            var result = prodticket.getPeerReviewer(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(peerReviewerCC);
        });

        it("should return the program peer reviewer statement from .html - TownHall", function () {
            var result = prodticket.getPeerReviewer(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(peerReviewerTH);
        });

        it("should return error object with message for missing peer reviewer", function () {
           
            var result = prodticket.getPeerReviewer(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No peer reviewer info found in the prodticket");
            
        });
    });

    /**
    * SLIDES    
    */
    describe("prodticket.getSlides()", function () {
        var slideComponentsSL = require('./input/slide-components-sl');
        var slideComponentsCC = require('./input/slide-components-cc');
        var slideComponentsFR = require('./input/slide-components-fr');
        var slideComponentsTH = require('./input/slide-components-th');

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
            // fs.writeFileSync(__dirname + '/output/slide-components.html', result[4].rawSlides);

            for (var i = 0; i < slideComponentsFR.length; i++) {
                expect(result[i].articleID).to.equal(slideComponentsFR[i].articleID);
                expect(result[i].componentNumber).to.equal(slideComponentsFR[i].componentNumber);
                expect(result[i].slidePath).to.equal(slideComponentsFR[i].slidePath);
                expect(result[i].rawSlides).to.equalIgnoreSpaces(slideComponentsFR[i].rawSlides);
            }
            // expect(result).to.deep.equal(slideComponentsFR);
        });

        it("should return an array of slide components from .html - TownHall", function () {
            config.programs.townHall.articleID = "903975";
            var result = prodticket.getSlides(prodticketTH_alt, config.programs.townHall);

            expect(result[0].articleID).to.equal(slideComponentsTH[0].articleID);
            expect(result[0].componentNumber).to.equal(slideComponentsTH[0].componentNumber);
            expect(result[0].slidePath).to.equal(slideComponentsTH[0].slidePath);
            expect(result[0].rawSlides).to.equalIgnoreSpaces(slideComponentsTH[0].rawSlides);      
        });

        it("should return error object with message for missing slides", function () {
           
            var result = prodticket.getSlides(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No slides found in the prodticket");
        
        });
    });

    /**
    * GOAL STATEMENT   
    */
    describe("prodticket.getGoalStatement()", function () {
        var goalStatementCB = fs.readFileSync(__dirname + '/input/goal-statement-cb.html').toString();
        var goalStatementSL = fs.readFileSync(__dirname + '/input/goal-statement-sl.html').toString();
        var goalStatementCC = fs.readFileSync(__dirname + '/input/goal-statement-cc.html').toString();
        var goalStatementTH_alt = fs.readFileSync(__dirname + '/input/goal-statement-th.html').toString();
        var goalStatementTH = "<p>The goals of this activity are to increase HPV vaccine uptake and decrease HPV-related cancers in females and males.</p>"

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

        it("should return the program goal statement from the .html - TownHall", function() {
            var result = prodticket.getGoalStatement(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(goalStatementTH);
        });

        it("should return error object with message for missing goal statement", function () {
        
            var result = prodticket.getGoalStatement(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No goal statement found in the prodticket");
            
        });
    });

    /**
    * TARGET AUDIENCE   
    */    
    describe("prodticket.getTargetAudience()", function () {
        var targetAudienceCB = fs.readFileSync(__dirname + '/input/target-audience-cb.html').toString();
        var targetAudienceSL = fs.readFileSync(__dirname + '/input/target-audience-sl.html').toString();
        var targetAudienceCC = fs.readFileSync(__dirname + '/input/target-audience-cc.html').toString();
        var targetAudienceTH = "<p>This activity is intended for pediatricians, primary care physicians, and obstetricians/gynecologists.</p>";
        var targetAudienceTH_alt = fs.readFileSync(__dirname + '/input/target-audience-th.html').toString();

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

        it("should return the program target audience from .html - TownHall", function () {
            var result = prodticket.getTargetAudience(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(targetAudienceTH);
        });

        it("should return error object with message for missing target audience", function () {
           
            var result = prodticket.getTargetAudience(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No target audience statement found in the prodticket");
        
        });
    });

    /**
    * LEARNING OBJECTIVES   
    */
    describe("prodticket.getLearningObjectives()", function () {
        var learningObjectivesCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var learningObjectivesSL = fs.readFileSync(__dirname + '/input/learning-objectives-sl.html').toString();
        var learningObjectivesCC = fs.readFileSync(__dirname + '/input/learning-objectives-cc.html').toString();
        var learningObjectivesTH = fs.readFileSync(__dirname + '/input/learning-objectives-th.html').toString();
        var learningObjectivesTH_alt = fs.readFileSync(__dirname + '/input/learning-objectives-th-alt.html').toString(); 

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

        it("should return the program learning objectives from .html - TownHall", function () {
            var result = prodticket.getLearningObjectives(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(learningObjectivesTH);

            var result_alt = prodticket.getLearningObjectives(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(learningObjectivesTH_alt);
        });

        it("should return error object with message for missing learning objectives", function () {
        
            var result = prodticket.getLearningObjectives(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No learning objectives found in the prodticket");
            
        });
    });

    /**
    * COMPONENTS  
    */
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

        it("should return error object with message for missing component info", function () {
           
            var result = prodticket.getComponents(prodticketFail, config.programs.firstResponse);
        
            expect(result.message).to.equal("No component info found in the prodticket");
            
        });
    });

    /**
    * ACTIVITY OVERVIEW 
    */
    describe("prodticket.getActivityOverview()", function () {
        var activityOverviewTH = fs.readFileSync(__dirname + '/input/activity-overview-th.html').toString();
        
        var activityOverviewTH_alt = fs.readFileSync(__dirname + '/input/activity-overview-th-alt.html').toString();

        it("should return the program Activity Overview from .html - TownHall", function () {
            var result = prodticket.getActivityOverview(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(activityOverviewTH);

            var result_alt = prodticket.getActivityOverview(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(activityOverviewTH_alt);
        });

        it("should return error object with message for missing activity overview", function () {
           
            var result = prodticket.getActivityOverview(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No activity overview found in the prodticket");
            
        });
    });

    /**
     * TEASER
     */
    describe("prodticket.getTeaser()", function () {
        var teaserCB = fs.readFileSync(__dirname + '/input/teaser-cb.html').toString();
        var teaserCC = fs.readFileSync(__dirname + '/input/teaser-cc.html').toString();
        var teaserSL = fs.readFileSync(__dirname + '/input/teaser-sl.html').toString();
        var teaserTH = fs.readFileSync(__dirname + '/input/teaser-th.html').toString();
        var teaserTH_alt = fs.readFileSync(__dirname + '/input/teaser-th-alt.html').toString();

        
        it("should return the program Teaser from .html - Clinical Brief", function () {
            var result = prodticket.getTeaser(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(teaserCB);
        });

        it("should return the program Teaser from .html - Curbside", function () {
            var result = prodticket.getTeaser(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(teaserCC);
        });

        it("should return the program Teaser from .html - Spotlight", function () {
            var result = prodticket.getTeaser(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(teaserSL);
        });

        it("should return the program Teaser from .html - TownHall", function () {
            var result = prodticket.getTeaser(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(teaserTH);
            
            var result_alt = prodticket.getTeaser(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(teaserTH_alt);
        });

        it("should return error object with message for missing teaser", function () {
           
            var result = prodticket.getTeaser(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No teaser info found in the prodticket");
            
        });
    });

    /**
     * CREDIT STATEMENT 
     */
    describe("prodticket.getAccreditation()", function () {
        var accreditationStatementTH = fs.readFileSync(__dirname + '/input/accreditation-statement-th.html').toString();
        var accreditationStatementTH_alt = fs.readFileSync(__dirname + '/input/accreditation-statement-th-alt.html').toString();

        it("should return the program Credit Statement from .html - TownHall", function () {
            var result = prodticket.getAccreditation(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(accreditationStatementTH);

            var result_alt = prodticket.getAccreditation(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(accreditationStatementTH_alt);
        });

        it("should return error object with message for missing accreditation statement", function () {
           
            var result = prodticket.getAccreditation(prodticketFail, config.programs.townHall);
        
            expect(result.message).to.equal("No accreditation statement found in the prodticket");
            
        });
    });

    /**
     * SUPPORTER INFORMATION 
     */
    describe("prodticket.getSupporter()", function () {
        // var supporterTH = "<div>Merck & Co., Inc.</div>";
        // var supporterCB = "<p>Supported by an independent educational grant from Merck &amp; Co., Inc. </p>";
        var supporterSL = "Bayer AG";
        var supporterCC = "Bayer AG";        
        var supporterFR = "TEVA, Teva Global";
        var supporterTH = "<p>Supported by an independent educational grant from Merck &amp; Co., Inc. </p>";
        
        it("should return the program Supporter name from .html - Spotlight", function () {
            var result = prodticket.getSupporter(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(supporterSL);
        });

        it("should return the program Supporter name from .html - Curbside", function () {
            var result = prodticket.getSupporter(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(supporterCC);
        });

        it("should return the program Supporter name from .html - First Response", function () {
            var result = prodticket.getSupporter(prodticketFR, config.programs.firstResponse);
            expect(result).to.equalIgnoreSpaces(supporterFR);
        });

        it("should return the program Supporter name from .html - TownHall", function () {
            var result = prodticket.getSupporter(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(supporterTH);
        });

        it("should return error object with message for missing supporter info", function () {
            var result = prodticket.getSupporter(prodticketFail, config.programs.townHall);
            expect(result.message).to.equal("No supporter info found in the prodticket"); 
        });
    });

    /**
     * CREDITS AVAILABLE
     */
    describe("prodticket.getCreditsAvailable()", function () {
        var creditsAvailableCB = "0.25";
        var creditsAvailableSL = "0.50";
        var creditsAvailableTH = "1.5";
        var creditsAvailableTH_alt = "No Credit Available Section In Prodticket";
        it("should return the program Credits Available from .html - TownHall", function () {
            var result = prodticket.getCreditsAvailable(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(creditsAvailableTH);
        });

        it("should return the program Credits Available from .html - TownHall Alternate", function () {
            var result = prodticket.getCreditsAvailable(prodticketTH_alt, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(creditsAvailableTH_alt);
        });

        it("should return the program Credits Available from .html - Spotlight", function () {
            var result = prodticket.getCreditsAvailable(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(creditsAvailableSL);
        });

        it("should return the program Credits Available from .html - Clinical Brief", function () {
            var result = prodticket.getCreditsAvailable(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(creditsAvailableCB);
        });

        it("should return error object with message for missing credits available", function () {
            var result = prodticket.getCreditsAvailable(prodticketFail, config.programs.townHall);
            expect(result.message).to.equal("No credits available found in the prodticket"); 
        });
    });

    // /**
    //  * LOCATION & MAP INFO
    //  */
    // describe("prodticket.getLocationInfo()", function () {
    //     /*
    //         Use Print/Collateral/Other section to get info 
    //             - If no Print section use Location/map info section 
    //         TAKEN FROM .jsp TH REG 
    //         var townHallAddress = "14 Darling Drive", //just street address
    //         townHallCity = "Sydney", //city
    //         townHallState = "NSW", //state
    //         townHallZip = "2000", //zip 

    //         <div class="town-hall-maplocation--city">Sydney</div>
    //         <div class="town-hall-maplocation--venue">International Convention Centre Sydney</div>
    //         <div class="town-hall-maplocation--room">Room:  Hall C4.4</div>
    //     */
    //     var addressTH = "14 Darling Drive";
    //     var cityTH = "Sydney";
    //     var stateTH = "NSW";
    //     var zipTH = "2000";
    //     var venueTH = "International Convention Centre Sydney";
    //     var roomTH = "Room: Hall C4.4";
    //     it("should return the program Location Info from .html - TownHall", function () {
    //         var result = prodticket.getLocationInfo(prodticketTH, config.programs.townHall);
    //         expect(result.address).to.equalIgnoreSpaces(addressTH);
    //         expect(result.city).to.equalIgnoreSpaces(cityTH);
    //         expect(result.state).to.equalIgnoreSpaces(stateTH);
    //         expect(result.zipcode).to.equalIgnoreSpaces(zipTH);
    //         expect(result.venue).to.equalIgnoreSpaces(venueTH);
    //         expect(result.room).to.equalIgnoreSpaces(roomTH);
    //     });


    //     var addressTH_alt_2 = "401 West Pratt Street";
    //     var cityTH_alt_2 = "Baltimore";
    //     var stateTH_alt_2 = "MD";
    //     var zipTH_alt_2 = "";
    //     var venueTH_alt_2 = "Hilton Baltimore";
    //     var roomTH_alt_2 = "Room: Key Ballroom";
    //     it("should return the program Location Info from .html - TownHall", function () {
    //         var result = prodticket.getLocationInfo(prodticketTH_alt_2, config.programs.townHall);
    //         expect(result.address).to.equalIgnoreSpaces(addressTH_alt_2);
    //         expect(result.city).to.equalIgnoreSpaces(cityTH_alt_2);
    //         expect(result.state).to.equalIgnoreSpaces(stateTH_alt_2);
    //         expect(result.zipcode).to.equalIgnoreSpaces(zipTH_alt_2);
    //         expect(result.venue).to.equalIgnoreSpaces(venueTH_alt_2);
    //         expect(result.room).to.equalIgnoreSpaces(roomTH_alt_2);
    //     });

    // });

    /**
     * DATE / TIME 
     */
    describe("prodticket.getDateTime()", function () {
        /* 
         Date & Time section to get info 
         return object with date and time as string properties 
        */ 
        var dateTH = "Wednesday, 3 October, 2018";
        var timeTH = "13:00 &#8211; 14:30";
        it("should return the program Date/Time from .html - TownHall", function () {
            var result = prodticket.getDateTime(prodticketTH, config.programs.townHall);
            expect(result.date).to.equalIgnoreSpaces(dateTH);
            expect(result.time).to.equalIgnoreSpaces(timeTH);
        });

        var dateTH_alt = "September 7, 2018";
        var timeTH_alt = "12:30 to 13:30";
        it("should return the program Date/Time from .html - TownHall Alt 2", function () {
            var result = prodticket.getDateTime(prodticketTH_alt, config.programs.townHall);
            expect(result.date).to.equalIgnoreSpaces(dateTH_alt);
            expect(result.time).to.equalIgnoreSpaces(timeTH_alt);
        });

        var dateTH_alt_2 = "Saturday, August 18, 2018";
        var timeTH_alt_2 = "5:30 PM &#8211; 7:30 PM"
        it("should return the program Date/Time from .html - TownHall Alt 2", function () {
            var result = prodticket.getDateTime(prodticketTH_alt_2, config.programs.townHall);
            expect(result.date).to.equalIgnoreSpaces(dateTH_alt_2);
            expect(result.time).to.equalIgnoreSpaces(timeTH_alt_2);
        });

        it("should return error object with message for missing date/time", function () {
            var result = prodticket.getDateTime(prodticketFail, config.programs.townHall);
            expect(result.message).to.equal("No event date/time found in the prodticket"); 
        });
    });

    /**
     * PROGRAM DETAILS 
     */
    describe("prodticket.getProgramDetails()", function () {
        /*
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>5:30 
                        <span>AM</span>
                    </span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Breakfast &amp; Registration</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            
            <div class="program-title">
                <span>Program</span>
                <span class="program-subtitle">Tuesday, May 2, 2017</span>
            </div>

            Should return object for program details: array of programTimelineObjects each representing info for the above markup.
            // example timeline object 
            programTimeline = {
                schedule: "<span>5:30<span>AM</span></span>",
                infoTitle: "Breakfast &amp; Registration",
                infoSubtitle: ""                 
            }

        */ 
        var programDetailsTH = require('./input/program-details');
        it("should return the Program Details from .html - TownHall", function () {
            var result = prodticket.getProgramDetails(prodticketTH, config.programs.townHall);

            for (var i = 0; i < programDetailsTH.length; i++) {
                expect(result[i].schedule).to.equalIgnoreSpaces(programDetailsTH[i].schedule);
                expect(result[i].infoTitle).to.equalIgnoreSpaces(programDetailsTH[i].infoTitle);
                expect(result[i].infoSubtitle).to.equalIgnoreSpaces(programDetailsTH[i].infoSubtitle);
            }
        });
        var programDetailsTH_alt = require('./input/program-details-alt');
        it("should return the Program Details from .html - TownHall ALT", function () {
            var result = prodticket.getProgramDetails(prodticketTH_alt, config.programs.townHall);
            for (var i = 0; i < programDetailsTH_alt.length; i++) {
                expect(result[i].schedule).to.equalIgnoreSpaces(programDetailsTH_alt[i].schedule);
                expect(result[i].infoTitle).to.equalIgnoreSpaces(programDetailsTH_alt[i].infoTitle);
                expect(result[i].infoSubtitle).to.equalIgnoreSpaces(programDetailsTH_alt[i].infoSubtitle);
            }
        });
        var programDetailsTH_alt_2 = require('./input/program-details-alt-2');
        it("should return the Program Details from .html - TownHall ALT2", function () {
            var result = prodticket.getProgramDetails(prodticketTH_alt_2, config.programs.townHall);
            for (var i = 0; i < programDetailsTH_alt_2.length; i++) {
                expect(result[i].schedule).to.equalIgnoreSpaces(programDetailsTH_alt_2[i].schedule);
                expect(result[i].infoTitle).to.equalIgnoreSpaces(programDetailsTH_alt_2[i].infoTitle);
                expect(result[i].infoSubtitle).to.equalIgnoreSpaces(programDetailsTH_alt_2[i].infoSubtitle);
            }
        });
        it("should return error object with message for missing program details", function () {
            var result = prodticket.getProgramDetails(prodticketFail, config.programs.townHall);
            expect(result.message).to.equal("No program details found in the prodticket"); 
        });
    });

    /**
     * ASSOCIATION DISCLAIMER STATEMENT  
     */
    describe("prodticket.getAssociationDisclaimer()", function () {
        var associationDisclaimerTH = "<p>This is an example Association Disclaimer Statement if there is one it would be in this section of the prodticket.</p>";
        it("should return the program Association Disclaimer Statement from .html - TownHall", function () {
            var result = prodticket.getAssociationDisclaimer(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(associationDisclaimerTH);
        });
        it("should return error object with message for missing association disclaimer statement", function () {
            var result = prodticket.getAssociationDisclaimer(prodticketFail, config.programs.townHall);
            expect(result.message).to.equal("No association disclaimer found in the prodticket"); 
        });
    });

    /**
     * ACTIVITY SF#(s) - PROJECT ID    
     */
    describe("prodticket.getProjectId()", function () {
        // var projectIdCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var projectIdSL = "239054.29";
        var projectIdCC = "239054-50";
        var projectIdFR = "259139.01";
        // var projectIdTH = fs.readFileSync(__dirname + '/input/learning-objectives-th.html').toString();
        

        /* NO SF# For CB and TH Prodtickets */
        // it("should return Project ID from the prodticket .html - Clinical Brief", function () {
        //     var result = prodticket.getProjectId(prodticketCB, config.programs.clinicalBrief);
        //     expect(result).to.equalIgnoreSpaces(projectIdCB); 
        // });

        it("should return Project ID from the prodticket .html - Spotlight", function () {
            var result = prodticket.getProjectId(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(projectIdSL); 
        });

        it("should return Project ID from the prodticket .html - Curbside", function () {
            var result = prodticket.getProjectId(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(projectIdCC); 
        });

        it("should return Project ID from the prodticket .html - First Response", function () {
            var result = prodticket.getProjectId(prodticketFR, config.programs.firstResponse);
            expect(result).to.equalIgnoreSpaces(projectIdFR);
        });

        // it("should return Project ID from the prodticket .html - TownHall", function () {
        //     var result = prodticket.getProjectId(prodticketTH, config.programs.townHall);
        //     expect(result).to.equalIgnoreSpaces(projectIdTH); 
        // });
    });

    /**
     * PRODUCT NAME / PRODUCT TYPE    
     */
    describe("prodticket.getProductType()", function () {
        // var productTypeCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var productTypeSL = "Spotlight";
        var productTypeCC = "Curbside Consult";
        var productTypeFR = "First Response";
        // var productTypeTH = fs.readFileSync(__dirname + '/input/learning-objectives-th.html').toString(); 

        /* No Product Type for CB and TH Prodtickets */
        // it("should return Product Type from the prodticket .html - Clinical Brief", function () {
        //     var result = prodticket.getProductType(prodticketCB, config.programs.clinicalBrief);
        //     expect(result).to.equalIgnoreSpaces(productTypeCB); 
        // });

        it("should return Product Type from the prodticket .html - Spotlight", function () {
            var result = prodticket.getProductType(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(productTypeSL); 
        });

        it("should return Product Type from the prodticket .html - Curbside", function () {
            var result = prodticket.getProductType(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(productTypeCC); 
        });

        it("should return Product Type from the prodticket .html - First Response", function () {
            var result = prodticket.getProductType(prodticketFR, config.programs.firstResponse);
            expect(result).to.equalIgnoreSpaces(productTypeFR);
        });

        // it("should return Product Type from the prodticket .html - TownHall", function () {
        //     var result = prodticket.getProductType(prodticketTH, config.programs.townHall);
        //     expect(result).to.equalIgnoreSpaces(productTypeTH); 
        // });
    });

    /**
     * ARTICLE CONTENT    
     */
    describe("prodticket.getArticleContent()", function () {
        var articleContentTT = fs.readFileSync(__dirname + '/input/article-content-tt.html').toString();

        var articleContentCCTranscript = fs.readFileSync(__dirname + '/input/article-content-cc-transcript.html').toString();

        prodticketCCTranscript = fs.readFileSync(__dirname + '/input/prodticket-cc-transcript.html').toString();

        it("should return article content from the prodticket .html - Test and Teach", function () {
            var result = prodticket.getArticleContent(prodticketTT_902362, config.programs.testAndTeach);
            // fs.writeFileSync(__dirname + '/output/article-content-tt.html', result);
            expect(result).to.equalIgnoreSpaces(articleContentTT);
        });

        it('should return transcript/content from prodticket .html - Curbside', function () {
            config.programs.curbsideConsult.transcriptType = config.transcriptTypes[1];
            var result = prodticket.getArticleContent(prodticketCCTranscript, config.programs.curbsideConsult);
            
            // Reset program settings
            config.programs.curbsideConsult.transcriptType = config.transcriptTypes[0];

            expect(result).to.equalIgnoreSpaces(articleContentCCTranscript);
        });
    });

    /**
     * COLLECTION PAGE INFO     
     */
    describe("prodticket.getCollectionPageInfo()", function () {
        var collectionPageSL =     {
            "title": "Clinical Advances in Anticoagulation Management and Vascular Protection",
            "fileName": "anticoagulation-thrombosis",
            "bannerFileName": "banner-anticoagulation-thrombosis-2017.jpg",
            "type": "Clinical Advances",
            "url": "https://www.medscape.org/sites/advances/anticoagulation-thrombosis"
        };
        var collectionPageCC =     {
            "title": "Clinical Advances in Anticoagulation Management and Vascular Protection",
            "fileName": "anticoagulation-thrombosis",
            "bannerFileName": "banner-anticoagulation-thrombosis-2017.jpg",
            "type": "Clinical Advances",
            "url": "https://www.medscape.org/sites/advances/anticoagulation-thrombosis"
        };
        var collectionPageFR = null;
        var collectionPageTH = {
            "title": "ACS and Beyond: Worldwide Perspectives in Acute and Secondary Prevention",
            "fileName": "acs-and-beyond",
            "bannerFileName": "banner-acs-and-beyond-2017.jpg",
            "type": "Clinical Advances",
            "url": "https://www.medscape.org/sites/advances/acs-and-beyond"
        };
        var collectionPageTT = null; 

        // it("should return Product Type from the prodticket .html - Clinical Brief", function () {
        //     var result = prodticket.getProductType(prodticketCB, config.programs.clinicalBrief);
        //     expect(result).to.equalIgnoreSpaces(productTypeCB); 
        // });

        it("should return the Collection Page Object from the prodticket .html - Spotlight", function () {
            var result = prodticket.getCollectionPage(prodticketSL, config.programs.spotlight);      
            expect(result).to.eql(collectionPageSL); 
        });

        it("should return the Collection Page Object from the prodticket .html - Curbside", function () { 
            var result = prodticket.getCollectionPage(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.eql(collectionPageCC);
        });

        it("should return the Collection Page Object from the prodticket .html - First Response", function () {
            var result = prodticket.getCollectionPage(prodticketFR, config.programs.firstResponse);
            expect(result).to.equal(collectionPageFR);
        });

        it("should return the Collection Page Object from the prodticket .html - TownHall", function () {
            var result = prodticket.getCollectionPage(prodticketTH_alt_2, config.programs.townHall);
            expect(result).to.eql(collectionPageTH); 
        });

        it("should return the Collection Page Object from the prodticket .html - Test and Teach", function () {
            var result = prodticket.getCollectionPage(prodticketTT_902362, config.programs.testAndTeach);
            expect(result).to.equal(collectionPageTT); 
        });
    });
});

