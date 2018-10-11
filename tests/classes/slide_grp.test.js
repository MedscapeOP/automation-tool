const SlideGroup = require("../../classes/slide_grp");
const fs = require('fs');
const _ = require("lodash");
const utils = require("../../utils");
const expect = require('chai').expect;


describe('Slide Group Element', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
      6) 
    */

    var sectionText;
    var completeSlideGroup;
    var slideGroupInstance;  
    beforeEach(function() {
        // fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        sectionText = require('./input/section_text'); 
        completeSlideGroup = require('./input/slide_group');
        slideGroupInstance = new SlideGroup("896/814", 6);
    });
    
    describe('#insertSectionText()', function () {
        it('should merge subsection content into main subsection element', function (done) {
            slideGroupInstance.sectionText = sectionText;
            // slideGroupInstance.qnaForm = 3;

            // fs.writeFileSync(
            //     __dirname + "/output/insert_section_text.json", 
            //     JSON.stringify(slideGroupInstance.toObjectLiteral(), undefined, 2), 
            //     function(err) {
            //         if(err) {
            //             return console.log(err);
            //         }
            //     }
            // ); 
            expect(slideGroupInstance.toObjectLiteral()).to.deep.equal(completeSlideGroup);
            done();
        });
    });

});
