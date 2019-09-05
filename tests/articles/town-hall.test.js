const fs = require('fs');
const _ = require("lodash");
const chai = require('chai');

chai.use(require('chai-string'));
let expect = chai.expect;

const app = require('../../commands');
const {SubsectionElement} = app.classes;
const utils = app.utils;
const townHallEnduring = app.articles.townHallEnduring;

describe('Town Hall', function () {
 
    /*
    QNA; ACTIVITY; CONTRIBUTORS; THUMBNAIL; - - NOT DOING 
    BACK MATTER; UPLOAD/LINK SLIDE DECK; - NOT DOING
    
    - Test in buildFirstResponse() Master function 
    TITLE
    CONTRIBUTOR PAGE INFO 
    BANNER
    (Slides && Pre/Post)
    BLANK RESULTS PAGE
    ABBREVIATIONS
    REFERENCES

    - Test in separate suites
    SLIDES 
    PRE/POST ASSESSMENT  
    
    */ 

    var program; 
    var prodTicket;
    var completeTownHallEnduring;
    var completeTownHallReg;

    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/town-hall/article-enduring.html', 'utf8');

        completeTownHallEnduring = fs.readFileSync(__dirname + '/input/town-hall/town-hall-enduring.xml').toString();

        completeTownHallReg = fs.readFileSync(__dirname + '/input/town-hall/town-hall-reg.jsp').toString();

        program = app.config.programs.townHall;

    });

    describe('#buildTownHallEnduring()', function () {
        it('should return complete XML string of Town Hall Enduring article', function () {
            program.hasCollectionPage = false;
            program.hasPeerReviewer = false;
            program.hasForYourPatient = false;
            program.hasLLA = false;
            program.hasOUS = true; 
            // program.articleID = "902206";

            var result = townHallEnduring.buildTownHallEnduring(prodTicket, program).finishedArticleObject.toObjectLiteral();

            result = utils.cleanHTML.cleanEntities(utils.xmlOps.objectToXMLString(result));

            fs.writeFileSync(__dirname + '/output/town-hall/finished-th.xml', result);

            // console.log("RESULT: ", result);
            // utils.xmlOps.writeXMLFromObject(result, __dirname + "/output/spotlight/finished-sl.xml");

            expect(result).to.equalIgnoreSpaces(completeTownHallEnduring);
        });
    });
});

