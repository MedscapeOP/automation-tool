var _ = require("lodash");

class TOCElement {
    constructor(label, type) {
        this._elements = [
            {
                "type": "element",
                "name": "toc_label",
                "elements": [
                    {
                        "type": "text",
                        "text": label
                    }
                ]
            },
            {
                "type": "element",
                "name": "toc_type",
                "elements": [
                    {
                        "type": "text",
                        "text": this.type
                    }
                ]
            }
        ];
        // _elements ==> starts with [label, type]
        // _elements ==> over time push(newElements)
        // .elements ==> _concat(_elements, footnotes)
    }

    get elements() {
        var footnotes = {
            "type": "element",
            "name": "pg_footnotes",
            "elements": []
        };         
        return _.concat(this._elements, footnotes);
    }

    get tocLabel() {
        return this._elements[0].elements[0].text;
    }

    set tocLabel(newLabel) {
        this._elements[0].elements[0].text = newLabel;
    }

    get tocType() {    
        return this._elements[1].elements[0].text;
    }

    set tocType(newType) {
        this._elements[1].elements[0].text = newType;
    }

    insertSectionElement(secElement) {
        /* 
            - Pushes the new section element onto the elements array of the TocElement
        */
        this._elements.push(secElement);
    }

    toObjectLiteral() {
        var selfElements = this.elements;
        var object = {
            elements: [
                {
                    type: "element",
                    name: "toc_element",
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

module.exports = TOCElement;