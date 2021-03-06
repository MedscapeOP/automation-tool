var fs = require('fs');
const chai = require('chai');

const app = require('../../commands');
var utils = app.utils;
const SubsectionElement = app.classes.SubsectionElement;

chai.use(require('chai-string'));
let expect = chai.expect;

describe('Utility Functions', function () {

    var xmlJSObject;
    var xmlJSObjectTrimmed;
    var dirtyListHTML = fs.readFileSync(__dirname + '/input/dirty-list.html', 'utf8');
    var dirtySlidesHTML = fs.readFileSync(__dirname + '/input/dirty-slides-html.html', 'utf8');
    var dirtySlidesHTML2 = fs.readFileSync(__dirname + '/input/dirty-slides-html2.html', 'utf8');

    var slidesInitialComplete = fs.readFileSync(__dirname + '/input/slides-initial-complete.html', 'utf8').toString();
    var slidesFinalComplete = fs.readFileSync(__dirname + '/input/slides-final-complete.html', 'utf8').toString();

    var testAndTeachTicket = fs.readFileSync(__dirname + '/../prodticket/input/prodticket-tt-902362.html').toString();

    beforeEach(function() {
        // prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        xmlJSObject = require('./input/xml-js-object');
        xmlJSObjectTrimmed = require('./input/xml-js-object-trimmed');
    });
    
    describe('#getTextBlock()', function () {
        var prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
        var textBlock = require('./input/textblock');
        it('should return text between specified start and end RegExp', function () {
            var result = utils.stringOps.getTextBlock(prodticketSL, /&lt;&lt;.*slide 1/g, /&lt;&lt;end slides&gt;&gt;/g);
            // fs.writeFileSync(__dirname + '/output/textblock.js', JSON.stringify(result, undefined, 2));
            expect(result.label).to.equalIgnoreSpaces(textBlock.label);
            expect(result.textBlock).to.equalIgnoreSpaces(textBlock.textBlock);
            expect(result.startIndex).to.equal(textBlock.startIndex);
            expect(result.endIndex).to.equal(textBlock.endIndex);
        });

    });

    describe('utils.trimObjectText()', function () {
        it('should return trimmed "text" property of JavaScript Object', function () {
            var result = utils.trimObjectText(xmlJSObject)
            // console.log(xmlJSObject);
            expect(result).to.deep.equal(xmlJSObjectTrimmed);
        });
    });

    describe('utils.stringOps.removeFromRegexCapture()', function () {
        it('should remove a regex string ONLY within a specified regex match', function () {
            var h3RegExp = new RegExp('<h3>(.*)</h3>', 'g');
            var strongRegExp = new RegExp('<strong>|</strong>', 'g');            
            var testString = `
                <h3><strong>Stuff</strong></h3>
                <strong>MORE</strong>
                Other
                <h3><strong>Stuff</strong></h3>
            `;
            var completeString = `
                <h3>Stuff</h3>
                <strong>MORE</strong>
                Other
                <h3>Stuff</h3>
            `;
            var result = utils.stringOps.removeFromRegexCapture(
                testString,
                h3RegExp,
                strongRegExp
            );
            expect(result).equalIgnoreSpaces(completeString);
        });
    });

    describe("utils.formatLearningObjectives()", function () {
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

    describe('utils.formatQNAObjectives()', function () {
        var qnaObjectivesCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var qnaObjectivesSL = fs.readFileSync(__dirname + '/input/learning-objectives-sl.html').toString();
        var qnaObjectivesCC = fs.readFileSync(__dirname + '/input/learning-objectives-cc.html').toString();
    
        var formattedObjectivesCB = fs.readFileSync(__dirname + '/input/qna-objectives-cb.html').toString();
        var formattedObjectivesSL = fs.readFileSync(__dirname + '/input/qna-objectives-sl.html').toString();
        var formattedObjectivesCC = fs.readFileSync(__dirname + '/input/qna-objectives-cc.html').toString();

        it("Should format learning objectives into a format suitable for QNA eval form - CB", function () {
            var result = utils.formatQNAObjectives(qnaObjectivesCB);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesCB);
        });

        it("Should format learning objectives into a format suitable for QNA eval form - CC", function () {
            var result = utils.formatQNAObjectives(qnaObjectivesCC);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesCC);
        });

        it("Should format learning objectives into a format suitable for QNA eval form - SL", function () {
            var result = utils.formatQNAObjectives(qnaObjectivesSL);
            expect(result).to.equalIgnoreSpaces(formattedObjectivesSL);
        });
    });

    describe("utils.cleanHTML", function () {
        describe(".unorderedList()", function () {

            xit('should transform list generated by R2Net into proper <ul><li> list.', function () {

            });
        });
    
        describe(".slidesInitial()", function () {
            it('should transform Slides HTML from from R2Net into format suitable for initial processing/formatting.', function () {
                var result = utils.cleanHTML.slidesInitial(dirtySlidesHTML);
                // fs.writeFileSync(__dirname + "/output/fixed-slides.html", result, function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                // }); 
                expect(result).to.equalIgnoreSpaces(slidesInitialComplete);
            });
        });
    
        describe(".slidesFinal()", function () {
            it('should transform Slides HTML from from R2Net into format for use in buildSlides().', function () {
                var result = utils.cleanHTML.slidesFinal(slidesInitialComplete);
                // fs.writeFileSync(__dirname + "/output/clean-slides.html", result, function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                // }); 
                expect(result).to.equalIgnoreSpaces(slidesFinalComplete);
            });
        });

        describe(".slidesInitial() + .slidesFinal()", function () {
            var completeString = fs.readFileSync(__dirname + '/input/clean-list.html').toString();
            it('should fully format dirty slides HTML', function () {
                var result = utils.cleanHTML.slidesInitial(dirtyListHTML);
                // fs.writeFileSync(__dirname + "/output/clean-list-initial.html", result, function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                // }); 
                result = utils.cleanHTML.slidesFinal(result);
                // fs.writeFileSync(__dirname + "/output/clean-list.html", result, function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                // }); 
                expect(result).to.equalIgnoreSpaces(completeString);
            });
        });
    });

    describe('utils.stringOps.getAllBlocksInOrder()', function () {
        var completeString = fs.readFileSync(__dirname + '/input/get-all-blocks.html').toString();

        it('should get all matching substrings of text using arrays of regular expressions', function () {
            var startRegexps = [
                /<strong>Content/g,
                // /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
                /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi,
                /.*Case \d Conclusion<\/strong>/gi,
                /level 2&gt;&gt;.*Discussion/gi
            ];

            var endRegexps = [
                /(?:<strong>){0,}Answer Explanation (?:&#953;){0,}:.*/g,
                /.*Answer Explanation:.*/g,
                // /.*Case \d Conclusion<\/strong>/gi,
                /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
                /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi
            ];
            /* 
                TYPES OF BLOCKS 
                CONTENT --> Question (Include end)

                discussion --> Question (Include end)

                discussion --> New Case (Include end)

                New Case --> Question (Include end)
            */
            var {textBlock} = utils.stringOps.getTextBlock(testAndTeachTicket, /<strong>Content/g, /<strong>Abbreviations/g, false, true);

            var result = utils.stringOps.getAllBlocksInOrder(textBlock, startRegexps, endRegexps);

            // console.log("RESULT: ", result);

            var resultString = "";
            for(var i = 0; i < result.length; i++) {
                resultString += "\n\n\n-----------TOC ELEMENT # " + (i+1) + " " + result[i].textBlock;
            }
            // fs.writeFileSync(__dirname + '/output/get-all-blocks.html', resultString);
            expect(resultString).equalIgnoreSpaces(completeString);
        });
    });

    describe('utils.stringOps.sliceAtBreakpoints()', function () {
        var completeString = fs.readFileSync(__dirname + '/input/slice-at-breakpoints.html').toString();
        
        it('should create substrings using the supplied array of breakpoints.', function () {
            // var breakpoints = [
            //     /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
            //     /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi,
            //     /(?:<strong>){0,}Answer Explanation (?:&#953;){0,}:.*/g,
            //     /.*Answer Explanation:.*/g,
            // ];

            var breakpoints = [
                {
                    symbol: /(?:&lt;){1,}level 1(?:&gt;){1,}.*Case \d:.*/gi,
                    inclusive: true
                },
                {
                    symbol: /&lt;&lt;level 1&gt;&gt;.*Case \d:.*/gi, 
                    inclusive: true
                },
                {
                    symbol: /(?:<strong>){0,}Answer Explanation (?:&#953;){0,}:.*/g,
                    inclusive: false
                },
                {
                    symbol: /.*Answer Explanation:.*/g, 
                    inclusive: false
                }
            ];

            /* 
                POSSIBLE BREAKPOINTS  
                --> Question Start
                --> Question End (Answer Explanation) 
                --> New Case                 
            */
            var {textBlock} = utils.stringOps.getTextBlock(testAndTeachTicket, /<strong>Content/g, /<strong>Abbreviations/g, false, true);

            var result = utils.stringOps.sliceAtBreakpoints(textBlock, breakpoints);

            var resultString = "";
            for(var i = 0; i < result.length; i++) {
                resultString += "\n\n\n-----------BREAK # " + (i+1) + " " + result[i];
            }
            // fs.writeFileSync(__dirname + '/output/slice-at-breakpoints.html', resultString);
            expect(resultString).equalIgnoreSpaces(completeString);
        });
    });

    describe('utils.cleanHTML.transcript()', function () {
        var dirtyTranscriptCCLLA = fs.readFileSync(__dirname + './../prodticket/input/article-content-cc-transcript-lla.html').toString();
        var dirtyTranscriptFRLLA = fs.readFileSync(__dirname + './../prodticket/input/article-content-fr-transcript-lla.html').toString();
        var dirtyTranscriptSL = fs.readFileSync(__dirname + './../prodticket/input/article-content-sl-transcript.html').toString();
        var dirtyTranscriptTH = fs.readFileSync(__dirname + './../prodticket/input/article-content-th-transcript.html').toString();

        var cleanStringCC = fs.readFileSync(__dirname + '/input/clean-transcript-cc.html').toString();
        var cleanStringFR = fs.readFileSync(__dirname + '/input/clean-transcript-fr.html').toString();
        var cleanStringSL = fs.readFileSync(__dirname + '/input/clean-transcript-sl.html').toString();
        var cleanStringTH = fs.readFileSync(__dirname + '/input/clean-transcript-th.html').toString(); 

        it('should clean and format transcript from HTML prodticket - Curbside LLA', function () {
            var resultString = utils.cleanHTML.transcript(dirtyTranscriptCCLLA);
            // fs.writeFileSync(__dirname + '/output/clean-transcript-cc.html', resultString);
            expect(resultString).to.equalIgnoreSpaces(cleanStringCC);
        });


        it('should clean and format transcript from HTML prodticket - FR LLA', function () {
            var resultString = utils.cleanHTML.transcript(dirtyTranscriptFRLLA);
            // fs.writeFileSync(__dirname + '/output/clean-transcript-fr.html', resultString);
            expect(resultString).to.equalIgnoreSpaces(cleanStringFR);
        });

        it('should clean and format transcript from HTML prodticket - Spotlight', function () {
            var resultString = utils.cleanHTML.transcript(dirtyTranscriptSL);
            // fs.writeFileSync(__dirname + '/output/clean-transcript-sl.html', resultString);
            expect(resultString).to.equalIgnoreSpaces(cleanStringSL);
        });

        it('should clean and format transcript from HTML prodticket - TownHall', function () {
            var resultString = utils.cleanHTML.transcript(dirtyTranscriptTH);
            fs.writeFileSync(__dirname + '/output/clean-transcript-th.html', resultString);
            expect(resultString).to.equalIgnoreSpaces(cleanStringTH);
        });
    });
});

