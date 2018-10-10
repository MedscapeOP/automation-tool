// const SubsectionElement = require('../../classes/subsec_element');
const fs = require('fs');
const utils = require("../../utils");
const prodticket = require("../../prodticket");
const chai = require('chai');
const config = require('../../config');

chai.use(require('chai-string'));
let expect = chai.expect;


describe('Prodticket Module Functions', function () {

    let prodticketCB;
    let prodticketCC;
    let prodticketSL;


    beforeEach(function() {
        prodticketCB = fs.readFileSync(__dirname + '/input/prodticket-cb.html').toString();
        prodticketCC = fs.readFileSync(__dirname + '/input/prodticket-cc.html').toString();      
        prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
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
            console.log("RESULT: ", result);
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
            expect(result).to.equal(peerReviewerSL);
        });

        // it("should return the program peer reviewer statement from .html - Curbside", function () {
        //     var result = prodticket.getPeerReviewer(prodticketCC, config.programs.curbsideConsult);
        //     expect(result).to.equalIgnoreSpaces(peerReviewerCC);
        // });
    });
});

