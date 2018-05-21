var _ = require("lodash");

class SectionElement {
    constructor(sectionHeader) {
        this._elements = [
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
                                "text": sectionHeader
                            }
                        ]
                    }
                ]
            }
        ];
        // _elements ==> starts with [label, type]
        // _elements ==> over time push(newElements)
    }

    get elements() {       
        return this._elements;
    }

    get sectionHeader() {
        return this._elements[0].elements[0].elements[0].text;
    }

    set sectionHeader(newHeader) {
        this._elements[0].elements[0].elements[0].text = newHeader;
    }

    insertSubsectionElement(subsecElement) {
        /* 
            - Pushes the new subsec_element onto the elements array of the section
        */
        this._elements.push(subsecElement);
    }

    toObjectLiteral() {
        var selfElements = this.elements;
        var object = {
            elements: [
                {
                    type: "element",
                    name: "sec_element",
                    elements: selfElements
                }    
            ]
        }        
        return object;
        /*
            USES: 
            - This will be the go to API for producing objects that 
              are formatted and ready to be converted to xml
            - At highest level (article object): 
                we will also need to inject TOC elements using this method 
                —> tocInstance.toObjectLiteral().elements[0];            
        */
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