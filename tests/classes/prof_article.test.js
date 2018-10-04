const ProfArticle = require("../../classes/prof_article");
const TOCElement = require('../../classes/toc_element');
const fs = require('fs');
const _ = require("lodash");
const utils = require("../../utils");
const expect = require('chai').expect;


describe('Prof Article Element', function () {
    /*
    Main sections to test: 
    - Test elements getter 
    */
   var profArticleInstance; 
    beforeEach(function() {
        // fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        // sectionText = require('./input/section_text'); 
        // completeProfArticle = require('./input/slide_group');
        profArticleInstance = new ProfArticle();
    });
    
    describe('.elements', function () {
        it('should flatten sub-arrays into the main elements array', function (done) {
            var tocInstance1 = new TOCElement("TOC1");
            var tocInstance2 = new TOCElement("TOC2");
            var tocInstance3 = new TOCElement("TOC3");
            profArticleInstance.insertTOCElement(tocInstance1);
            profArticleInstance.insertTOCElement(tocInstance2);
            profArticleInstance.insertTOCElement(tocInstance3);

            // console.log("ELEMENTS: ", profArticleInstance.elements);
            // expect(profArticleInstance.toObjectLiteral()).to.deep.equal(completeProfArticle);
            done();
        });
    });


    describe('insertAboveTitleCA() && .aboveTitle', function () {
        it('should insert above_title in CA format, and getter should return XML string of above_title', function (done) {
            
            profArticleInstance.insertAboveTitleCA('Evolving Anticoagulation in AF and VTE', 'evolving-anticoagulation');

            // console.log("ABOVE TITLE", profArticleInstance.aboveTitle);
            // console.log("ELEMENTS: ", profArticleInstance.elements);
            expect(profArticleInstance.aboveTitle).to.equal('<a href="/sites/advances/evolving-anticoagulation">Evolving Anticoagulation in AF and VTE</a>');
            done();
        });
    });

});
