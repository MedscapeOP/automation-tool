var fs = require('fs');
var utils = require("../../utils");
var expect = require('chai').expect;


describe('Utility Functions', function () {

    var xmlJSObject;
    var xmlJSObjectTrimmed;
    var dirtyListHTML = fs.readFileSync(__dirname + '/input/dirty-list2.html', 'utf8');
    beforeEach(function() {
        // prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        xmlJSObject = require('./input/xml-js-object');
        xmlJSObjectTrimmed = require('./input/xml-js-object-trimmed');
    });
    
    describe('#trimObjectText()', function () {
        it('should return trimmed "text" property of JavaScript Object', function () {
            var result = utils.trimObjectText(xmlJSObject)
            // console.log(xmlJSObject);
            expect(result).to.deep.equal(xmlJSObjectTrimmed);
        });
    });

    describe("#cleanHTML.unorderedList()", function () {
        it('should transform HTML entities from R2Net conversion into proper <ul><li> list.', function () {
            var result = utils.cleanHTML.unorderedList(dirtyListHTML);
            fs.writeFileSync(__dirname + "/output/clean-list.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); 
        });
    });
});

