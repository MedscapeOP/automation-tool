const _ = require("lodash");
const XMLElement = require("./xml_element");

class SubsectionElement extends XMLElement {
    constructor(hasSlides) {
        super("subsec_element", true, false);
        this._subsectionHeader = {
            "type": "element",
            "name": "subsec_header",
            "elements": []
        };
        this._elements[0] = this._subsectionHeader;
        // _elements ==> starts with [subsec_header]
        // _elements ==> after instantiation push(subsectionContent)

        if (hasSlides) {
            this._elements[1] = {
                "type": "element",
                "name": "slide_intro",
                "elements": []
            };
        }
    }

    get subsectionHeader() {
        this.getParagraphTextField("_subsectionHeader");
    }

    set subsectionHeader(newHeader) {
        this.setParagraphTextField("_subsectionHeader", newHeader);
    }

    insertSubsectionContent(subsectionContent) {
        /* 
            - Pushes the new subsec_content onto the elements array of the subsection
        */
       var content = subsectionContent.elements[0];
       this._elements.push(content);
    }

    insertSlideGroup(slideGroup) {
        /* 
            - Pushes the new slide_grp onto the elements array of the subsection
        */
       var slide = slideGroup.toObjectLiteral().elements[0];
       this._elements.push(slide);
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