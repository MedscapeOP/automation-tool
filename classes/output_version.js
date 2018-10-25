const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/index').xmlOps;

class OutputVersion extends XMLElement{
    constructor() {  
        super("prof_article", false, false);

        this.hasOUS = hasOUS;

        this._front_label = {
            "type": "element",
            "name": "front_label",
            "elements": [
                {
                    "type": "text",
                    "text": "Front Matter"
                }
            ]
        };

        this._elements[0] = this._front_label;
        // _elements ==> starts with [label, type]
        // _elements ==> over time push(newElements)
        // .elements ==> _concat(_elements, footnotes)
    }

    //--------------------------------
    // COMPUTED PROPERTIES 
    //-------------------------------- 
    get elements() {
        // if (this.hasFootnotes && this.hasQnaForm) {
        //     return _.concat(this._elements, this._footnotes, this._qnaForm);
        // } else if (this.hasQnaForm) {
        //     return _.concat(this._elements, this._qnaForm);
        // } else if (this.hasFootnotes) {
        //     return _.concat(this._elements, this._footnotes);
        // } else {
        //     return this._elements;
        // }      
        return _.flatten(this._elements);               
    }

    get titleText() {
        if (this._title.elements[0]) {
            return this._title.elements[0].elements[0].text;
        } else {
            return null;
        }        
    }

    set titleText(newTitle) {
        // Extraordinary Cases of VTE Prevention in Patient with Cancer
        var titleObject = {
            "type": "element",
            "name": "p",
            "elements": [
                {
                    "type": "text",
                    "text": `${newTitle}`
                }
            ]
        };
        this._title.elements[0] = titleObject; 
    }

    //--------------------------------
    // METHODS 
    //-------------------------------- 

    get aboveTitle() {
        if (this._above_title.elements[0]) {
            return xmlOps.objectToXMLString(this._above_title);
        } else {
            return null;
        }          
    }

    insertAboveTitleCA (advancesTitle, advancesFileName) {
        var aboveTitleObject = {
            "type": "element",
            "name": "p",
            "elements": [
                {
                    "type": "element",
                    "name": "a",
                    "attributes": {
                        "href": `/sites/advances/${advancesFileName}`
                    },
                    "elements": [
                        {
                            "type": "text",
                            "text": `${advancesTitle}`
                        }
                    ]
                }
            ]
        };
        this._above_title.elements.push(aboveTitleObject);
        // this._above_title.elements[0].elements[0].attributes.href = advancesURL;
        // this._above_title.elements[0].elements[0].elements[0].text = advancesTitle;
    }

    toFinalXML() {
        // return `<${this._xmlTagName}>${(xmlOps.objectToXMLString(this.toObjectLiteral()))}</${this._xmlTagName}>`
        return `${xmlOps.objectToXMLString(this.toObjectLiteral())}`;
    }
}

module.exports = OutputVersion;