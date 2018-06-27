var _ = require("lodash");

class SubsectionElement {
    constructor(subsectionHeader) {
        this._elements = [
            {
                "type": "element",
                "name": "subsec_header",
                "elements": [
                    {
                        "type": "element",
                        "name": "p",
                        "elements": [
                            {
                                "type": "text",
                                "text": subsectionHeader
                            }
                        ]
                    }
                ]
            }
        ];
        this._qnaForm = {
            "type": "element",
            "name": "qna_form",
            "elements": []
        }
        // _elements ==> starts with [subsec_header]
        // _elements ==> after instantiation push(subsectionContent)
    }

    get elements() {                
        return _.concat(this._elements, this._qnaForm);
    }

    get subsectionHeader() {
        return this._elements[0].elements[0].elements[0].text;
    }

    set subsectionHeader(newHeader) {
        this._elements[0].elements[0].elements[0].text = newHeader;
    }

    get qnaForm() {
        return this._qnaForm.elements[0].text || "";
    }

    set qnaForm(newFormNumber) {
        if (this._qnaForm.elements[0]) {
            this._qnaForm.elements[0].text = newFormNumber;
        } else {
            this._qnaForm.elements[0] = {
                "type": "text",
                "text": "" + newFormNumber
            }
        }
    }

    insertSubsectionContent(subsectionContent) {
        /* 
            - Pushes the new subsec_element onto the elements array of the section
        */
       var content = subsectionContent.elements[0];
       this._elements.push(content);
    }

    toObjectLiteral() {
        var selfElements = this.elements;
        var object = {
            elements: [
                {
                    type: "element",
                    name: "subsec_element",
                    elements: selfElements
                }    
            ]
        }        
        return object;
    }
}

module.exports = SubsectionElement;

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