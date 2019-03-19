var _ = require("lodash");
const xmlOps = require('../utils').xmlOps;
const cleanHTML = require('../utils').cleanHTML;
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
    constructor(xmlTagName, hasQnaForm, hasFootnotes, childElementIndex = null, attributes = null, xmlType = "element") {
        this.hasQnaForm = hasQnaForm;
        this.hasFootnotes = hasFootnotes;
        this._xmlTagName = xmlTagName;
        this._xmlType = xmlType;
        this._attributes = attributes;
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
        if (this._attributes) {
            object.elements[0].attributes = this._attributes;
        }       
        return object;
    }

    // FIELDS THAT ONLY HAVE TEXT WRAPPED IN A PARAGRAPH TAG  
    getParagraphTextField(propName) {
        if (this[propName].elements[0]) {
            return this[propName].elements[0].elements[0].text;
        } else {
            return null;
        }       
    }

    setParagraphTextField(propName, newText) {
        if (newText) {
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
            }
        } else {
            this[propName].elements = []; 
        }       
    }

    // FIELDS THAT ONLY HAVE TEXT 
    getTextField(propName) {
        if (this[propName].elements.length > 0) {
            if (this[propName].elements[0].text) {
                return this[propName].elements[0].text;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    setTextField(propName, newText) {
        if ((this[propName].elements.length > 0) && newText) {
            this[propName].elements[0].text = newText;
        } else if (newText) {
            this[propName].elements = [
                {
                    "type": "text",
                    "text": `${newText}`
                }
            ];
        } else {
            this[propName].elements = [];
        }
    }

    // FIELDS THAT ARE NOT SINGLE PARENT HTML MARKUP  
    getMarkupField(propName) {
        if (this[propName].elements.length > 0) {
            return xmlOps.objectToXMLString(this[propName]);
        } else {
            return null; 
        }
    }

    /**
     * @description 
     * Takes in wrapped markup and unwraps it. Then inserts the contents as the elements of the field specified.
     * @param {*} propName 
     * @param {*} newMarkup - newMarkup should come in wrapped using a wrapper utility 
     */
    
    setMarkupField(propName, newMarkup) {  
        if (newMarkup) {
            // console.log("NEW MARKUP: ", newMarkup); 
            var markupObject = xmlOps.xmlStringToJS(newMarkup);
            this[propName].elements = markupObject.elements[0].elements;
        } else {
            this[propName].elements = [];
        }
    } 

    // FIELDS THAT ARE SINGLE PARENT HTML MARKUP
    getWrappedMarkupField(propName) {
        if (this[propName].elements[0]) {
            return xmlOps.objectToXMLString(this[propName]);
        } else {
            return null;
        }          
    }

    /**
     * @description 
     * Takes in wrapped markup and replaces the elements of the field specified.
     * @param {*} propName 
     * @param {*} newMarkup - newMarkup should come in wrapped using a wrapper utility 
    */
    setWrappedMarkupField(propName, newMarkup) {
       if (newMarkup) {
            var newMarkupObject = xmlOps.xmlStringToJS(newMarkup);
            // var content = newMarkupObject.elements[0].elements;
            // for (var i = 0; i < content.length; i++) {
            //     this[propName].elements.push(content[i]);
            // }
            this[propName].elements = newMarkupObject.elements;
        } else {
            this[propName].elements = [];
        }
    }
}

module.exports = XMLElement;