// const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/xml-ops');

class SlideGroup extends XMLElement {
    constructor(slidePath, slideNumber, hasQnaForm = true, hasFootnotes = false) {
        super("slide_grp", hasQnaForm, hasFootnotes);
        this._sectionImage = {
            "type": "element",
            "name": "sec_img",
            "elements": [
                {
                    "type": "instruction",
                    "name": "dctmLink",
                    "instruction": ""
                },
                {
                    "type": "instruction",
                    "name": "dctmEditor",
                    "instruction": ""
                },
                {
                    "type": "text",
                    "text": `/webmd/professional_assets/medscape/images/content/article/${slidePath}/Slide${slideNumber}.png`
                }
            ]
        };
        this._sectionLabel = {
            "type": "element",
            "name": "sec_label",
            "elements": [
                {
                    "type": "text",
                    "text": `Slide ${slideNumber}.`
                }
            ]
        };
        this._sectionCaption = {
            "type": "element",
            "name": "sec_caption",
            "elements": []
        };
        this._sectionText = {
            "type": "element",
            "name": "sec_txt",
            "elements": []
        };
        this._sectionAltText = {
            "type": "element",
            "name": "sec_alt_txt",
            "elements": [
                {
                    "type": "text",
                    "text": `Slide ${slideNumber}.`
                }
            ]
        };

        this._elements[0] = this._sectionImage;
        this._elements[1] = this._sectionLabel;
        this._elements[2] = this._sectionCaption;
        this._elements[3] = this._sectionText;
        this._elements[4] = this._sectionAltText;
        // _elements ==> starts with [subsec_header]
        // _elements ==> after instantiation push(subsectionContent)
    }

    // Section Image Props
    get sectionImagePath() {
        if (this._sectionImage.elements.length >= 1) {              
            return this._sectionImage.elements[2].text;            
        } else {
            return null;
        }
    }

    get sectionImage() {
        if (this._sectionImage.elements.length >= 1) {  
            return xmlOps.objectToXMLString(this._sectionImage);
        } else {
            return null;
        }
    }

    set sectionImage(newImagePath) {
        if (newImagePath) {
            this._sectionImage.elements = [
                {
                    "type": "instruction",
                    "name": "dctmLink",
                    "instruction": ""
                },
                {
                    "type": "instruction",
                    "name": "dctmEditor",
                    "instruction": ""
                },
                {
                    "type": "text",
                    "text": `${newImagePath}`
                }
            ];
        } else {
            this._sectionImage.elements = [];
        }
    }

    // Section Label Props - DONE
    get sectionLabel() {
        if (this._sectionLabel.elements.length > 0) {
            return this._sectionLabel.elements[0].text;
        } else {
            return null;
        }
    }

    set sectionLabel(newLabel) {
        if ((this._sectionLabel.elements.length > 0) && newLabel) {
            this._sectionLabel.elements[0].text = newLabel;
        } else if (newLabel) {
            this._sectionLabel.elements = [
                {
                    "type": "text",
                    "text": `${newLabel}`
                }
            ];
        } else {
            this._sectionLabel.elements = [];
        }
    }

    // Section Caption Props - TODO
    
    // Section Text Props
    get sectionText() {
        if (this._sectionText.elements.length > 0) {
            return xmlOps.objectToXMLString(this._sectionText);
        } else {
            return null;
        }  
    }

    set sectionText(sectionText) {
        // Remove already existing section text
        this._sectionText.elements = [];
        if (sectionText) {
            var sectionTextObject = xmlOps.xmlStringToJS(sectionText);
            var content = sectionTextObject.elements[0].elements;       
            for (var i = 0; i < content.length; i++) {
                this._sectionText.elements.push(content[i]);
            }
        }
        // this.insertSectionText(sectionText);
    }

    // Section Alt-Text Props
    get sectionAltText() {
        if (this._sectionAltText.elements.length > 0) {
            return this._sectionAltText.elements[0].text;
        } else {
            return null;
        }
    }

    set sectionAltText(newAltText) {
        if ((this._sectionAltText.elements.length > 0) && newAltText) {
            this._sectionAltText.elements[0].text = newAltText;
        } else if (newAltText) {
            this._sectionAltText.elements = [
                {
                    "type": "text",
                    "text": `${newAltText}`
                }
            ];
        } else {
            this._sectionAltText.elements = [];
        }
    }
}

module.exports = SlideGroup;

/*
{
    "type": "element",
    "name": "slide_grp",
    "elements": [
        {
            "type": "element",
            "name": "sec_img",
            "elements": [
                {
                    "type": "instruction",
                    "name": "dctmLink",
                    "instruction": ""
                },
                {
                    "type": "instruction",
                    "name": "dctmEditor",
                    "instruction": ""
                },
                {
                    "type": "text",
                    "text": "/webmd/professional_assets/medscape/images/content/article/XXX/XXX/Slide22.png"
                }
            ]
        },
        {
            "type": "element",
            "name": "sec_label",
            "elements": [
                {
                    "type": "text",
                    "text": "Slide 22."
                }
            ]
        },
        {
            "type": "element",
            "name": "sec_caption",
            "elements": []
        },
        {
            "type": "element",
            "name": "sec_txt",
            "elements": []
        },
        {
            "type": "element",
            "name": "sec_alt_txt",
            "elements": [
                {
                    "type": "text",
                    "text": "Slide 22."
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
*/