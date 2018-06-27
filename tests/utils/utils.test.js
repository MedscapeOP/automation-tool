var fs = require('fs');
var utils = require("../../utils");
var expect = require('chai').expect;


describe('Utility Functions', function () {

    var xmlJSObject;
    var xmlJSObjectTrimmed;
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
});

