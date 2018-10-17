const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../app');
const utils = app.utils;
const spotlight = app.articles.spotlight;

describe('Spotlight', function () {

    var prodTicket;
    var completeSpotlight;
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/spotlight/article.html', 'utf8');
        // completeClinicalContext = utils.xmlOps.objectToXMLString(require('./input/clinical-context'));

        completeSpotlight = fs.readFileSync(__dirname + '/input/spotlight/spotlight.xml');
    });
    
    describe('#buildSpotlight()', function () {
        it('should return complete XML string of Spotlight article', function () {
            spotlight.buildSpotlight(prodTicket, app.config.programs.spotlight);
        });
    });
});

