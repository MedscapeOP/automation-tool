const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/index').xmlOps;


class ProfArticle extends XMLElement{
    constructor(type = "Article") {
        if (type == "SlidePresentation") {
            super("prof_article_slide_presentation", false, false);
        } else if (type == "Article") {
            super("prof_article", false, false);
        }  

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
        this._above_title = {
            "type": "element",
            "name": "above_title",
            "elements": []
        };
        this._title = {
            "type": "element",
            "name": "title",
            "elements": []
        };
        this._contrbtr_pre_content = {
            "type": "element",
            "name": "contrbtr_pre_content",
            "elements": [
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": "As an organization accredited by the ACCME, Medscape, LLC, requires everyone who is in a position to control the content of an education activity to disclose all relevant financial relationships with any commercial interest.  The ACCME defines \"relevant financial relationships\" as financial relationships in any amount, occurring within the past 12 months, including financial relationships of a spouse or life partner, that could create a conflict of interest."
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": "Medscape, LLC, encourages Authors to identify investigational products or off-label uses of products regulated by the US Food and Drug Administration, at first mention and where appropriate in the content."
                        }
                    ]
                }
            ]
        };
        this._contrbtr_byline = {
            "type": "element",
            "name": "contrbtr_byline",
            "elements": []
        };
        this._contrbtr_groups = [];
        this._contrbtr_bulk_info = {
            "type": "element",
            "name": "contrbtr_bulk_info",
            "elements": []
        };
        this._contrbtr_post_content = {
            "type": "element",
            "name": "contrbtr_post_content",
            "elements": [
                {
                    "type": "element",
                    "name": "h3",
                    "elements": [
                        {
                            "type": "element",
                            "name": "strong",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "Peer Reviewer"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": "This activity has been peer reviewed and the reviewer has disclosed the following relevant financial relationships:"
                        },
                        {
                            "type": "element",
                            "name": "br",
                            "elements": []
                        },
                        {
                            "type": "text",
                            "text": "Served as an advisor or consultant for: Abbott Laboratories; HeartWare International, Inc.; Medtronic, Inc.; Thoratec Corporation"
                        }
                    ]
                }
            ]
        };
        this._supprtr_grant_group = {
            "type": "element",
            "name": "supprtr_grant_group",
            "elements": [
                {
                    "type": "element",
                    "name": "supprtr_grant_attr",
                    "elements": [
                        {
                            "type": "text",
                            "text": "/webmd/professional_assets/medscape/images/grant_attribution/daiichi-global-ieg-txt-2014.gif"
                        }
                    ]
                }
            ]
        };
        this._body_label = {
            "type": "element",
            "name": "body_label",
            "elements": [
                {
                    "type": "text",
                    "text": "Body"
                }
            ]
        };
        this._toc_elements = [];
        this._back_label = {
            "type": "element",
            "name": "back_label",
            "elements": [
                {
                    "type": "text",
                    "text": "Back Matter"
                }
            ]
        };
        this._layer_grps = [];
        this._ref_grp = {
            "type": "element",
            "name": "ref_grp",
            "elements": [
                {
                    "type": "element",
                    "name": "ref_item",
                    "elements": []
                }
            ]
        };
        this._cpyrt_holder = {
            "type": "element",
            "name": "cpyrt_holder",
            "elements": [
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": "Medscape, LLC"
                        }
                    ]
                }
            ]
        };
        this._cpyrt_ovrd = {
            "type": "element",
            "name": "cpyrt_ovrd",
            "elements": []
        };
        this._disclmr_ovrd = {
            "type": "element",
            "name": "disclmr_ovrd",
            "elements": []
        };
        this._bkmtr_front = {
            "type": "element",
            "name": "bkmtr_front",
            "elements": [
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "element",
                            "name": "strong",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "Disclaimer"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": "The educational activity presented above may involve simulated case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient is intended or should be inferred."
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "p",
                    "elements": [
                        {
                            "type": "text",
                            "text": "The material presented here does not necessarily reflect the views of Medscape, LLC, or companies that support educational programming on medscape.org. These materials may discuss therapeutic products that have not been approved by the US Food and Drug Administration and off-label uses of approved products. A qualified healthcare professional should be consulted before using any therapeutic product discussed. Readers should verify all information and data before treating patients or employing any therapies described in this educational activity."
                        }
                    ]
                }
            ]
        };
        this._bkmtr_glossary = {
            "type": "element",
            "name": "bkmtr_glossary",
            "elements": []
        };
        this._bkmtr_ack = {
            "type": "element",
            "name": "bkmtr_ack",
            "elements": []
        };
        this._bkmtr_discl = {
            "type": "element",
            "name": "bkmtr_discl",
            "elements": []
        };
        this._bkmtr_funding = {
            "type": "element",
            "name": "bkmtr_funding",
            "elements": []
        };
        this._bkmtr_reprnt_addr = {
            "type": "element",
            "name": "bkmtr_reprnt_addr",
            "elements": []
        };
        this._bkmtr_abbr_notes = {
            "type": "element",
            "name": "bkmtr_abbr_notes",
            "elements": []
        };
        this._bkmtr_last = {
            "type": "element",
            "name": "bkmtr_last",
            "elements": []
        };
        this._img_ttl_bkgrd = {
            "type": "element",
            "name": "img_ttl_bkgrd",
            "elements": [
                {
                    "type": "text",
                    "text": "/webmd/professional_assets/medscape/images/title_background/banner-evolving-anticoagulation-2017.jpg"
                }
            ]
        };
        this._img_publ_logo = {
            "type": "element",
            "name": "img_publ_logo",
            "elements": []
        }; 

        this._elements[0] = this._front_label;
        this._elements[1] = this._above_title;
        this._elements[2] = this._title;
        this._elements[3] = this._contrbtr_pre_content;
        this._elements[4] = this._contrbtr_byline;
        this._elements[5] = this._contrbtr_groups;
        this._elements[6] = this._contrbtr_bulk_info;
        this._elements[7] = this._contrbtr_post_content;
        this._elements[8] = this._supprtr_grant_group;
        this._elements[9] = this._body_label;
        this._elements[10] = this._toc_elements;
        this._elements[11] = this._back_label;
        this._elements[12] = this._layer_grps;
        this._elements[13] = this._ref_grp;
        this._elements[14] = this._cpyrt_holder;
        this._elements[15] = this._cpyrt_ovrd;
        this._elements[16] = this._disclmr_ovrd;
        this._elements[17] = this._bkmtr_front;
        this._elements[18] = this._bkmtr_glossary;
        this._elements[19] = this._bkmtr_ack;
        this._elements[20] = this._bkmtr_discl;
        this._elements[21] = this._bkmtr_funding;
        this._elements[22] = this._bkmtr_reprnt_addr;
        this._elements[23] = this._bkmtr_abbr_notes;
        this._elements[24] = this._bkmtr_last;
        this._elements[25] = this._img_ttl_bkgrd;
        this._elements[26] = this._img_publ_logo;

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

    get contrbtrBylineText() {
        if (this._contrbtr_byline.elements[0]) {
            return this._contrbtr_byline.elements[0].elements[0].text;
        } else {
            return null;
        }        
    }

    set contrbtrBylineText(newByline) {
        // Extraordinary Cases of VTE Prevention in Patient with Cancer
        var bylineObject = {
            "type": "element",
            "name": "p",
            "elements": [
                {
                    "type": "text",
                    "text": `${newByline}`
                }
            ]
        };
        this._contrbtr_byline.elements[0] = bylineObject; 
    }

    get contrbtrByline() {
        if (this._contrbtr_byline.elements[0]) {
            return xmlOps.objectToXMLString(this._contrbtr_byline);
        } else {
            return null;
        }  
    }

    set contrbtrByline(newBylineMarkup) {
        if (newBylineMarkup) {
            var bylineObject = xmlOps.xmlStringToJS(newBylineMarkup);
            this._contrbtr_byline.elements = bylineObject.elements;
        } else {
            this._contrbtr_byline.elements = [];
        }
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



    insertContributorGroup(contrbtrGroup) {
        /* 
            - Pushes the new contrbtr_group element onto the this._contrbtr_groups array
        */
        // this._elements.push(secElement.toObjectLiteral().elements[0]);
        this._contrbtr_groups.push(contrbtrGroup.toObjectLiteral().elements[0]);
    }
    insertLayerGroup(layerGrp) {
        /* 
            - Pushes the new layer_grp element onto the this._layer_grps array
        */
        // this._elements.push(secElement.toObjectLiteral().elements[0]);
        this._layer_grps.push(layerGrp.toObjectLiteral().elements[0]);
    }
    insertTOCElement(tocElement) {
        /* 
            - Pushes the new toc_element onto the this._toc_elements array
        */
       this._toc_elements.push(tocElement.toObjectLiteral().elements[0]);
    }
}

module.exports = ProfArticle;