const _ = require("lodash");
const XMLElement = require("./xml_element");
const ContributorElement = require("./contrbtr_element");
const xmlOps = require('../utils/xml-ops');

class ContributorGroup extends XMLElement {
    constructor(contributorTypeLabel, hasQnaForm = false, hasFootnotes = false) {
        super("contrbtr_group", hasQnaForm, hasFootnotes, 1);
        this._contrbtrTypeLbl = {
            "type": "element",
            "name": "contrbtr_type_lbl",
            "elements": [
                {
                    "type": "text",
                    "text": contributorTypeLabel
                }
            ]
        };
        this._elements[0] = this._contrbtrTypeLbl;
    }

    get contrbtrTypeLbl() {
        return this.getTextField("_contrbtrTypeLbl");
    }

    set contrbtrTypeLbl(newContributorLabel) {
        this.setTextField("_contrbtrTypeLbl", newContributorLabel);
    }

    insertContributorElement(contributorElement) {
        /* 
            - Pushes the new contributor group onto the elements array of the subsection
        */
        if ((contributorElement) && (contributorElement instanceof ContributorElement)) {
            this.insertChildElement(contributorElement);
        }
    }
}

module.exports = ContributorGroup;

/*
return {
        "type": "element",
        "name": "subsec_element",
        "elements": [
            {
                "type": "element",
                "name": "subsec_header",
                "elements": []
            },
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
                                "text": "For stroke victims, the outcomes that matter to clinicians are often not the outcomes that matter most to survivors. Based on previous research, there is a wide distribution of outcomes for patients with normal modified rankin scores (mRS) that pertain to physical function, fatigue, cognition and social function. It is important to understand the outcomes that are most meaningful to patients as it will help in identifying meaningful treatment and rehabilitation options for each patient."
                            }
                        ]
                    }
                ]
            },
            {
                "type": "element",
                "name": "qna_form",
                "elements": []
            }
        };
*/
