const _ = require("lodash");
const XMLElement = require("./xml_element");

class SectionElement extends XMLElement {
    constructor() {
        super("sec_element", false, false);
        this._sectionHeader = {
            "type": "element",
            "name": "sec_header",
            "elements": []
        };
        this._elements[0] = this._sectionHeader;
    }

    get sectionHeader() {
        this.getParagraphTextField("_sectionHeader");
    }

    set sectionHeader(newHeader) {
        this.setParagraphTextField("_sectionHeader", newHeader);
    }

    insertSubsectionElement(subsecElement) {
        /* 
            - Pushes the new subsec_element onto the elements array of the section
        */
        this._elements.push(subsecElement.toObjectLiteral().elements[0]);
    }
}

module.exports = SectionElement;

/*
    return {
        "type": "element",
        "name": "sec_element",
        "elements": [
            {
                "type": "element",
                "name": "sec_header",
                "elements": [
                    {
                        "type": "element",
                        "name": "p",
                        "elements": [
                            {
                                "type": "text",
                                "text": "Clinical Context"
                            }
                        ]
                    }
                ]
            },
            {
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
                ]
            }
        ]
    };
*/