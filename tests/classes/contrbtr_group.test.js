const fs = require('fs');
const _ = require("lodash");
const expect = require('chai').expect;

const app = require('../../commands');
const ContributorGroup = app.classes.ContributorGroup;
const ContributorElement = app.classes.ContributorElement;
const utils = app.utils;


describe('Contributor Group & Contributor Element', function () {
    /*
    Main sections to test: 
    - Test elements getter 
    */

    var contributors = require('../prodticket/input/contributors-cc');
    beforeEach(function() {});
    
    describe('New Contributor Element', function () {
        it('Should set up a new Contributor Element and assign properties via getters and setters', function () {
            var contributor = contributors[0];
            var contributorElementInstance = new ContributorElement();
            contributorElementInstance.contrbtrNm = contributor.name;
            contributorElementInstance.contrbtrTitle = contributor.affiliation;
            // console.log("CONTRIBUTOR TITLE", contributor.title);
            contributorElementInstance.contrbtrDisclsr = contributor.disclosure;

            var result = utils.xmlOps.objectToXMLString(contributorElementInstance.toObjectLiteral());

            expect(result).to.equalIgnoreSpaces(`
            <contrbtr_element>
                <contrbtr_nm>Jeffrey I. Weitz, MD, FRCP(C)</contrbtr_nm>
                <contrbtr_title>
                    <p>        
                        Professor of Medicine
                        <br/>
                        McMaster University
                        <br/>
                        Hamilton, Ontario, Canada
                    </p>
                </contrbtr_title>
                <contrbtr_bio/>
                <contrbtr_disclsr>
                    <p>
                        Disclosure: Jeffrey I. Weitz, MD, FRCP(C), has disclosed the following relevant financial relationships: 

                        <br/>Served as an advisor or consultant for: Bayer AG; Bristol-Myers Squibb Company; Boehringer Ingelheim Pharmaceuticals, Inc.; Daiichi Sankyo, Inc.; Ionis Pharmaceuticals, Inc.; Janssen Pharmaceuticals; Merck --AMPERSAND--amp; Co., Inc.; Novartis Pharmaceuticals Corporation; Pfizer Inc.; Portola Pharmaceuticals, Inc.
                        
                        <br/><br/>Dr Weitz does not intend to discuss off-label uses of drugs, mechanical devices, biologics, or diagnostics approved by the FDA for use in the United States.
                        
                        <br/><br/>Dr Weitz does not intend to discuss investigational drugs, mechanical devices, biologics, or diagnostics not approved by the FDA for use in the United States.
                    </p>
                </contrbtr_disclsr>
            </contrbtr_element>`);
        });

        it('Should set up a new Contributor Element and assign properties via getters and setters - Include Chronicle ID', function () {
            var contributor = contributors[0];
            var contributorElementInstance = new ContributorElement("", false, false, 99999999999999);
            contributorElementInstance.contrbtrNm = contributor.name;
            contributorElementInstance.contrbtrTitle = contributor.affiliation;
            // console.log("CONTRIBUTOR TITLE", contributor.title);
            contributorElementInstance.contrbtrDisclsr = contributor.disclosure;

            var result = utils.xmlOps.objectToXMLString(contributorElementInstance.toObjectLiteral());

            expect(result).to.equalIgnoreSpaces(`
            <contrbtr_element chronicleid="99999999999999">
                <contrbtr_nm>Jeffrey I. Weitz, MD, FRCP(C)</contrbtr_nm>
                <contrbtr_title>
                    <p>        
                        Professor of Medicine
                        <br/>
                        McMaster University
                        <br/>
                        Hamilton, Ontario, Canada
                    </p>
                </contrbtr_title>
                <contrbtr_bio/>
                <contrbtr_disclsr>
                    <p>
                        Disclosure: Jeffrey I. Weitz, MD, FRCP(C), has disclosed the following relevant financial relationships: 

                        <br/>Served as an advisor or consultant for: Bayer AG; Bristol-Myers Squibb Company; Boehringer Ingelheim Pharmaceuticals, Inc.; Daiichi Sankyo, Inc.; Ionis Pharmaceuticals, Inc.; Janssen Pharmaceuticals; Merck --AMPERSAND--amp; Co., Inc.; Novartis Pharmaceuticals Corporation; Pfizer Inc.; Portola Pharmaceuticals, Inc.
                        
                        <br/><br/>Dr Weitz does not intend to discuss off-label uses of drugs, mechanical devices, biologics, or diagnostics approved by the FDA for use in the United States.
                        
                        <br/><br/>Dr Weitz does not intend to discuss investigational drugs, mechanical devices, biologics, or diagnostics not approved by the FDA for use in the United States.
                    </p>
                </contrbtr_disclsr>
            </contrbtr_element>`);
        });
    });

    describe('New Contributor Group', function () {
        it('Should set up a new Contributor Group with label and push Contributors as needed', function () {
            var contributor = contributors[0];
            var contributorElementInstance = new ContributorElement();
            contributorElementInstance.contrbtrNm = contributor.name;
            contributorElementInstance.contrbtrTitle = contributor.affiliation;
            // console.log("CONTRIBUTOR TITLE", contributor.title);
            contributorElementInstance.contrbtrDisclsr = contributor.disclosure;
            
            var contributorGroupInstance = new ContributorGroup();
            expect(contributorGroupInstance.contrbtrTypeLbl).to.equal(null);

            contributorGroupInstance.contrbtrTypeLbl = "Presenters";

            contributorGroupInstance.insertContributorElement(contributorElementInstance);

            var result = utils.xmlOps.objectToXMLString(contributorGroupInstance.toObjectLiteral());

            expect(result).to.equalIgnoreSpaces(`
            <contrbtr_group>
                <contrbtr_type_lbl>Presenters</contrbtr_type_lbl>
                <contrbtr_element>
                    <contrbtr_nm>Jeffrey I. Weitz, MD, FRCP(C)</contrbtr_nm>
                    <contrbtr_title>
                        <p>        
                            Professor of Medicine
                            <br/>
                            McMaster University
                            <br/>
                            Hamilton, Ontario, Canada
                        </p>
                    </contrbtr_title>
                    <contrbtr_bio/>
                    <contrbtr_disclsr>
                        <p>
                            Disclosure: Jeffrey I. Weitz, MD, FRCP(C), has disclosed the following relevant financial relationships: 

                            <br/>Served as an advisor or consultant for: Bayer AG; Bristol-Myers Squibb Company; Boehringer Ingelheim Pharmaceuticals, Inc.; Daiichi Sankyo, Inc.; Ionis Pharmaceuticals, Inc.; Janssen Pharmaceuticals; Merck --AMPERSAND--amp; Co., Inc.; Novartis Pharmaceuticals Corporation; Pfizer Inc.; Portola Pharmaceuticals, Inc.
                            
                            <br/><br/>Dr Weitz does not intend to discuss off-label uses of drugs, mechanical devices, biologics, or diagnostics approved by the FDA for use in the United States.
                            
                            <br/><br/>Dr Weitz does not intend to discuss investigational drugs, mechanical devices, biologics, or diagnostics not approved by the FDA for use in the United States.
                        </p>
                    </contrbtr_disclsr>
                </contrbtr_element>
            </contrbtr_group>`);
        });
    });
});
