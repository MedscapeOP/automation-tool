const fs = require('fs');
const _ = require("lodash");
const utils = require("../../utils");
const chai = require('chai');
chai.use(require('chai-string'));
let expect = chai.expect;

const app = require("../../commands");
const { TOCElement, SectionElement, SubsectionElement } = app.classes;

describe('TOC Element', function () {
    /*
    Main sections to test: 
      1) Clinical Context 
      2) Synopsis and Perspective 
      3) Study Highlights
      4) Clinical Implications 
      5) Contributor Byline 
      6) 
    */

    var completeTOC;
    var completeSubsection;
    beforeEach(function () {
        completeTOC = fs.readFileSync(__dirname + '/input/toc_element.xml', 'utf8').toString();
        // completeSubsection = require('./input/subsection');
        // // subsectionContent = require('./input/subsection_content');
        // subsectionContent = fs.readFileSync(__dirname + "/input/subsection_content.html").toString(); 
        // subsectionInstance = new SubsectionElement();
        // subsectionInstance.subsectionHeader = "My Subsection";
    });

    describe('.insertSectionElement()', function () {
        it('should insert new section element into TOC', function () {
            var sectionInstance = new SectionElement();
            var subsectionInstance = new SubsectionElement(false, true, false);

            sectionInstance.insertSubsectionElement(subsectionInstance);

            var sectionInstance2 = new SectionElement();
            var subsectionInstance2 = new SubsectionElement(false, true, false);

            sectionInstance2.insertSubsectionElement(subsectionInstance2);

            var tocInstance = new TOCElement();
            tocInstance.insertSectionElement(sectionInstance);
            // tocInstance.insertSectionElement(sectionInstance2);

            var result = utils.xmlOps.objectToXMLString(tocInstance.toObjectLiteral());

            expect(result).to.equalIgnoreSpaces(completeTOC)
        });
    });

});