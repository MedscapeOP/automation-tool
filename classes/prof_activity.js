const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/index').xmlOps;
const TOCElement = require('./toc_element');

class ProfActivity extends XMLElement{
    constructor(hasOUS = false) {
        super("prof_activity", false, false, 12);

        this.hasOUS = hasOUS;

        this._title = {
            "type": "element",
            "name": "title",
            "elements": []
        };
        this._objectives = {
            "type": "element",
            "name": "objectives",
            "elements": []
        };
        this._goal = {
            "type": "element",
            "name": "goal",
            "elements": []
        };
        this._tgt_aud = {
            "type": "element",
            "name": "tgt_aud",
            "elements": []
        };
        this._credit_instr = {
            "type": "element",
            "name": "credit_instr",
            "elements": []
        };
        this._hardware_reqs = {
            "type": "element",
            "name": "hardware_reqs",
            "elements": []
        };
        this._clinical_context = {
            "type": "element",
            "name": "clinical_context",
            "elements": []
        };
        this._highlights = {
            "type": "element",
            "name": "highlights",
            "elements": []
        };
        this._pearls_practice = {
            "type": "element",
            "name": "pearls_practice",
            "elements": []
        };
        this._addl_credit_amt = {
            "type": "element",
            "name": "addl_credit_amt",
            "elements": []
        };
        this._misc_prov_stmt = {
            "type": "element",
            "name": "misc_prov_stmt",
            "elements": []
        };
        this._addl_credit_avail = {
            "type": "element",
            "name": "addl_credit_avail",
            "elements": []
        };
        this._contrbtr_groups = [];
        
        this._elements[0] = this._title;
        this._elements[1] = this._objectives;
        this._elements[2] = this._goal;
        this._elements[3] = this._tgt_aud;
        this._elements[4] = this._credit_instr;
        this._elements[5] = this._hardware_reqs;
        this._elements[6] = this._clinical_context;
        this._elements[7] = this._highlights;
        this._elements[8] = this._pearls_practice;
        this._elements[9] = this._addl_credit_amt;
        this._elements[10] = this._misc_prov_stmt;
        this._elements[11] = this._addl_credit_avail;
        // First slice
        // child elements 
        this._elements[12] = this._contrbtr_groups;
    }

    //--------------------------------
    // COMPUTED PROPERTIES 
    //-------------------------------- 
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

    get title() {
        if (this._title.elements[0]) {
            return xmlOps.objectToXMLString(this._title);
        } else {
            return null;
        }  
    }

    set title(newTitleMarkup) {
        if (newTitleMarkup) {
            var titleObject = xmlOps.xmlStringToJS(newTitleMarkup);
            this._title.elements = titleObject.elements;
        } else {
            this._title.elements = [];
        }
    }

    get tocElements() {
        return this.childElements;
    }

    //--------------------------------
    // METHODS 
    //-------------------------------- 

    insertContributorGroup(contrbtrGroup) {
        /* 
            - Pushes the new contrbtr_group element onto the this._contrbtr_groups array
        */
        // this._elements.push(secElement.toObjectLiteral().elements[0]);
        this._contrbtr_groups.push(contrbtrGroup.toObjectLiteral().elements[0]);
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

    toFinalXML() {
        // return `<${this._xmlTagName}>${(xmlOps.objectToXMLString(this.toObjectLiteral()))}</${this._xmlTagName}>`
        return `${xmlOps.objectToXMLString(this.toObjectLiteral())}`;
    }
}

module.exports = ProfActivity;