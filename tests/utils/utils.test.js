var fs = require('fs');
var expect = require('chai').expect;

const app = require('../../app');
var utils = app.utils;
const SubsectionElement = app.classes.SubsectionElement;

describe('Utility Functions', function () {

    var xmlJSObject;
    var xmlJSObjectTrimmed;
    var dirtyListHTML = fs.readFileSync(__dirname + '/input/dirty-list.html', 'utf8');

    var dirtySlidesHTML = fs.readFileSync(__dirname + '/input/dirty-slides-html.html', 'utf8');

    var dirtySlidesXML = fs.readFileSync(__dirname + '/input/dirty-slides-xml.html', 'utf8');

    beforeEach(function() {
        // prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        xmlJSObject = require('./input/xml-js-object');
        xmlJSObjectTrimmed = require('./input/xml-js-object-trimmed');
    });
    
    // describe('#getTextBlock()', function () {
    //     var prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
    //     it('should return text between specified start and end RegExp', function () {
    //         console.log(utils.stringOps.getTextBlock(prodticketSL, /&lt;&lt;.*slide 1/g, /&lt;&lt;end slides&gt;&gt;/g));
    //     });
    // });

    describe('#trimObjectText()', function () {
        it('should return trimmed "text" property of JavaScript Object', function () {
            var result = utils.trimObjectText(xmlJSObject)
            // console.log(xmlJSObject);
            expect(result).to.deep.equal(xmlJSObjectTrimmed);
        });
    });

    describe("#cleanHTML.unorderedList()", function () {
        it('should transform list generated by R2Net into proper <ul><li> list.', function () {
            var result = utils.cleanHTML.unorderedList(dirtyListHTML);
            fs.writeFileSync(__dirname + "/output/clean-list.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
        });
    });

    describe("#cleanHTML.slidesInitial()", function () {
        it('should transform Slides HTML from from R2Net into format suitable for initial processing/formatting.', function () {
            var result = utils.cleanHTML.slidesInitial(dirtySlidesHTML);
            fs.writeFileSync(__dirname + "/output/fixed-slides.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
        });
    });

    describe("#cleanHTML.slidesForFinalBuild()", function () {
        it('should transform Slides HTML from from R2Net into format for use in buildSlides().', function () {
            var result = utils.cleanHTML.slidesFinal(dirtySlidesHTML);
            fs.writeFileSync(__dirname + "/output/clean-slides.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
        });
    });

    describe("#formatLearningObjectives()", function () {
        var learningObjectivesCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var learningObjectivesSL = fs.readFileSync(__dirname + '/input/learning-objectives-sl.html').toString();
        var learningObjectivesCC = fs.readFileSync(__dirname + '/input/learning-objectives-cc.html').toString();

        var formattedObjectivesCB = fs.readFileSync(__dirname + '/input/formatted-objectives-cb.html').toString();
        var formattedObjectivesSL = fs.readFileSync(__dirname + '/input/formatted-objectives-sl.html').toString();
        var formattedObjectivesCC = fs.readFileSync(__dirname + '/input/formatted-objectives-cc.html').toString();

        it("should format cleaned learning objectives into format usable by formatList() - Clinical Brief", function () {
            var result = utils.formatLearningObjectives(learningObjectivesCB);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesCB);
        });

        it("should format cleaned learning objectives into format usable by formatList() - Spotlight", function () {
            var result = utils.formatLearningObjectives(learningObjectivesSL);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesSL);
        });

        it("should format cleaned learning objectives into format usable by formatList() - Curbside", function () {
            var result = utils.formatLearningObjectives(learningObjectivesCC);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesCC);
        });
    });

    describe("#buildSlides()", function () {
        it('should transform Slides HTML from from R2Net conversion into JS Object.', function () {
            var subsectionElement = new SubsectionElement(true);
            var result = utils.buildSlides(dirtySlidesXML, subsectionElement, "901/602");
            // fs.writeFileSync(__dirname + "/output/clean-slides.xml", result, function(err) {
            //     if(err) {
            //         return console.log(err);
            //     }
            // }); 
            utils.xmlOps.writeXMLFromObject(result.toObjectLiteral(), __dirname + "/output/clean-slides.xml");
        });
    });
});

