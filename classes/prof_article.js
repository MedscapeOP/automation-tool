const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/index').xmlOps;
const TOCElement = require('./toc_element');

class ProfArticle extends XMLElement{
    constructor(type = "Article", hasOUS = false, hasQnaForm = false, hasFootnotes = false) {
        if (type == "SlidePresentation") {
            super("prof_article_slide_presentation", hasQnaForm, hasFootnotes, 10);
        } else if (type == "Article") {
            super("prof_article", false, false, 10);
        }  

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
            "elements": []
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
            "elements": []
        };

        this._supprtr_grant_group = {
            "type": "element",
            "name": "supprtr_grant_group",
            "elements": []
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
            "elements": []
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
            "elements": []
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
            "elements": []
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
        // First slice
        // child elements 
        this._elements[10] = this._back_label;
        this._elements[11] = this._layer_grps;
        this._elements[12] = this._ref_grp;
        this._elements[13] = this._cpyrt_holder;
        this._elements[14] = this._cpyrt_ovrd;
        this._elements[15] = this._disclmr_ovrd;
        this._elements[16] = this._bkmtr_front;
        this._elements[17] = this._bkmtr_glossary;
        this._elements[18] = this._bkmtr_ack;
        this._elements[19] = this._bkmtr_discl;
        this._elements[20] = this._bkmtr_funding;
        this._elements[21] = this._bkmtr_reprnt_addr;
        this._elements[22] = this._bkmtr_abbr_notes;
        this._elements[23] = this._bkmtr_last;
        this._elements[24] = this._img_ttl_bkgrd;
        this._elements[25] = this._img_publ_logo;
        // this._elements[10] = this._toc_elements;
        // this._elements[11] = this._back_label;
        // this._elements[12] = this._layer_grps;
        // this._elements[13] = this._ref_grp;
        // this._elements[14] = this._cpyrt_holder;
        // this._elements[15] = this._cpyrt_ovrd;
        // this._elements[16] = this._disclmr_ovrd;
        // this._elements[17] = this._bkmtr_front;
        // this._elements[18] = this._bkmtr_glossary;
        // this._elements[19] = this._bkmtr_ack;
        // this._elements[20] = this._bkmtr_discl;
        // this._elements[21] = this._bkmtr_funding;
        // this._elements[22] = this._bkmtr_reprnt_addr;
        // this._elements[23] = this._bkmtr_abbr_notes;
        // this._elements[24] = this._bkmtr_last;
        // this._elements[25] = this._img_ttl_bkgrd;
        // this._elements[26] = this._img_publ_logo;

        // _elements ==> starts with [label, type]
        // _elements ==> over time push(newElements)
        // .elements ==> _concat(_elements, footnotes)
    }

    //--------------------------------
    // COMPUTED PROPERTIES 
    //-------------------------------- 
    get title() {
        return this.getParagraphTextField("_title");        
    }

    set title(newTitle) {
        // Extraordinary Cases of VTE Prevention in Patient with Cancer
        this.setParagraphTextField("_title", newTitle);
    }

    get contrbtrByline() {
        return this.getParagraphTextField("_contrbtr_byline");
    }

    set contrbtrByline(newByline) {
        // Extraordinary Cases of VTE Prevention in Patient with Cancer
        this.setParagraphTextField("_contrbtr_byline", newByline);
    }

    // AKA Content Above Contributors 
    get contrbtrPreContent() {
        return this.getMarkupField("_contrbtr_pre_content");
    }
    
    set contrbtrPreContent(newPreContentMarkup) {
        this.setMarkupField("_contrbtr_pre_content", newPreContentMarkup);
    }

    // AKA Content Below Contributors 
    get contrbtrPostContent() {
        return this.getMarkupField("_contrbtr_post_content");
    }

    set contrbtrPostContent(newPostContentMarkup) {
        this.setMarkupField("_contrbtr_post_content", newPostContentMarkup);
    }

    get supprtrGrantGroup() {        
        return this.getMarkupField("_supprtr_grant_group");
    }

    set supprtrGrantGroup(newSupporterMarkup) {
        this.setMarkupField("_supprtr_grant_group", newSupporterMarkup);
    }

    get cpyrtHolder() {
        return this.getMarkupField("_cpyrt_holder"); 
    }

    set cpyrtHolder(newCopyrightMarkup) {
        this.setMarkupField("_cpyrt_holder", newCopyrightMarkup);
    }

    get bkmtrFront() {
        return this.getMarkupField("_bkmtr_front");
    }

    set bkmtrFront(newBackmatterMarkup) {
        this.setMarkupField("_bkmtr_front", newBackmatterMarkup);    
    }

    get bannerImage() {
        return this.getTextField("_img_ttl_bkgrd");
    }

    set bannerImage(advancesBannerFileName) {
        var filePath = `/webmd/professional_assets/medscape/images/title_background/${advancesBannerFileName}`;
        this.setTextField("_img_ttl_bkgrd", filePath);
    }

    get tocElements() {
        return this.childElements;
    }

    //--------------------------------
    // METHODS 
    //-------------------------------- 

    get aboveTitle() {
        return this.getMarkupField("_above_title");
    }

    insertAboveTitleCollection (collectionPageObject) {
        var url = "";
        if (collectionPageObject.type == "Clinical Advances") {
            url = `/sites/advances/${collectionPageObject.fileName}`
        } else if (collectionPageObject.type == "Collection Page") {
            url = `/viewcollection/${collectionPageObject.fileName}`
        }
        var aboveTitleObject = {
            "type": "element",
            "name": "p",
            "elements": [
                {
                    "type": "element",
                    "name": "a",
                    "attributes": {
                        "href": url
                    },
                    "elements": [
                        {
                            "type": "text",
                            "text": `${collectionPageObject.title}`
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
    insertSupporterGrantAttr(imageFilename) {
        if (!imageFilename) {
            imageFilename = `medscape.gif`;
        }
        // var supprtrGrantAttr = `
        // <supprtr_grant_attr>/webmd/professional_assets/medscape/images/grant_attribution/${imageFilename}</supprtr_grant_attr>
        // `;
        var supprtrGrantAttrObject = {
            "type": "element",
            "name": "supprtr_grant_attr",
            "elements": [
                {
                    "type": "text",
                    "text": `/webmd/professional_assets/medscape/images/grant_attribution/${imageFilename}`
                }
            ]
        };
        this._supprtr_grant_group.elements.push(supprtrGrantAttrObject);
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
        if ((tocElement) && (tocElement instanceof TOCElement)) {
            this.insertChildElement(tocElement);
        }
    }

    toFinalXML() {
        // return `<${this._xmlTagName}>${(xmlOps.objectToXMLString(this.toObjectLiteral()))}</${this._xmlTagName}>`
        return `${xmlOps.objectToXMLString(this.toObjectLiteral())}`;
    }
}

module.exports = ProfArticle;