const _ = require("lodash");
const XMLElement = require("./xml_element");
const xmlOps = require('../utils/index').xmlOps;
const TOCElement = require('./toc_element');

class ProfActivity extends XMLElement{
    constructor(activityTitle, hasOUS = false) {
        super("prof_activity", false, false, 12);

        this.hasOUS = hasOUS;

        this._title = {
            "type": "element",
            "name": "title",
            "elements": [
                {
                    "type": "text",
                    "text": `${activityTitle}`
                }
            ]
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
    // Activity Title  
    get title() {
        return this._contrbtr_nm.elements[0].text;
    }

    set title(newTitle) {
        this._contrbtr_nm.elements[0].text = newTitle;
    }

    // Learning Objectives 
    get learningObjectives() {
        if (this._objectives.elements.length > 0) {
            return xmlOps.objectToXMLString(this._objectives);
        } else {
            return null;
        }  
    }

    set learningObjectives(newLearningObjectivesMarkup) {
        // THIS SHOULDN'T BE WRAPPED IN a <p> 
        if (newLearningObjectivesMarkup) {
            // Only need Peer Reviewer if NON-OUS             
            var learningObjectivesObject = xmlOps.xmlStringToJS(newLearningObjectivesMarkup);
            this._objectives.elements = learningObjectivesObject.elements[0].elements;
        } else {
            this._contrbtr_post_content.elements = [];
        }
    }

    // Goal Statement  
    get goalStatement() {
        // basic paragraph text field 
        this.getParagraphTextField("_sectionHeader");
    }

    set goalStatement(goalStatement) {
        // basic paragraph text field 
        this.setParagraphTextField("_sectionHeader", goalStatement);
    }

    // Target Audience 
    get targetAudience() {
        // basic paragraph text field 
    }

    set targetAudience(newTargetAudience) {
        // basic paragraph text field 
    }

    // Credit Instructions 
    get creditInstructions() {
        // markup field (no <p> wrapper)

    } 

    set creditInstructions(newCreditInstructionsMarkup) {
        // markup field (no <p> wrapper)

    }

    // Hardware Requirements 
    get hardwareRequirements() {
        // markup field (no <p> wrapper)
    }

    set hardwareRequirements(newHardwareRequirementsMarkup) {
        // markup field (no <p> wrapper)
    }

    // Misc Provider Statement 
    get miscProviderStatement() {
        // markup field w/ wrapper 
    }

    set miscProviderStatement(newProviderStatementMarkup) {
        // markup field w/ wrapper
    }

    // Additional Credit Available 
    get additionalCreditAvailable() {
        // markup field w/ wrapper
    }

    set additionalCreditAvailable(newAdditionalCreditMarkup) {
        // markup field w/ wrapper
    }

    get sectionElements() {
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