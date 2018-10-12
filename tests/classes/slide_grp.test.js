const fs = require('fs');
const expect = require('chai').expect;
// const _ = require("lodash");


const app = require('../../app');
const SlideGroup = app.classes.SlideGroup;
const utils = app.utils;


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
        // sectionText = require('./input/section_text');
        sectionText = fs.readFileSync(__dirname + "/input/section_text.html").toString(); 
        completeSlideGroup = require('./input/slide_group');
        slideGroupInstance = new SlideGroup("896/814", 6);
    });
    
    describe('#insertSectionText()', function () {
        it('should merge subsection content into main subsection element', function () {
            slideGroupInstance.sectionText = `<sec_txt>${sectionText}</sec_txt>`;
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
            var result = utils.trimObjectText(slideGroupInstance.toObjectLiteral());
            expect(result).to.deep.equal(completeSlideGroup);
            // done();
        });
    });

});
