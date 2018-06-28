var _ = require("lodash");

/*
    CONSTRUCTOR:
    - initialize _elements
    - initialize _xmlTagName
    - conditionally initialize: 
        - _qnaForm
        - _footnotes
        
    PROPERTIES: 
    - getter for _elements (.elements)
    - getter and setter for _qnaForm
    
    METHODS: 
    - setParagraphTextField()
    - toObjectLiteral() method 
        - Moved logic for this method into this class definition
*/

class XMLElement {
    constructor(xmlTagName, hasQnaForm, hasFootnotes, xmlType = "element") {
        this.hasQnaForm = hasQnaForm;
        this.hasFootnotes = hasFootnotes;
        this._xmlTagName = xmlTagName;
        this._xmlType = xmlType;
        this._elements = [];
        if (this.hasQnaForm) {
            this._qnaForm = {
                "type": "element",
                "name": "qna_form",
                "elements": []
            }
        }  
        if (this.hasFootnotes) {
            this._footnotes = {
                "type": "element",
                "name": "pg_footnotes",
                "elements": []
            };   
        }
    }

    //--------------------------------
    // COMPUTED PROPERTIES 
    //-------------------------------- 
    get elements() {
        if (this.hasFootnotes && this.hasQnaForm) {
            return _.concat(this._elements, this._footnotes, this._qnaForm);
        } else if (this.hasQnaForm) {
            return _.concat(this._elements, this._qnaForm);
        } else if (this.hasFootnotes) {
            return _.concat(this._elements, this._footnotes);
        } else {
            return this._elements;
        }                     
    }

    get qnaForm() {
        if (this.hasQnaForm) {
            return this._qnaForm.elements[0].text || "";
        } else {
            return null;
        }
    }

    set qnaForm(newFormNumber) {
        if (this.hasQnaForm) {
            if (this._qnaForm.elements[0]) {
                this._qnaForm.elements[0].text = newFormNumber;
            } else {
                this._qnaForm.elements[0] = {
                    "type": "text",
                    "text": "" + newFormNumber
                }
            }
        } else {
            this._qnaForm = null;
        }
    }

    //--------------------------------
    // METHODS 
    //-------------------------------- 
    toObjectLiteral() {
        var selfElements = this.elements;
        var object = {
            elements: [
                {
                    type: this._xmlType,
                    name: this._xmlTagName,
                    elements: selfElements
                }    
            ]
        }        
        return object;
    }

    getParagraphTextField() {
        return this[propName].elements[0].elements[0].text || "";
    }

    setParagraphTextField(propName, newText) {
        newText = newText + "";
        if (newText.length > 0) {
            if (this[propName].elements[0]) {
                this[propName].elements[0].elements[0].text = newText;
            } else {            
                this[propName].elements[0] = {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": newText
                        }
                    ]
                }
            }
        } else {
            this[propName].elements = []; 
        }       
    }
}

module.exports = XMLElement;