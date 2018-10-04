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
            profArticleInstance.insertTOCElement(tocInstance1.toObjectLiteral());
            profArticleInstance.insertTOCElement(tocInstance2.toObjectLiteral());
            profArticleInstance.insertTOCElement(tocInstance3.toObjectLiteral());

            console.log("ELEMENTS: ", profArticleInstance.elements);
            // expect(profArticleInstance.toObjectLiteral()).to.deep.equal(completeProfArticle);
            done();
        });
    });

});
