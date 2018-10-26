const fs = require('fs');
const _ = require("lodash");
const utils = require("../../utils");
const expect = require('chai').expect;

const app = require("../../automation-tool");
const SubsectionElement = app.classes.SubsectionElement;

describe('Subsection Element', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
      6) 
    */

    var subsectionContent;
    var completeSubsection;
    var subsectionInstance;  
    beforeEach(function() {
        // fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        completeSubsection = require('./input/subsection');
        // subsectionContent = require('./input/subsection_content');
        subsectionContent = fs.readFileSync(__dirname + "/input/subsection_content.html").toString(); 
        subsectionInstance = new SubsectionElement();
        subsectionInstance.subsectionHeader = "My Subsection";
    });
    
    describe('#get/set .subsectionContent()', function () {
        it('should merge subsection content into main subsection element', function (done) {
            subsectionInstance.subsectionContent = utils.wrapSubsectionContent(subsectionContent);
            // subsectionInstance.qnaForm = 3;

            // fs.writeFileSync(
            //     __dirname + "/output/insert_subsection_content.json", 
            //     JSON.stringify(subsectionInstance.toObjectLiteral(), undefined, 2), 
            //     function(err) {
            //         if(err) {
            //             return console.log(err);
            //         }
            //     }
            // ); 
            expect(subsectionInstance.toObjectLiteral()).to.deep.equal(completeSubsection);
            done();
        });
    });

});
