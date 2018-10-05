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

    /* TEST GETTERS AND SETTERS FOR TITLE */
    describe('#get/set .titleText', function () {
        it('should set and get title text and return null if no title', function () {
            expect(profArticleInstance.titleText).to.equal(null);

            profArticleInstance.titleText = "Extraordinary Cases of VTE Prevention in Patient with Cancer";

            expect(profArticleInstance.titleText).to.equal('Extraordinary Cases of VTE Prevention in Patient with Cancer');
        });
    });

    describe('#get/set .title', function () {
        it('should set and get title markup and return null if no title', function (done) {
            profArticleInstance.title = "<p>Extraordinary Cases of VTE Prevention in Patient with Cancer</p>";

            // console.log(JSON.stringify(profArticleInstance.toObjectLiteral(), undefined, 2));
            expect(profArticleInstance.title).to.equal('<p>Extraordinary Cases of VTE Prevention in Patient with Cancer</p>');
            done();
        });
    });

    /* TEST GETTERS AND SETTERS FOR BYLINE */
    describe('#get/set .contrbtrBylineText', function () {
        it('should set and get contributor byline text and return null if not set', function () {
            expect(profArticleInstance.contrbtrBylineText).to.equal(null);

            profArticleInstance.contrbtrBylineText = "Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP";

            expect(profArticleInstance.contrbtrBylineText).to.equal('Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP');
        });
    });

    describe('#get/set .contrbtrByline', function () {
        it('should set and get byline markup and return null if no byline', function (done) {
            profArticleInstance.contrbtrByline = "<p>Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP</p>";

            // console.log(JSON.stringify(profArticleInstance.toObjectLiteral(), undefined, 2));
            console.log("BYLINE: ", profArticleInstance.contrbtrByline);
            expect(profArticleInstance.contrbtrByline).to.equal('<p>Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP</p>');
            done();
        });
    });


    /* TEST GETTERS AND SETTERS FOR CONTRIBUTOR POST CONTENT (PEER REVIEWER) */



    /* TEST INSERT METHODS */
    describe('#insertAboveTitleCA() && .aboveTitle', function () {
        it('should insert above_title in CA format, and getter should return XML string of above_title', function (done) {
            
            profArticleInstance.insertAboveTitleCA('Evolving Anticoagulation in AF and VTE', 'evolving-anticoagulation');

            // console.log("ABOVE TITLE", profArticleInstance.aboveTitle);
            // console.log("ELEMENTS: ", profArticleInstance.elements);
            expect(profArticleInstance.aboveTitle).to.equal('<p><a href="/sites/advances/evolving-anticoagulation">Evolving Anticoagulation in AF and VTE</a></p>');
            done();
        });
    });

    // describe('#insertContrbtrPostContent() && .contrbtrPostContent', function () {
    //     it('should set and get contributor post content element and return null if not set', function () {
    //         expect(profArticleInstance.contrbtrPostContent).to.equal(null);

    //         profArticleInstance.insertContrbtrPostContent("Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP");

    //         expect(profArticleInstance.contrbtrByline).to.equal('Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP');
    //     });
    // });

});
