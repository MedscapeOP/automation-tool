const _ = require("lodash");
const XMLElement = require("./xml_element");
const SectionElement = require('./sec_element');

class TOCElement extends XMLElement{
    constructor(type = "Default", hasQnaForm = false, hasFootnotes = true) {
        super("toc_element", hasQnaForm, hasFootnotes);
        this._label = {
            "type": "element",
            "name": "toc_label",
            "elements": []
        };
        this._type = {
            "type": "element",
            "name": "toc_type",
            "elements": [
                {
                    "type": "text",
                    "text": type
                }
            ]
        };
        this._elements[0] = this._label;
        this._elements[1] = this._type;
        // _elements ==> starts with [label, type]
        // _elements ==> over time push(newElements)
        // .elements ==> _concat(_elements, footnotes)
    }

    get tocLabel() {
        return this.getParagraphTextField("_label");
    }

    set tocLabel(newLabel) {
        this.setParagraphTextField("_label", newLabel);
    }

    get tocType() {    
        return this.getTextField("_type");
    }

    set tocType(newType) {
        this.setTextField("_type", newType);
    }

    get sectionElements() {
        return this.childElements;
    }

    insertSectionElement(secElement) {
        /* 
            - Pushes the new section element onto the elements array of the TocElement
        */
        // this._elements.push(secElement.toObjectLiteral().elements[0]);
        if ((secElement) && (secElement instanceof SectionElement)) {
            this.insertChildElement(secElement);
        }
    }
}

module.exports = TOCElement;