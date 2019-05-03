const fs = require('fs');
const _ = require("lodash");
const expect = require('chai').expect;

const app = require('../../commands');
const ProfArticle = app.classes.ProfArticle;
const TOCElement = app.classes.TOCElement;
const utils = app.utils;


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
    describe('#get/set .title', function () {
        it('should set and get title markup and return null if no title', function (done) {
            profArticleInstance.title = null;
            profArticleInstance.title = "Extraordinary Cases of VTE Prevention in Patient with Cancer";

            // console.log(JSON.stringify(profArticleInstance.toObjectLiteral(), undefined, 2));
            expect(profArticleInstance.title).to.equal('Extraordinary Cases of VTE Prevention in Patient with Cancer');
            done();
        });
    });

    /* TEST GETTERS AND SETTERS FOR BYLINE */
    describe('#get/set .contrbtrByline', function () {
        it('should set and get byline markup and return null if no byline', function (done) {
            expect(profArticleInstance.contrbtrByline).to.equal(null);

            profArticleInstance.contrbtrByline = "Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP";

            expect(profArticleInstance.contrbtrByline).to.equal('Mark A. Crowther, MD; Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP');
            done();         
        });
    });


    /* TEST GETTERS AND SETTERS FOR CONTRIBUTOR POST CONTENT (PEER REVIEWER) */
    describe('#get/set .contrbtrPostContent', function () {
        it('should set and get post content markup and return null if no peer reviewer', function (done) {
            profArticleInstance.contrbtrPostContent = "<div><h3>Peer Reviewer</h3><p>Reviewer Disclosure<br/>Served as a consultant for: Abbot; Heartware ; Medtronic; Thoratec;</p></div>";

            expect(profArticleInstance.contrbtrPostContent).to.equal('<h3>Peer Reviewer</h3><p>Reviewer Disclosure<br/>Served as a consultant for: Abbot; Heartware ; Medtronic; Thoratec;</p>');
            done();
        });
    });


    /* TEST GETTERS AND SETTERS FOR BANNER IMAGE (PEER REVIEWER) */
    describe('#get/set .bannerImage', function () {
        it('should set and get bannerImage by inputting filename and return null if no image set', function (done) {
            profArticleInstance.bannerImage = "banner-evolving-anticoagulation-2017.jpg";

            // console.log("BANNER IMAGE: ", profArticleInstance.bannerImage);
            // expect(profArticleInstance.bannerImage).to.equal('/webmd/professional_assets/medscape/images/title_background/banner-evolving-anticoagulation-2017.jpg?interpolation=lanczos-none&resize=1240:600');
            expect(profArticleInstance.bannerImage).to.equal('/webmd/professional_assets/medscape/images/title_background/banner-evolving-anticoagulation-2017.jpg');
            done();
        });
    });


    /* TEST INSERT METHODS */
    describe('#insertAboveTitleCA() && .aboveTitle', function () {
        it('should insert above_title in CA format, and getter should return XML string of above_title', function (done) {
            var collectionPageObject = {
                "title": "Evolving Anticoagulation in AF and VTE",
                "fileName": "evolving-anticoagulation",
                "bannerFileName": "banner-evolving-anticoagulation-2017.jpg",
                "type": "Clinical Advances",
                "url": "https://www.medscape.org/sites/advances/evolving-anticoagulation"
            };

            profArticleInstance.insertAboveTitleCollection(collectionPageObject);

            // console.log("ABOVE TITLE", profArticleInstance.aboveTitle);
            // console.log("ELEMENTS: ", profArticleInstance.elements);
            expect(profArticleInstance.aboveTitle).to.equal('<p><a href="/sites/advances/evolving-anticoagulation">Evolving Anticoagulation in AF and VTE</a></p>');
            done();
        });
    });
});
