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
    var completeTestAndTeach;
    var contentBlock1;
    var contentBlock2;
    var contentBlock3;
    var contentBlockTest; 
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/test-and-teach/article-902362.html').toString();

        contentBlock1 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-1.html').toString();

        contentBlock2 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-2.html').toString();

        contentBlock3 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-3.html').toString();

        contentBlockTest = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-test.html').toString();

        completeTestAndTeach = fs.readFileSync(__dirname + '/input/test-and-teach/test-and-teach-902362.xml').toString();

        program = app.config.programs.testAndTeach;

    });
    
    /* DONE */
    describe('#getContentBlocks()', function () {
        it('should return array of content blocks (markup separated at each Question / new case)', function () {
            /*
            CALL ORDER: 
            - buildTestAndTeach ()
                - getContentBlocks(ticket) --> contentBlocks 
                - getContentBlockObjects(contentBlocks[i]); --> contentBlockObjects
                    - getTables, getFigures, getLevelOnes
                - Loop through contentBlockObjects to build XML object 
            */ 
            var components = require('./input/test-and-teach/content-components-902362');
        });
    });

    /* DONE */
    describe('#getTables()', function () {
        it('should return objects with the contentBlock\'s tables', function () {
            var tables = require('./input/test-and-teach/tables');
            var contentBlock = contentBlock1;
            var result = testAndTeach.getTables(contentBlock, program);
            // console.log("TABLES RESULT: ", result);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(tables[i].label);
                expect(result[i].type).to.equalIgnoreSpaces(tables[i].type);
                expect(result[i].textBlock).to.equalIgnoreSpaces(tables[i].textBlock);
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
        it('should return objects with the contentBlock\'s level 1 markup', function () {
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
        it('should return array of objects with properties set for level 1s, level 2s, tables, figures, and QnA #s', function () {
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

    describe('#getContentBlockObjects()', function () {
        it('should return array of objects with properties set for level 1s, level 2s, tables, figures, and QnA #s', function () {
            var levelTwos = require('./input/test-and-teach/content-block');
            var contentBlock = contentBlockTest;
            var result = testAndTeach.getContentBlockObjects(contentBlock, program);
            // console.log("RESULT CONTENT BLOCK: ", result);
            for (var i = 0; i < result.length; i++) {
                expect(result[i].label).to.equalIgnoreSpaces(levelTwos[i].label);
                expect(result[i].textBlock).to.equalIgnoreSpaces(levelTwos[i].textBlock);
                expect(result[i].type).to.equalIgnoreSpaces(levelTwos[i].type);
            }  
        });
    });

    describe('#getQNANumber()', function () {
        it('should return QNA form number for the contentBlock', function () {
        });
    }); 
    
    describe("buildContentTOC", function () {
        it('should take in raw content block string and return TOC element', function () {

        });
    });
});

