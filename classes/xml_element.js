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
    constructor(xmlTagName, hasQnaForm, hasFootnotes, childElementIndex = null, xmlType = "element") {
        this.hasQnaForm = hasQnaForm;
        this.hasFootnotes = hasFootnotes;
        this._xmlTagName = xmlTagName;
        this._xmlType = xmlType;
        this._elements = [];
        this._childElementIndex = childElementIndex;
        this._childElements = [];
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

    get childElements() {
        // Object Literal Array of Child XML elements 
        // For TOCElement these would be Section Elements 
        var result = [];
        for (var i = 0; i < this._childElements.length; i++) {
            result.push(this._childElements[i].toObjectLiteral().elements[0]);
        }
        return result;
    }

    get elements() {
        var resultingElements = [];
        var childElements = this.childElements;
        if (this._childElementIndex && this._elements.length > 0) {            
            // resultingElements.push(_.slice(this._elements, 0, this._childElementIndex));
            // resultingElements.push(this.childElements);
            // resultingElements.push(_.slice(this._elements, this._childElementIndex, this._elements.length));
            var beginning = _.slice(this._elements, 0, this._childElementIndex);
            var end = _.slice(this._elements, this._childElementIndex, this._elements.length);
            resultingElements = _.concat(beginning, childElements, end);
            // console.log("BEGINNING: ", beginning);
            // console.log("END: ", end);
        } else {
            resultingElements = _.concat(this._elements, childElements);
        }

        resultingElements = _.flatten(resultingElements);
        if (this.hasFootnotes && this.hasQnaForm) {
            return (_.concat(resultingElements, this._footnotes, this._qnaForm));
        } else if (this.hasQnaForm) {
            return (_.concat(resultingElements, this._qnaForm));
        } else if (this.hasFootnotes) {
            return (_.concat(resultingElements, this._footnotes));
        } else {
            return (resultingElements);
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
    insertChildElement(childElement) {
        this._childElements.push(childElement);
    }

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

    getParagraphTextField(propName) {
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