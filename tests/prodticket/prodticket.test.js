// const SubsectionElement = require('../../classes/subsec_element');
const fs = require('fs');
const chai = require('chai');

const app = require('../../commands');
const config = app.config;
const utils = app.utils;
const prodticket = app.prodTicket;

chai.use(require('chai-string'));
let expect = chai.expect;


describe('Prodticket Module Functions', function () {

    let prodticketCB;
    let prodticketCC;
    let prodticketSL;
    let prodticketFR;
    let prodticketTH;
    let prodticketTH_alt;

    beforeEach(function() {
        prodticketCB = fs.readFileSync(__dirname + '/input/prodticket-cb.html').toString();
        prodticketCC = fs.readFileSync(__dirname + '/input/prodticket-cc.html').toString();      
        prodticketSL = fs.readFileSync(__dirname + '/input/prodticket-sl.html').toString();
        prodticketFR = fs.readFileSync(__dirname + '/input/prodticket-fr.html').toString();
        prodticketTH = fs.readFileSync(__dirname + '/input/prodticket-th.html').toString();
        prodticketTH_alt = fs.readFileSync(__dirname + '/input/prodticket-th-alt.html').toString();
    });

    /**
    * TITLE      
    */
    describe("prodticket.getTitle()", function () {
        it("should return the program title from the .html - Clinical Brief", function () {
            var result = prodticket.getTitle(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equal("Common Nonphysical Problems Seen After Stroke");
        });

        // it("should return the program title from the .html - Spotlight", function () {
        //     var result = prodticket.getTitle(prodticketSL, config.programs.spotlight);
        //     expect(result).to.equal("Cancer&#8208;Associated Thrombosis: Emerging Concepts and Paradigms");
        // });

        it("should return the program title from the .html - Curbside", function () {
            var result = prodticket.getTitle(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal("VTE in Cancer: What Do the Latest Data Suggest?");
        });

        it("should return the program title + subtitle from the .html - TownHall", function () {
            var result = prodticket.getTitle(prodticketTH_alt, config.programs.townHall);
            // expect(result).to.equal("Preventing HPV-Related Disease: From Global Perspectives to Local Solutions");
            expect(result).to.equal("The Big Debate: Pharmacologic vs Alternative Approaches in Smoking Cessation");
        });
    });

    /**
    * BYLINE     
    */
    describe("prodticket.getByline()", function () {
        it("should return the program byline from the .html - Clinical Brief", function () {
            var result = prodticket.getByline(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equal("<p>News Author: Sue Hughes; CME Author: Laurie Barclay, MD</p>");
        });

        it("should return the program byline from the .html - Spotlight", function () {
            var result = prodticket.getByline(prodticketSL, config.programs.spotlight);
            expect(result).to.equal("<p>Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP; Alok A. Khorana, MD; Jeffrey I. Weitz, MD, FRCP</p>");
        });

        it("should return the program byline from the .html - Curbside", function () {
            var result = prodticket.getByline(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal("<p>Jeffrey I. Weitz, MD, FRCP(C); Alok A. Khorana, MD</p>");
        });

        it("should return the program byline from the .html - TownHall", function () {
            var result = prodticket.getByline(prodticketTH_alt, config.programs.townHall);
            // expect(result).to.equal("<p>Kenneth A. Alexander, MD, PhD; Suzanne M. Garland, AO, MBBS, MD, FRCPA, FRANZCOG Ad Eundem, FAChSHM, FASM, FFSc(RCPA); Suresh Kumarasamy, MBBS, MObGyn, FRCOG, FRCPI; Batmunkh Tsetsegsaikhan, PhD, MPH/MHM</p>");

            // expect(result).to.equal("<p>Byline not found in the prodticket!</p>");

            expect(result).to.equal("<p>Henri-Jean Aubin, MD, PhD; Peter Hajek, PhD; Serena Tonstad, MD, PhD</p>");
        });
    });

    describe("prodticket.getContributors()", function () {
        var contributorsCC = require("./input/contributors-cc");
        var contributorsSL = require("./input/contributors-sl");
        var contributorsTH = require("./input/contributors-th");
        var contributorsTH_alt = require("./input/contributors-th-alt");
        // it("should return the program contributors from the .html - Spotlight", function () {
        //     var result = prodticket.getContributors(prodticketSL, config.programs.spotlight);
        //     expect(result).to.equal("<p>Lord Ajay K. Kakkar, MD, PhD, FRCS, FRCP; Alok A. Khorana, MD; Jeffrey I. Weitz, MD, FRCP</p>");
        // });

        // it("should return the program contributors from the .html - Curbside", function () {
        //     var result = prodticket.getContributors(prodticketCC, config.programs.curbsideConsult);
        //     expect(result).to.equal("<p>Jeffrey I. Weitz, MD, FRCP(C); Alok A. Khorana, MD</p>");
        // });

        it("should return the program contributors from the .html - TownHall", function () {
            var result = prodticket.getContributors(prodticketTH_alt, config.programs.townHall);

            // console.log("RESULT: ", result);

            for (var i = 0; i < contributorsTH_alt.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(contributorsTH_alt[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(contributorsTH_alt[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(contributorsTH_alt[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(contributorsTH_alt[i].disclosure);
            }
        });

        it("should return the program contributors (With Titles) from the .html - TownHall", function () {
            var result = prodticket.getContributors(prodticketTH, config.programs.townHall);

            // fs.writeFileSync(__dirname + '/output/contributors.json', JSON.stringify(result, undefined, 2), function(err) {
            //     if(err) {
            //         return console.log(err);
            //     } else {
            //         return;
            //     }
            // });
            // console.log("RESULT: ", result);

            for (var i = 0; i < contributorsTH.length; i++) {
                expect(result[i].title).to.equalIgnoreSpaces(contributorsTH[i].title);
                expect(result[i].name).to.equalIgnoreSpaces(contributorsTH[i].name);
                expect(result[i].affiliation).to.equalIgnoreSpaces(contributorsTH[i].affiliation);
                expect(result[i].disclosure).to.equalIgnoreSpaces(contributorsTH[i].disclosure);
            }
        });
    });

    /**
    * ABBREVIATIONS     
    */
    describe("prodticket.getAbbreviations()", function () {
        var abbreviationsCC = fs.readFileSync(__dirname + '/input/abbreviations-cc.html').toString();
        var abbreviationsSL = fs.readFileSync(__dirname + '/input/abbreviations-sl.html').toString();
        var abbreviationsTH = fs.readFileSync(__dirname + '/input/abbreviations-th.html').toString();

        it("should return the program abbreviations from the .html - Spotlight", function () {
            var result = prodticket.getAbbreviations(prodticketSL, config.programs.spotlight);
            expect(result).to.equal(abbreviationsSL);
        });

        it("should return the program abbreviations from the .html - Curbside", function () {
            var result = prodticket.getAbbreviations(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equal(abbreviationsCC);
        });

        it("should return the program abbreviations from the .html - TownHall", function (){
            var result = prodticket.getAbbreviations(prodticketTH_alt, config.programs.townHall);
            expect(result).to.equal(abbreviationsTH);
        });
    });

    /**
    * REFERENCES     
    */
    describe("prodticket.getReferences()", function () {
        var referencesCB = fs.readFileSync(__dirname + '/input/references-cb.html').toString();
        var referencesSL = fs.readFileSync(__dirname + '/input/references-sl.html').toString();
        var referencesCC = fs.readFileSync(__dirname + '/input/references-cc.html').toString();
        var referencesTH = fs.readFileSync(__dirname + '/input/references-th.html').toString();

        it("should return the program references from the .html - Clinical Brief", function () {
            var result = prodticket.getReferences(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(referencesCB);
        });

        it("should return the program references from the .html - Spotlight", function () {
            var result = prodticket.getReferences(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(referencesSL);
        });

        it("should return the program references from the .html - Curbside", function () {
            var result = prodticket.getReferences(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(referencesCC);
        });

        it("should return the program references from the .html - TownHall", function () {
            var result = prodticket.getReferences(prodticketTH_alt, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(referencesTH);
        });
    });

    /**
    * PEER REVIEWER     
    */
    describe("prodticket.getPeerReviewer()", function () {
        var peerReviewerSL = fs.readFileSync(__dirname + '/input/peer-reviewer-sl.html').toString();
        var peerReviewerCC = fs.readFileSync(__dirname + '/input/peer-reviewer-cc.html').toString();
        var peerReviewerTH = fs.readFileSync(__dirname + '/input/peer-reviewer-th.html').toString();
    
        it("should return the program peer reviewer statement from .html - Spotlight", function () {
            var result = prodticket.getPeerReviewer(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(peerReviewerSL);
        });

        it("should return the program peer reviewer statement from .html - Curbside", function () {
            var result = prodticket.getPeerReviewer(prodticketCC, config.programs.curbsideConsult);
            expect(result).to.equalIgnoreSpaces(peerReviewerCC);
        });

        it("should return the program peer reviewer statement from .html - TownHall", function () {
            var result = prodticket.getPeerReviewer(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(peerReviewerTH);
        });
    });

    /**
    * SLIDES    
    */
    describe("prodticket.getSlides()", function () {
        var slideComponentsSL = require('./input/slide-components-sl');
        var slideComponentsCC = require('./input/slide-components-cc');
        var slideComponentsFR = require('./input/slide-components-fr');
        var slideComponentsTH = require('./input/slide-components-th');

        it("should return an array of slide components from .html - Spotlight", function () {
            var result = prodticket.getSlides(prodticketSL, config.programs.spotlight);
            expect(result[0].articleID).to.equal(slideComponentsSL[0].articleID);
            expect(result[0].componentNumber).to.equal(slideComponentsSL[0].componentNumber);
            expect(result[0].slidePath).to.equal(slideComponentsSL[0].slidePath);
            expect(result[0].rawSlides).to.equalIgnoreSpaces(slideComponentsSL[0].rawSlides);
        });

        it("should return an array of slide components from .html - Curbside", function () {
            var result = prodticket.getSlides(prodticketCC, config.programs.curbsideConsult);
            expect(result[0].articleID).to.equal(slideComponentsCC[0].articleID);
            expect(result[0].componentNumber).to.equal(slideComponentsCC[0].componentNumber);
            expect(result[0].slidePath).to.equal(slideComponentsCC[0].slidePath);
            expect(result[0].rawSlides).to.equalIgnoreSpaces(slideComponentsCC[0].rawSlides);
        });

        it("should return an array of slide components from .html - First Response", function () {
            var result = prodticket.getSlides(prodticketFR, config.programs.firstResponse);
            for (var i = 0; i < slideComponentsFR.length; i++) {
                expect(result[i].articleID).to.equal(slideComponentsFR[i].articleID);
                expect(result[i].componentNumber).to.equal(slideComponentsFR[i].componentNumber);
                expect(result[i].slidePath).to.equal(slideComponentsFR[i].slidePath);
                expect(result[i].rawSlides).to.equalIgnoreSpaces(slideComponentsFR[i].rawSlides);
            }
            // expect(result).to.deep.equal(slideComponentsFR);
        });

        it("should return an array of slide components from .html - TownHall", function () {
            config.programs.townHall.articleID = "903975";
            var result = prodticket.getSlides(prodticketTH_alt, config.programs.townHall);
            expect(result[0].articleID).to.equal(slideComponentsTH[0].articleID);
            expect(result[0].componentNumber).to.equal(slideComponentsTH[0].componentNumber);
            expect(result[0].slidePath).to.equal(slideComponentsTH[0].slidePath);
            expect(result[0].rawSlides).to.equalIgnoreSpaces(slideComponentsTH[0].rawSlides);      
        });
    });

    /**
    * GOAL STATEMENT   
    */
    describe("prodticket.getGoalStatement()", function () {
        var goalStatementCB = fs.readFileSync(__dirname + '/input/goal-statement-cb.html').toString();
        var goalStatementSL = fs.readFileSync(__dirname + '/input/goal-statement-sl.html').toString();
        var goalStatementCC = fs.readFileSync(__dirname + '/input/goal-statement-cc.html').toString();
        var goalStatementTH_alt = fs.readFileSync(__dirname + '/input/goal-statement-th.html').toString();
        var goalStatementTH = "<p>The goals of this activity are to increase HPV vaccine uptake and decrease HPV-related cancers in females and males.</p>"

        it("should return the program goal statement - Clinical Brief", function () {
            var result = prodticket.getGoalStatement(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(goalStatementCB);
        });

        it("should return the program goal statement from .html - Spotlight", function () {
            var result = prodticket.getGoalStatement(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(goalStatementSL);
        });

        it("should return the program goal statement from .html - Curbside", function () {
            var result = prodticket.getGoalStatement(prodticketCC, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(goalStatementCC);
        });

        it("should return the program goal statement from the .html - TownHall", function() {
            var result = prodticket.getGoalStatement(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(goalStatementTH);
        });
    });

    /**
    * TARGET AUDIENCE   
    */    
    describe("prodticket.getTargetAudience()", function () {
        var targetAudienceCB = fs.readFileSync(__dirname + '/input/target-audience-cb.html').toString();
        var targetAudienceSL = fs.readFileSync(__dirname + '/input/target-audience-sl.html').toString();
        var targetAudienceCC = fs.readFileSync(__dirname + '/input/target-audience-cc.html').toString();
        var targetAudienceTH = "<p>This activity is intended for pediatricians, primary care physicians, and obstetricians/gynecologists.</p>";
        var targetAudienceTH_alt = fs.readFileSync(__dirname + '/input/target-audience-th.html').toString();

        it("should return the program target audience from .html - Clinical Brief", function () {
            var result = prodticket.getTargetAudience(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(targetAudienceCB);
        });

        it("should return the program target audience from .html - Spotlight", function () {
            var result = prodticket.getTargetAudience(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(targetAudienceSL);
        });

        it("should return the program target audience from .html - Curbside", function () {
            var result = prodticket.getTargetAudience(prodticketCC, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(targetAudienceCC);
        });

        it("should return the program target audience from .html - TownHall", function () {
            var result = prodticket.getTargetAudience(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(targetAudienceTH);
        });
    });

    /**
    * LEARNING OBJECTIVES   
    */
    describe("prodticket.getLearningObjectives()", function () {
        var learningObjectivesCB = fs.readFileSync(__dirname + '/input/learning-objectives-cb.html').toString();
        var learningObjectivesSL = fs.readFileSync(__dirname + '/input/learning-objectives-sl.html').toString();
        var learningObjectivesCC = fs.readFileSync(__dirname + '/input/learning-objectives-cc.html').toString();
        var learningObjectivesTH = fs.readFileSync(__dirname + '/input/learning-objectives-th.html').toString();
        var learningObjectivesTH_alt = fs.readFileSync(__dirname + '/input/learning-objectives-th-alt.html').toString(); 

        it("should return the program learning objectives from .html - Clinical Brief", function () {
            var result = prodticket.getLearningObjectives(prodticketCB, config.programs.clinicalBrief);
            expect(result).to.equalIgnoreSpaces(learningObjectivesCB);
        });

        it("should return the program learning objectives from .html - Spotlight", function () {
            var result = prodticket.getLearningObjectives(prodticketSL, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(learningObjectivesSL);
        });

        it("should return the program learning objectives from .html - Curbside", function () {
            var result = prodticket.getLearningObjectives(prodticketCC, config.programs.spotlight);
            expect(result).to.equalIgnoreSpaces(learningObjectivesCC);
        });

        it("should return the program learning objectives from .html - TownHall", function () {
            var result = prodticket.getLearningObjectives(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(learningObjectivesTH);

            var result_alt = prodticket.getLearningObjectives(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(learningObjectivesTH_alt);
        });
    });

    /**
    * COMPONENTS  
    */
    describe("prodticket.getComponents()", function () {
        var componentsArray = require('./input/components-fr');

        it("should return an array of components from .html - First Response", function () {
            var result = prodticket.getComponents(prodticketFR, config.programs.firstResponse);
            for (var i = 0; i < componentsArray.length; i++) {
                expect(result[i].componentNumber).to.equal(componentsArray[i].componentNumber);

                expect(result[i].title).to.equalIgnoreSpaces(componentsArray[i].title);

                expect(result[i].teaser).to.equalIgnoreSpaces(componentsArray[i].teaser);

                expect(result[i].byline).to.equalIgnoreSpaces(componentsArray[i].byline);

                expect(result[i].contentType).to.equalIgnoreSpaces(componentsArray[i].contentType);
            }
            // console.log("COMPONENTS RESULT: ", result);
        });
    });

    /**
    * ACTIVITY OVERVIEW 
    */
    describe("prodticket.getActivityOverview()", function () {
        var activityOverviewTH = fs.readFileSync(__dirname + '/input/activity-overview-th.html').toString();
        
        var activityOverviewTH_alt = fs.readFileSync(__dirname + '/input/activity-overview-th-alt.html').toString();

        it("should return the program Activity Overview from .html - TownHall", function () {
            var result = prodticket.getActivityOverview(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(activityOverviewTH);

            var result_alt = prodticket.getActivityOverview(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(activityOverviewTH_alt);
        });
    });

    /**
     * TEASER
     */
    describe("prodticket.getTeaser()", function () {
        var teaserTH = fs.readFileSync(__dirname + '/input/teaser-th.html').toString();
        var teaserTH_alt = fs.readFileSync(__dirname + '/input/teaser-th-alt.html').toString();
        it("should return the program Teaser from .html - TownHall", function () {
            var result = prodticket.getTeaser(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(teaserTH);
            
            var result_alt = prodticket.getTeaser(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(teaserTH_alt);
        });
    });

    /**
     * CREDIT STATEMENT 
     */
    describe("prodticket.getAccreditation()", function () {
        var creditStatementTH = fs.readFileSync(__dirname + '/input/accreditation-statement-th.html').toString();
        var creditStatementTH_alt = fs.readFileSync(__dirname + '/input/accreditation-statement-th-alt.html').toString();

        it("should return the program Credit Statement from .html - TownHall", function () {
            var result = prodticket.getAccreditation(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(creditStatementTH);

            var result_alt = prodticket.getAccreditation(prodticketTH_alt, config.programs.townHall);
            expect(result_alt).to.equalIgnoreSpaces(creditStatementTH_alt);
        });
    });

    /**
     * SUPPORTER INFORMATION 
     */
    describe("prodticket.getSupporter()", function () {
        // var supporterTH = "<div>Merck & Co., Inc.</div>";
        var supporterTH = "<p>Supported by an independent educational grant from Merck &amp; Co., Inc. </p>";
        it("should return the program Supporter name from .html - TownHall", function () {
            var result = prodticket.getSupporter(prodticketTH, config.programs.townHall);
            expect(result).to.equalIgnoreSpaces(supporterTH);
        });
    });

    // /**
    //  * CREDITS AVAILABLE
    //  */
    // describe("prodticket.getCreditsAvailable()", function () {
    //     var creditsAvailableTH = "0.75";
    //     it("should return the program Credits Available from .html - TownHall", function () {
    //         var result = prodticket.getTeaser(prodticketTH, config.programs.townHall);
    //         expect(result).to.equalIgnoreSpaces(creditsAvailableTH);
    //     });
    // });

    // /**
    //  * LOCATION & MAP INFO
    //  */
    // describe("prodticket.getLocationInfo()", function () {
    //     /*
    //         Use Print/Collateral/Other section to get info 
    //             - If no Print section use Location/map info section 
    //         TAKEN FROM .jsp TH REG 
    //         var townHallAddress = "14 Darling Drive", //just street address
    //         townHallCity = "Sydney", //city
    //         townHallState = "NSW", //state
    //         townHallZip = "2000", //zip 

    //         <div class="town-hall-maplocation--city">Sydney</div>
    //         <div class="town-hall-maplocation--venue">International Convention Centre Sydney</div>
    //         <div class="town-hall-maplocation--room">Room:  Hall C4.4</div>
    //     */
    //     var addressTH = "14 Darling Drive";
    //     var cityTH = "Sydney";
    //     var stateTH = "NSW";
    //     var zipTH = "2000";
    //     var venueTH = "International Convention Centre Sydney";
    //     var roomTH = "Room: Hall C4.4";
    //     it("should return the program Location Info from .html - TownHall", function () {
    //         var result = prodticket.getTeaser(prodticketTH, config.programs.townHall);
    //         expect(result.address).to.equalIgnoreSpaces(addressTH);
    //         expect(result.city).to.equalIgnoreSpaces(cityTH);
    //         expect(result.state).to.equalIgnoreSpaces(stateTH);
    //         expect(result.zipcode).to.equalIgnoreSpaces(zipTH);
    //         expect(result.venue).to.equalIgnoreSpaces(venueTH);
    //         expect(result.room).to.equalIgnoreSpaces(roomTH);
    //     });
    // });

    // /**
    //  * DATE / TIME 
    //  */
    // describe("prodticket.getDateTime()", function () {
    //     /* 
    //      Date & Time section to get info 
    //      return object with date and time as string properties 
    //     */ 
    //     var dateTH = "Wednesday, 3 October, 2018";
    //     var timeTH = "13:00 &#8211; 14:30"
    //     it("should return the program Date/Time from .html - TownHall", function () {
    //         var result = prodticket.getDateTime(prodticketTH, config.programs.townHall);
    //         expect(result.date).to.equalIgnoreSpaces(dateTH);
    //         expect(result.time).to.equalIgnoreSpaces(timeTH);
    //     });
    // });

    // /**
    //  * PROGRAM DETAILS 
    //  */
    // describe("prodticket.getProgramDetails()", function () {
    //     /*
    //         <ul class="program-timeline">
    //             <li class="program-schedule">
    //                 <span>5:30 
    //                     <span>AM</span>
    //                 </span>
    //             </li>
    //             <li class="program-progress">
    //                 <span>
    //                     <span class="program-timepoint"></span>
    //                     <span class="program-timebar"></span>
    //                 </span>
    //             </li>
    //             <li class="program-info-wrap">
    //                 <div class="program-info-title">Breakfast &amp; Registration</div>
    //                 <div class="program-info-subtitle"></div>
    //             </li>
    //         </ul>
            
    //         <div class="program-title">
    //             <span>Program</span>
    //             <span class="program-subtitle">Tuesday, May 2, 2017</span>
    //         </div>

    //         Should return object for program details: array of programTimelineObjects each representing info for the above markup.
    //         // example timeline object 
    //         programTimeline = {
    //             schedule: "<span>5:30<span>AM</span></span>",
    //             infoTitle: "Breakfast &amp; Registration",
    //             infoSubtitle: ""                 
    //         }

    //     */ 
    //     var programDetailsTH = require('./input/programDetails');
    //     it("should return the Program Details from .html - TownHall", function () {
    //         var result = prodticket.getProgramDetails(prodticketTH, config.programs.townHall);
    //         for (var i = 0; i < programDetailsTH.length; i++) {
    //             expect(result[i].schedule).to.equalIgnoreSpaces(programDetailsTH[i].schedule);
    //             expect(result[i].infoTitle).to.equalIgnoreSpaces(programDetailsTH[i].infoTitle);
    //             expect(result[i].infoSubtitle).to.equalIgnoreSpaces(programDetailsTH[i].infoSubtitle);
    //         }
    //     });
    // });

    // /**
    //  * ASSOCIATION DISCLAIMER STATEMENT  
    //  */
    // describe("prodticket.getAssociationDisclaimer()", function () {
    //     var associationDisclaimerTH = "<p>This is an example Association Disclaimer Statement if there is one it would be in this section of the prodticket.</p>";
    //     it("should return the program Association Disclaimer Statement from .html - TownHall", function () {
    //         var result = prodticket.getAssociationDisclaimer(prodticketTH, config.programs.townHall);
    //         expect(result).to.equalIgnoreSpaces(associationDisclaimerTH);
    //     });
    // });
});

