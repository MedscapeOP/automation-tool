const fs = require('fs');
const _ = require("lodash");
const expect = require('chai').expect;

const app = require('../../app');
const utils = app.utils;
const clinicalBrief = app.clinicalBrief;

describe('Clinical Brief', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
      6) 
    */

    var prodTicket;
    var completeClinicalContext;
    var completeStudySynopsis;
    var completeStudyHighlights;
    var completeClinicalImplications;
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeClinicalContext = require('./input/clinical-context');
        completeStudySynopsis = require('./input/study-synopsis');
        // completeStudyHighlights = require('./input/study-highlights');
        // completeClinicalImplications = require('./input/clinical-implications');
    });
    
    describe('#getClinicalContext()', function () {
        it('should return clinical context as JavaScript object', function () {
            var result = clinicalBrief.getClinicalContext(prodTicket).toObjectLiteral().elements[0];
            // fs.writeFileSync(
            //     __dirname + "/output/clinical-context.json", 
            //     JSON.stringify(utils.trimObjectText(result), undefined, 2), 
            //     function(err) {
            //         if(err) {
            //             return console.log(err);
            //         }
            //     }
            // ); 
            expect(utils.trimObjectText(result)).to.deep.equal(utils.trimObjectText(completeClinicalContext));
        });
    });
    
    describe('#getSynopsisAndPerspective()', function () {
      it('should return synopsis and perspective as JavaScript object', function () {
          var result = clinicalBrief.getSynopsisAndPerspective(prodTicket).toObjectLiteral().elements[0];
          expect(utils.trimObjectText(result)).to.deep.equal(utils.trimObjectText(completeStudySynopsis));
      });
    });

});

