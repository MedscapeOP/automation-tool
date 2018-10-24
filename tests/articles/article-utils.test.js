const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../app');
const utils = app.utils;
const articleUtils = app.articles.articleUtils;
const {SubsectionElement, SectionElement, TOCElement, ProfArticle} = app.classes;

describe('Article Utilities', function () {
    /*
    Main functions to test: 
      1) buildBlankTOC 
      2) buildSlidesTOC 
      3) buildEduImpactPreSection
      4) buildEduImpactPostSection
      5) buildLLAPreTOC 
        - requires buildEduImpactPre()
      6) buildLLAPostTOC
        - requires buildEduImpactPost()
      7) buildReferences
      8) buildAbbreviations
    */
    let prodTicket = fs.readFileSync(__dirname + '/input/article-utils/article.html', 'utf8');
    let program = app.config.programs.spotlight;
    var completeBlankTOC; 
    var completeSlidesTOC;
    var completeSlidesTOC2;
    var completeSlidesTOC3;
    var completeEduImpactPre;
    var completeEduImpactPost;
    var completeLLAPreTOC;
    var completeLLAPostTOC;
    var completeCMETestSection;
    var completeReferences;
    var completeAbbreviations;
    
    beforeEach(function() {});

    describe("#buildSlides()", function () {
        var dirtySlidesXML = fs.readFileSync(__dirname + '/input/article-utils/dirty-slides-xml.html', 'utf8');
        it('should transform Slides HTML from from R2Net conversion into JS Object.', function () {
            var subsectionElement = new SubsectionElement(true);
            var result = articleUtils.buildSlides(dirtySlidesXML, subsectionElement, "901/602");
            // fs.writeFileSync(__dirname + "/output/clean-slides.xml", result, function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }
            // }); 
            utils.xmlOps.writeXMLFromObject(result.toObjectLiteral(), __dirname + "/output/article-utils/clean-slides.xml");
        });
    });
    
    
    describe('#buildSlidesTOC()', function () {
        completeSlidesTOC = fs.readFileSync(__dirname + '/input/article-utils/slides-toc.xml').toString();

        completeSlidesTOC2 = fs.readFileSync(__dirname + '/input/article-utils/slides-toc-video-embed.xml').toString();

        completeSlidesTOC3 = fs.readFileSync(__dirname + '/input/article-utils/slides-toc-edu-impact.xml').toString();

        var slidesComponent = app.prodTicket.getSlides(prodTicket, program)[0];

        it('should return Slides TOC', function () {
            var result = articleUtils.buildSlidesTOC(slidesComponent).toObjectLiteral();
            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            expect(result).to.equalIgnoreSpaces(completeSlidesTOC);
        });

        it('should return Slides TOC with a video embed in subsection slide intro', function () {
            var result = articleUtils.buildSlidesTOC(slidesComponent, videoEmbed=true).toObjectLiteral();
            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            expect(result).to.equalIgnoreSpaces(completeSlidesTOC2);
        });

        it('should return Slides TOC with an educational impact challenge subsection', function () {
            var result = articleUtils.buildSlidesTOC(slidesComponent, false, true).toObjectLiteral();
            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));
            expect(result).to.equalIgnoreSpaces(completeSlidesTOC3);
        });
    });
                    
    describe('#buildBlankTOC()', function () {
        completeBlankTOC = fs.readFileSync(__dirname + "/input/article-utils/blank-toc.xml").toString();

        it('should return TOC with a section and a subsection with no text content', function () {
            var result = articleUtils.buildBlankTOC().toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeBlankTOC);
        });
    });

    describe('#buildEduImpactPreSection()', function () {
        completeEduImpactPre = fs.readFileSync(__dirname + '/input/article-utils/edu-impact-pre.xml').toString();

        it('should output TOC element - section header: EDU impact, slide intro: goal statement', function () {
            var goalStatement = app.prodTicket.getGoalStatement(prodTicket, program);
            var result = articleUtils.buildEduImpactPreSection(3, goalStatement).toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeEduImpactPre);
        });
    });

    describe('#buildEduImpactPostSection()', function () {
        completeEduImpactPost = fs.readFileSync(__dirname + '/input/article-utils/edu-impact-post.xml').toString();

        it('should output TOC element - section header: EDU impact, slide: qna form number', function () {
            var result = articleUtils.buildEduImpactPostSection(4).toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeEduImpactPost);
        });
    });

    describe('#buildLLAPreTOC()', function () {
        completeLLAPreTOC = fs.readFileSync(__dirname + '/input/article-utils/lla-pre-toc.xml').toString();

        it('should return LLA-Pre TOC', function () {
            var goalStatement = app.prodTicket.getGoalStatement(prodTicket, program);
            var result = articleUtils.buildLLAPreTOC(goalStatement).toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeLLAPreTOC);
        });
    });

    describe('#buildLLAPostTOC()', function () {
        completeLLAPostTOC = fs.readFileSync(__dirname + '/input/article-utils/lla-post-toc.xml').toString();

        it('should return LLA-Post TOC', function () {
            var result = articleUtils.buildLLAPostTOC().toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeLLAPostTOC);
        });
    });

    describe('#buildReferences()', function () {
        completeReferences = fs.readFileSync(__dirname + '/input/article-utils/references.xml').toString();

        it('should return References TOC', function () {
            var referencesMarkup = app.prodTicket.getReferences(prodTicket, program);
            var result = articleUtils.buildReferences(referencesMarkup, program).toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeReferences);
        });
    });

    describe('#buildAbbreviations()', function () {
        completeAbbreviations = fs.readFileSync(__dirname + '/input/article-utils/abbreviations.xml').toString();

        it('should return Abbreviations TOC', function () {
            var abbreviationsMarkup = app.prodTicket.getAbbreviations(prodTicket, program);
            console.log("ABBRV MARKUP: ", abbreviationsMarkup);
            var result = articleUtils.buildAbbreviations(abbreviationsMarkup, program).toObjectLiteral();
            result = utils.xmlOps.objectToXMLString(result);
            expect(result).to.equalIgnoreSpaces(completeAbbreviations);
        });
    });
});

