const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../commands');
const utils = app.utils;
const testAndTeach = app.articles.testAndTeach;

describe('Test And Teach', function () {
 
    /*
    GET CONTENT COMPONENTS 
    BUILD TABLE SUBSECTION 
    BUILD FIGURE SUBSECTION 
    BUILD LEVEL 1 SECTION 
    BUILD LEVEL 2 SUBSECTION 
    */ 

    var program; 
    var prodTicket;
    var testProdticket;
    var completeTestAndTeach;
    var contentBlock1;
    var contentBlock2;
    var contentBlock3;
    var contentBlockXML;
    var contentBlockTest;
    var contentBlockTestXML; 
    var mainContentTOCs;
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/test-and-teach/article-902362.html').toString();

        testProdticket = fs.readFileSync(__dirname + '/input/test-and-teach/test-article-907945.html').toString();

        contentBlock1 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-1.html').toString();

        contentBlock2 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-2.html').toString();

        contentBlock3 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-3.html').toString();

        contentBlockXML = fs.readFileSync(__dirname + '/input/test-and-teach/content-block.xml').toString();

        contentBlockTest = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-test.html').toString();

        contentBlockTestXML = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-test.xml').toString();

        completeTestAndTeach = fs.readFileSync(__dirname + '/input/test-and-teach/test-and-teach-902362.xml').toString();

        mainContentTOCs = fs.readFileSync(__dirname + '/input/test-and-teach/main-content-tocs.xml');
        program = app.config.programs.testAndTeach;

    });
    
    /* DONE */
    describe('#getContentBlockObjects()', function () {
        it('should return array of content blocks (markup separated at each Question / new case)', function () {
            // Works
        });
    });

    /* DONE */
    describe('#getTables()', function () {
        xit('should return objects with the contentBlock\'s tables', function () {
            var tables = require('./input/test-and-teach/tables');
            var contentBlock = contentBlock1;
            var result = testAndTeach.getTables(contentBlock, program);
            // console.log("TABLES RESULT: ", result);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(tables[i].label);
                expect(result[i].type).to.equalIgnoreSpaces(tables[i].type);
                expect(utils.cleanHTML.cleanEntities(result[i].textBlock)).to.equalIgnoreSpaces(tables[i].textBlock);
            } 
        });
    });

    /* DONE */
    describe('#getFigures()', function () {
        it('should return objects with the contentBlock\'s figures', function () {
            var figures = require('./input/test-and-teach/figures');
            var contentBlock = contentBlock2;
            var result = testAndTeach.getFigures(contentBlock, program);
            // console.log("FIGURES RESULT: ", result);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(figures[i].label);
                expect(result[i].type).to.equalIgnoreSpaces(figures[i].type);
                expect(result[i].textBlock).to.equalIgnoreSpaces(figures[i].textBlock);
            } 
        });
    });

    /* DONE */
    describe('#getLevelOnes()', function () {
        xit('should return objects with the contentBlock\'s level 1 markup', function () {
            var levelOnes = require('./input/test-and-teach/level-ones-1');
            var contentBlock = contentBlock2;
            var result = testAndTeach.getLevelOnes(contentBlock, program);
            // console.log("RESULT LVL 1: ", result);   
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(levelOnes[i].label);
                expect(result[i].textBlock).to.equalIgnoreSpaces(levelOnes[i].textBlock);
                expect(result[i].type).to.equalIgnoreSpaces(levelOnes[i].type);
            }    
        });

        it('should return objects with the contentBlock\'s level 1 markup - 2', function () {
            var levelOnes = require('./input/test-and-teach/level-ones-2');
            var contentBlock = contentBlock3;
            var result = testAndTeach.getLevelOnes(contentBlock, program);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(levelOnes[i].label);
                expect(result[i].textBlock).to.equalIgnoreSpaces(levelOnes[i].textBlock);
                expect(result[i].type).to.equalIgnoreSpaces(levelOnes[i].type);
            }    
        });
    });

    describe('#getLevelTwos()', function () {
        xit('should return array of objects with properties set for level 1s, level 2s, tables, figures, and QnA #s', function () {
            var levelTwos = require('./input/test-and-teach/level-twos');
            var contentBlock = contentBlock3;
            var result = testAndTeach.getLevelTwos(contentBlock, program);
            // console.log("RESULT LVL2: ", result);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(levelTwos[i].label);
                expect(result[i].textBlock).to.equalIgnoreSpaces(levelTwos[i].textBlock);
                expect(result[i].type).to.equalIgnoreSpaces(levelTwos[i].type);
            }    
        });
    });

    describe('#getContentBlockComponents()', function () {
        xit('should return array of objects with properties set for level 1s, level 2s, tables, figures, and QnA #s', function () {
            var contentBlockComponents = require('./input/test-and-teach/content-block-test').objects;
            var contentBlock = {
                string: contentBlockTest,
                qnaNumber: null
            };
            var result = testAndTeach.getContentBlockComponents(contentBlock, program);
            var qnaNumber = result.qnaNumber;
            result = result.objects;
            // fs.writeFileSync(__dirname + '/output/test-and-teach/block-components.json', JSON.stringify(result, undefined, 2));
            // console.log("RESULT CONTENT BLOCK: ", result);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(contentBlockComponents[i].label);
                expect(utils.cleanHTML.cleanEntities(result[i].textBlock)).to.equalIgnoreSpaces(contentBlockComponents[i].textBlock);
                expect(result[i].type).to.equalIgnoreSpaces(contentBlockComponents[i].type);
            }  
            expect(qnaNumber).to.equal(null);
        });
    });
    
    describe("#buildContentTOC()", function () {
        xit('should take in raw content block string and return TOC element', function () {
            var blockObjects = require('./input/test-and-teach/content-block-test');
            var contentBlockXML = contentBlockTestXML;
            var result = testAndTeach.buildContentTOC(blockObjects, program).toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            result = utils.cleanHTML.cleanEntities(result);
            fs.writeFileSync(__dirname + '/output/test-and-teach/content-toc.xml', result);
            expect(result).to.equalIgnoreSpaces(contentBlockXML);
        });
    });

    describe("#getMainContent()", function () {
        xit("should return TOCs from main content section of prodticket - (no PostAssessment, Blank, Abbreviations, etc.)", function () {
            var ticketHTMl = prodTicket;
            var contentBlockXML = mainContentTOCs;
            var result = testAndTeach.getMainContent(prodTicket, program).mainTOCs;
            var resultString = "";
            for (var i = 0; i < result.length; i++) {
                // console.log("TEST LOOP: ");
                resultString += utils.xmlOps.objectToXMLString(result[i].toObjectLiteral());
            }
            resultString = utils.cleanHTML.cleanEntities(resultString);
            fs.writeFileSync(__dirname + '/output/test-and-teach/main-content-tocs-output.xml', resultString);
            expect(result).to.equalIgnoreSpaces(contentBlockXML);
        });
    });


    describe('printFunctions.printTestAndTeachContent()', function () {
        it('should print content for test and teach using contentBlockComponents', function (done) {
            var contentBlockComponents = require('./input/test-and-teach/content-block-test');
            contentBlockComponents.qnaNumber = 3;
            var mainContent = {
                result: {
                    contentArray: [contentBlockComponents]
                }, 
                printFn: utils.printFunctions.printTestAndTeachContent, printName: "ARTICLE CONTENT"
            };
            
            var result = utils.printFunctions.printTestAndTeachContent(mainContent);
            fs.writeFileSync(__dirname + '/output/test-and-teach/print-result.html', result);
            done();
        });
    });

    describe('buildTestAndTeach()', function () {
        it('should ', function () {
            var result = testAndTeach.buildTestAndTeach(testProdticket, program);

            // var result = testAndTeach.buildTestAndTeach(prodTicket, program);
            result = result.finishedArticleObject.toFinalXML();
            fs.writeFileSync(__dirname + '/output/test-and-teach/final-build-output.xml', result);
        });
    });
});

