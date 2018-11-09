// const SubsectionElement = require('../../classes/subsec_element');
const fs = require('fs');
const chai = require('chai');

const app = require('../../commands');
const config = app.config;
const utils = app.utils;
const snippets = app.snippets;

chai.use(require('chai-string'));
let expect = chai.expect;


describe('Snippet Module Functions', function () {
    beforeEach(function() {});

    describe("snippets.downloadablePDF()", function () {
        let downloadablePDFHTML = fs.readFileSync(__dirname + "/input/downloadable-pdf.html");

        it("should return a html snippet for downloadable PDF", function () {
            var result = snippets.downloadablePDF("900219", "For Your Patient", "ForYourPatient.pdf");
            
            expect(result).to.equalIgnoreSpaces(downloadablePDFHTML.toString());
        });
    });

    describe("snippets.forYourPatient()", function () {
        let forYourPatientHTML = fs.readFileSync(__dirname + "/input/for-your-patient.html");

        it("should return a html snippet for PTL pdf (specific to the articleID)", function () {
            var result = snippets.forYourPatient("900219");

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

    describe("snippets.tableOfContents()", function () {
        let components = require('./input/components-fr');
        let tableOfContentsHTML = fs.readFileSync(__dirname + "/input/table-of-contents.html").toString();

        it("should return html snippet for First Response table of contents", function () {
            var result = snippets.tableOfContents(components, "900319");
            result = utils.cleanHTML.cleanEntities(result);
            expect(result).to.equalIgnoreSpaces(tableOfContentsHTML);
        });
    });

    describe("snippets.inLanguage", function () {
        describe("expertCommentary()", function () {
            // var ecGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/ec-german.xml").toString());
            // var ecItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/ec-italian.xml").toString());
            // var ecJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/ec-japanese.xml").toString());

            var ecGerman = (fs.readFileSync(__dirname + "/input/ec-german.xml").toString());
            var ecItalian = (fs.readFileSync(__dirname + "/input/ec-italian.xml").toString());
            var ecJapanese = (fs.readFileSync(__dirname + "/input/ec-japanese.xml").toString());

            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.expertCommentary("900219", config.languages.german, "Test Title");
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                
                result = utils.cleanHTML.cleanEntities(result);
                expect(result).to.equalIgnoreSpaces(ecGerman);
            });

            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.expertCommentary("900219", config.languages.italian, "Test Title");
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                
                result = utils.cleanHTML.cleanEntities(result);
                expect(result).to.equalIgnoreSpaces(ecItalian);
            });
    
            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.expertCommentary("900219", config.languages.japanese, "Test Title");
            //     result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
            //     
            //     result = utils.cleanHTML.cleanEntities(result);
            //     expect(result).to.equalIgnoreSpaces(ecJapanese);
            // });
        });

        describe("downloadablePDF()", function () {
            // var dlpdfGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/dlpdf-german.xml").toString());
            // var dlpdfItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/dlpdf-italian.xml").toString());
            // var dlpdfJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/dlpdf-japanese.xml").toString());

            var dlpdfGerman = (fs.readFileSync(__dirname + "/input/dlpdf-german.xml").toString());
            var dlpdfItalian = (fs.readFileSync(__dirname + "/input/dlpdf-italian.xml").toString());
            var dlpdfJapanese = (fs.readFileSync(__dirname + "/input/dlpdf-japanese.xml").toString());


            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.downloadablePDF("900219", config.languages.german, null); 
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                
                result = utils.cleanHTML.cleanEntities(result);
                expect(result).to.equalIgnoreSpaces(dlpdfGerman);
            });
    
            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.downloadablePDF("900219", config.languages.italian, null);
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                
                result = utils.cleanHTML.cleanEntities(result);
                expect(result).to.equalIgnoreSpaces(dlpdfItalian);
            });

            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.downloadablePDF("900219", config.languages.japanese);
            //     result = utils.trimObjectText(result.toObjectLiteral());
            //     expect(result).to.deep.equal(utils.trimObjectText(dlpdfJapanese));
            // });   
        });

        describe("transcriptPDF()", function () {
            // var tpdfGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/tpdf-german.xml").toString());
            // var tpdfItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/tpdf-italian.xml").toString());
            // var tpdfJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/tpdf-japanese.xml").toString());

            var tpdfGerman = (fs.readFileSync(__dirname + "/input/tpdf-german.xml").toString());
            var tpdfItalian = (fs.readFileSync(__dirname + "/input/tpdf-italian.xml").toString());
            var tpdfJapanese = (fs.readFileSync(__dirname + "/input/tpdf-japanese.xml").toString());


            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.transcriptPDF("900219", config.languages.german, null);
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                
                result = utils.cleanHTML.cleanEntities(result);
                expect(result).to.equalIgnoreSpaces(tpdfGerman);
            });
    
            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.transcriptPDF("900219", config.languages.italian, null);
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                
                result = utils.cleanHTML.cleanEntities(result);
                expect(result).to.equalIgnoreSpaces(tpdfItalian);
            });

            // it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
            //     var result = snippets.inLanguage.transcriptPDF("900219", config.languages.japanese);
            //     result = utils.trimObjectText(result.toObjectLiteral());
            //     expect(result).to.deep.equal(utils.trimObjectText(tpdfJapanese));
            // });   
        });

        describe("subtitles()", function () {
            // var subGerman = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/sub-german.xml").toString());
            // var subItalian = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/sub-italian.xml").toString());
            // var subJapanese = utils.xmlOps.xmlStringToJS(fs.readFileSync(__dirname + "/input/sub-japanese.xml").toString());

            var subGerman = (fs.readFileSync(__dirname + "/input/sub-german.xml").toString());
            var subItalian = (fs.readFileSync(__dirname + "/input/sub-italian.xml").toString());
            var subJapanese = (fs.readFileSync(__dirname + "/input/sub-japanese.xml").toString());

            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - German", function () {
                var result = snippets.inLanguage.subtitles("900219", config.languages.german, null);
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                result = utils.cleanHTML.cleanEntities(result);
                
                expect(result).to.equalIgnoreSpaces(subGerman);
                // result = utils.trimObjectText(result.toObjectLiteral());
                // expect(result).to.deep.equal(utils.trimObjectText(subGerman));
            });
    
            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Italian", function () {
                var result = snippets.inLanguage.subtitles("900219", config.languages.italian, null);
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());
                result = utils.cleanHTML.cleanEntities(result);

                expect(result).to.equalIgnoreSpaces(subItalian);

                // result = utils.trimObjectText(result.toObjectLiteral());
                // expect(result).to.deep.equal(utils.trimObjectText(subItalian));
            });

            it("should return TOCElement with appropriate TOC Type & Label, Section Header, and Slide Intro - Japanese", function () {
                var result = snippets.inLanguage.subtitles("900219", config.languages.japanese, null);
                result = utils.xmlOps.objectToXMLString(result.toObjectLiteral());              
                result = utils.cleanHTML.cleanEntities(result);                
                expect(result).to.equalIgnoreSpaces(subJapanese);
            });   
        });
    });
});

