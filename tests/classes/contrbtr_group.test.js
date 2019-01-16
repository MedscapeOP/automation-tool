// const fs = require('fs');
// const _ = require("lodash");
// const expect = require('chai').expect;

// const app = require('../../commands');
// const ContributorGroup = app.classes.ContributorGroup;
// const ContributorElement = app.classes.ContributorElement;
// const utils = app.utils;


// describe('Contributor Group & Contributor Element', function () {
//     /*
//     Main sections to test: 
//     - Test elements getter 
//     */

//     var contributors = require('../prodticket/input/contributors-cc');
//     beforeEach(function() {});
    
//     describe('New Contributor Element', function () {
//         it('Should set up a new Contributor Element and assign properties via getters and setters', function () {
//             var contributor = contributors[0];
//             var contributorElementInstance = new ContributorElement();
//             contributorElementInstance.contrbtrNm = contributor.name;
//             contributorElementInstance.contrbtrTitle = contributor.title;
//             contributorElementInstance.contrbtrDisclsr = contributor.disclosure;

//             var result = utils.xmlOps.objectToXMLString(contributorElementInstance.toObjectLiteral());

//             expect(result).to.equalIgnoreSpaces(`
//             <contrbtr_element>
//                 <contrbtr_nm>Joseph J. Lillo, DO, CPI</contrbtr_nm>
//                 <contrbtr_title>
//                     <p>Assistant Professor
//                         <br/>Family Medicine
//                         <br/>Midwestern University College of Osteopathic Medicine
//                         <br/>Glendale, Arizona
//                     </p>
//                 </contrbtr_title>
//                 <contrbtr_bio/>
//                 <contrbtr_disclsr>
//                     <p>Disclosure: Joseph Lillo, DO, CPI, has disclosed the following relevant financial relationships:
//                         <br/>Served as a speaker or a member of a speakers bureau for: Amarin Corporation plc; Amgen Inc.; Kowa Company Ltd.
//                         <br/>
//                         <br/>Dr Lillo does not intend to discuss off-label uses of drugs, mechanical devices, biologics, or diagnostics approved by the FDA for use in the United States.
//                         <br/>
//                         <br/>Dr Lillo does not intend to discuss investigational drugs, mechanical devices, biologics, or diagnostics not approved by the FDA for use in the United States.
//                     </p>
//                 </contrbtr_disclsr>
//             </contrbtr_element>`);
//         });
//     });

//     describe('New Contributor Group', function () {
//         it('Should set up a new Contributor Group with label and push Contributors as needed', function () {
//             var contributorGroupInstance = new ContributorGroup();
//             expect(contributorGroupInstance.contrbtrTypeLbl).to.equal(null);

//             contributorGroupInstance.contrbtrTypeLbl = "Presenters";

//             expect(result).to.equalIgnoreSpaces(`
//             <contrbtr_group>
//                     <contrbtr_type_lbl>Presenters</contrbtr_type_lbl>
//                     <contrbtr_element chronicleid="0901c79180b97434">
//                         <contrbtr_nm>Joseph J. Lillo, DO, CPI</contrbtr_nm>
//                         <contrbtr_title>
//                             <p>Assistant Professor
//                                 <br/>Family Medicine
//                                 <br/>Midwestern University College of Osteopathic Medicine
//                                 <br/>Glendale, Arizona
//                             </p>
//                         </contrbtr_title>
//                         <contrbtr_bio/>
//                         <contrbtr_disclsr>
//                             <p>Disclosure: Joseph Lillo, DO, CPI, has disclosed the following relevant financial relationships:
//                                 <br/>Served as a speaker or a member of a speakers bureau for: Amarin Corporation plc; Amgen Inc.; Kowa Company Ltd.
//                                 <br/>
//                                 <br/>Dr Lillo does not intend to discuss off-label uses of drugs, mechanical devices, biologics, or diagnostics approved by the FDA for use in the United States.
//                                 <br/>
//                                 <br/>Dr Lillo does not intend to discuss investigational drugs, mechanical devices, biologics, or diagnostics not approved by the FDA for use in the United States.
//                             </p>
//                         </contrbtr_disclsr>
//                     </contrbtr_element>
//                     <contrbtr_element chronicleid="0901c791800018d7">
//                         <contrbtr_nm>Michael E. Cobble, MD</contrbtr_nm>
//                         <contrbtr_title>
//                             <p>Adjunct Faculty
//                                 <br/>University of Utah
//                                 <br/>Director
//                                 <br/>Canyons Medical
//                                 <br/>Salt Lake City, Utah
//                             </p>
//                         </contrbtr_title>
//                         <contrbtr_bio/>
//                         <contrbtr_disclsr>
//                             <p>Disclosure: Michael Cobble, MD, has disclosed the following relevant financial relationships:
//                                 <br/>Served as an advisor or consultant for: Kowa Company Ltd.
//                                 <br/>Served as a speaker or a member of a speakers bureau for: Amarin Corporation plc; Amgen Inc.; AstraZeneca Pharmaceuticals LP; Kowa Company Ltd.; Sanofi
//                                 <br/>Received grants for clinical research from: Johnson &amp; Johnson Pharmaceutical Research &amp; Development, L.L.C.
//                                 <br/>
//                                 <br/>Dr Cobble does not intend to discuss off-label uses of drugs, mechanical devices, biologics, or diagnostics approved by the FDA for use in the United States.
//                                 <br/>
//                                 <br/>Dr Cobble does not intend to discuss investigational drugs, mechanical devices, biologics, or diagnostics not approved by the FDA for use in the United States.
//                             </p>
//                         </contrbtr_disclsr>
//                     </contrbtr_element>
//                 </contrbtr_group>`);
//         });
//     });
// });
