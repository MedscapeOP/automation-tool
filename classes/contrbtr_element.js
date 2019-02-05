// const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/xml-ops');

class ContributorElement extends XMLElement {
    constructor(contributorName = "", hasQnaForm = false, hasFootnotes = false, chronicleid = null) {
        if (chronicleid) {
            super("contrbtr_element", hasQnaForm, hasFootnotes, null, {
                "chronicleid": chronicleid
            });
        } else {
            super("contrbtr_element", hasQnaForm, hasFootnotes);
        }
        this._contrbtr_nm = {
            "type": "element",
            "name": "contrbtr_nm",
            "elements": [
                {
                    "type": "text",
                    "text": `${contributorName}`
                }
            ]
        };
        this._contrbtr_title = {
            "type": "element",
            "name": "contrbtr_title",
            "elements": []
        };
        this._contrbtr_bio = {
            "type": "element",
            "name": "contrbtr_bio",
            "elements": []
        };
        this._contrbtr_disclsr = {
            "type": "element",
            "name": "contrbtr_disclsr",
            "elements": []
        };

        this._elements[0] = this._contrbtr_nm;
        this._elements[1] = this._contrbtr_title;
        this._elements[2] = this._contrbtr_bio;
        this._elements[3] = this._contrbtr_disclsr;
        // _elements ==> starts with [subsec_header]
        // _elements ==> after instantiation push(subsectionContent)
    }

    // Contributor Name Props
    get contrbtrNm() {
        return this.getTextField("_contrbtr_nm");
    }

    set contrbtrNm(newContributorName) {
        this.setTextField("_contrbtr_nm", newContributorName);
    }
    
    // Contributor Title Props
    get contrbtrTitle() {
        return this.getWrappedMarkupField("_contrbtr_title");
    }

    set contrbtrTitle(contributorTitle) {
        // console.log("CONTRIBUTOR TITLE: ", contributorTitle);
        // Remove already existing section text
        // this._contrbtr_title.elements = [];
        // if (contributorTitle) {
        //     var contributorTitleObject = xmlOps.xmlStringToJS(contributorTitle);
        //     // var content = contributorTitleObject.elements[0].elements;       
        //     // for (var i = 0; i < content.length; i++) {
        //     //     this._sectionText.elements.push(content[i]);
        //     // }
        //     this._contrbtr_title.elements.push(contributorTitleObject.elements[0]);
        // }
        this.setWrappedMarkupField("_contrbtr_title", `<p>${contributorTitle}</p>`);
    }

    // Contributor Disclosure Props
    get contrbtrDisclsr() {
        return this.getWrappedMarkupField("_contrbtr_disclsr");
    }

    set contrbtrDisclsr(contributorDisclosure) {
         
        // Remove already existing section text
        // this._contrbtr_disclsr.elements = [];
        // if (contributorTitle) {
        //     var contributorDisclosureObject = xmlOps.xmlStringToJS(contributorDisclosure);
        //     this._contrbtr_disclsr.elements.push(contributorDisclosureObject.elements[0]);
        // }
        this.setWrappedMarkupField("_contrbtr_disclsr", `<p>${contributorDisclosure}</p>`);
    }
}

module.exports = ContributorElement;

/*

*/