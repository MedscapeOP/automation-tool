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
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/test-and-teach/article-902362.html').toString();

        contentBlock1 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-1.html').toString();

        contentBlock2 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-2.html').toString();

        contentBlock3 = fs.readFileSync(__dirname + '/input/test-and-teach/content-block-3.html').toString();

        completeTestAndTeach = fs.readFileSync(__dirname + '/input/test-and-teach/test-and-teach-902362.xml').toString();

        program = app.config.programs.testAndTeach;

    });
    
    describe('#getContentComponents()', function () {
        it('should return array of objects with properties set for level 1s, level 2s, tables, figures, and QnA #s', function () {
            var components = require('./input/test-and-teach/content-components-902362');
        });
    });

    // describe('#getTables()', function () {
    //     it('should return objects with the contentBlock\'s tables', function () {
    //         var tables = require('./input/test-and-teach/tables');
    //         var contentBlock = contentBlock1;
    //         var result = testAndTeach.getTables(contentBlock, program);
    //     });
    // });

    // describe('#getFigures()', function () {
    //     it('should return objects with the contentBlock\'s figures', function () {
    //     });
    // });

    describe('#getLevelOnes()', function () {
        it('should return objects with the contentBlock\'s level 1 markup', function () {
            var levelOnes = require('./input/test-and-teach/levelOnes-1');
            var contentBlock = contentBlock2;
            var result = testAndTeach.getLevelOnes(contentBlock, program);
        });

        it('should return objects with the contentBlock\'s level 1 markup - 2', function () {
            var levelOnes = require('./input/test-and-teach/levelOnes-2');
            var contentBlock = contentBlock3;
            var result = testAndTeach.getLevelOnes(contentBlock, program);
        });
    });

    describe('#getLevelTwos()', function () {
        it('should return objects with the contentBlock\'s level 2 markup', function () {
            var levelTwos = require('./input/test-and-teach/levelTwos-1');
            var contentBlock = contentBlock2;
            var result = testAndTeach.getLevelTwos(contentBlock, program);
        });

        it('should return objects with the contentBlock\'s level 2 markup', function () {
            var levelTwos = require('./input/test-and-teach/levelTwos-2');
            var contentBlock = contentBlock3;
            var result = testAndTeach.getLevelTwos(contentBlock, program);
        });
    });

    describe('#getQNANumber()', function () {
        it('should return QNA form number for the contentBlock', function () {
        });
    });    
});

