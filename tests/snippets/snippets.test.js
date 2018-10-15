// const SubsectionElement = require('../../classes/subsec_element');
const fs = require('fs');
const chai = require('chai');

const app = require('../../app');
const config = app.config;
const utils = app.utils;
const snippets = app.snippets;

chai.use(require('chai-string'));
let expect = chai.expect;


describe('Snippet Module Functions', function () {
    // beforeEach(function() {});

    describe("snippets.forYourPatient()", function () {
        let forYourPatientHTML = fs.readFileSync(__dirname + "/input/for-your-patient.html");

        it("should return a html snippet for PTL pdf (specific to the articleID)", function () {
            var result = snippets.forYourPatient("900219", "For Your Patient", "ForYourPatient.pdf");
            expect(result).to.equalIgnoreSpaces(forYourPatientHTML.toString());
        });
    });

    describe("snippets.downloadableSlides()", function () {
        let downloadableSlidesHTML = fs.readFileSync(__dirname + "/input/downloadable-slides.html");

        it("should return a html snippet for downloadable slides (specific to the articleID)", function () {
            var result = snippets.downloadableSlides("900219");
            expect(result).to.equalIgnoreSpaces(downloadableSlidesHTML.toString());
        });
    });

    describe("snippets.inLanguage", function () {
        describe("expertCommentary()", function () {
            // var ecGerman = utils.xmlOps.objectToXMLString(utils.xmlOps.xmlFileToJS(__dirname + "/input/ec-german.xml"));
            // var ecJapanese = utils.xmlOps.objectToXMLString(utils.xmlOps.xmlFileToJS(__dirname + "/input/ec-japanese.xml"));
            // var ecItalian = utils.xmlOps.objectToXMLString(utils.xmlOps.xmlFileToJS(__dirname + "/input/ec-italian.xml"));

            var ecGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/ec-german.xml").toString());
            var ecItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/ec-italian.xml").toString());
            var ecJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/ec-japanese.xml").toString());

            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.expertCommentary("900219", config.languages.german, "Test Title");
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(ecGerman));
            });

            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.expertCommentary("900219", config.languages.italian, "Test Title");
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(ecItalian));
            });
    
            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.expertCommentary("900219", config.languages.japanese, "Test Title");
            //     result = utils.trimObjectText(result.toObjectLiteral());
            //     expect(result).to.deep.equal(utils.trimObjectText(ecJapanese));
            //     // result = utils.xmlOps.objectToXMLString(utils.trimObjectText(result.toObjectLiteral()));
            //     // expect(result).to.equalIgnoreSpaces(ecJapanese);
            // });
        });

        describe("downloadablePDF()", function () {
            var dlpdfGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/dlpdf-german.xml").toString());
            var dlpdfItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/dlpdf-italian.xml").toString());
            var dlpdfJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/dlpdf-japanese.xml").toString());


            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.downloadablePDF("900219", config.languages.german);
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(dlpdfGerman));
            });
    
            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.downloadablePDF("900219", config.languages.italian);
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(dlpdfItalian));
            });

            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.downloadablePDF("900219", config.languages.japanese);
            //     result = utils.trimObjectText(result.toObjectLiteral());
            //     expect(result).to.deep.equal(utils.trimObjectText(dlpdfJapanese));
            // });   
        });

        describe("transcriptPDF()", function () {
            var tpdfGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/tpdf-german.xml").toString());
            var tpdfItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/tpdf-italian.xml").toString());
            var tpdfJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/tpdf-japanese.xml").toString());


            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.transcriptPDF("900219", config.languages.german);
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(tpdfGerman));
            });
    
            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.transcriptPDF("900219", config.languages.italian);
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(tpdfItalian));
            });

            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.transcriptPDF("900219", config.languages.japanese);
            //     result = utils.trimObjectText(result.toObjectLiteral());
            //     expect(result).to.deep.equal(utils.trimObjectText(tpdfJapanese));
            // });   
        });

        describe("subtitles()", function () {
            var subGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/sub-german.xml").toString());
            var subItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/sub-italian.xml").toString());
            var subJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/sub-japanese.xml").toString());


            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.subtitles("900219", config.languages.german);
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(subGerman));
            });
    
            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.subtitles("900219", config.languages.italian);
                result = utils.trimObjectText(result.toObjectLiteral());
                expect(result).to.deep.equal(utils.trimObjectText(subItalian));
            });

            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.subtitles("900219", config.languages.japanese);
            //     result = utils.trimObjectText(result.toObjectLiteral());
            //     expect(result).to.deep.equal(utils.trimObjectText(subJapanese));
            // });   
        });
    });
});

