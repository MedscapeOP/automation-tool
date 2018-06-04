var fs = require('fs');
var _ = require("lodash");
var utils = require("../../utils/utils");
var clinicalBrief = require("../../clinical-brief/clinical-brief");
var expect = require('chai').expect;

describe('Clinical Brief', function () {
    var prodTicket;
    var clinicalContextObject;
    beforeEach(function() {
        prodTicket = fs.readFileSync(__dirname + '/input/article.html', 'utf8');
        clinicalContextObject = {
            "elements": [
              {
                "type": "element",
                "name": "subsec_content",
                "elements": [
                  {
                    "type": "element",
                    "name": "p",
                    "elements": [
                      {
                        "type": "text",
                        "text": "For stroke victims, the outcomes that matter to clinicians are often not the outcomes that matter most to survivors. Based on previous research, there is a wide distribution of outcomes for patients with normal modified rankin scores (mRS) that pertain to physical function, fatigue, cognition and social function. It is important to understand the outcomes that are most meaningful to patients as it will help in identifying meaningful treatment and rehabilitation options for each patient. "
                      }
                    ]
                  },
                  {
                    "type": "element",
                    "name": "p",
                    "elements": [
                      {
                        "type": "text",
                        "text": "Recurrence, mortality, and disability are the outcomes most commonly measured in patients with ischemic stroke, but multiple nonphysical domains of health are also affected and are not specifically captured by measuring disability. These include social roles, fatigue, depression, anxiety, pain, cognition, physical function, and sleep disturbances, which may significantly reduce quality of life."
                      }
                    ]
                  },
                  {
                    "type": "element",
                    "name": "p",
                    "elements": [
                      {
                        "type": "text",
                        "text": "The goals of this large observational cohort study by Katzan and colleagues in patients with ischemic stroke were to measure patient-reported health for 8 domains across levels of disability compared with each other and with the US general population, and to evaluate the association of demographic and clinical factors with patient-reported health, using the Patient-Reported Outcomes Measurement Information System (PROMIS). Among patients with a wide range of diseases and symptoms, PROMIS efficiently measures patient status for different domains of health along a continuous scale."
                      }
                    ]
                  }
                ]
              }
            ]
          };
    });
    
    describe('#getClinicalContext()', function () {
        it('should return clinical context as JavaScript object', function () {
            var result = clinicalBrief.getClinicalContext(prodTicket);
            expect(result).to.deep.equal(clinicalContextObject);
        });
    });
    
});

