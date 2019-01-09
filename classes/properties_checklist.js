const _ = require('lodash');
const utils = require('../utils');
const printFunctions = utils.printFunctions;
const {stripIndent} = require('common-tags');
const ArticleChecklist = require("./article_checklist");

class PropertiesChecklist extends ArticleChecklist{
    constructor() {  
        super();
        this.title = {result: null, printFn: printFunctions.printStringProp, printName: "TITLE"};
        this.windowTitleOverride = {result: null, printFn: printFunctions.printStringProp, printName: "WINDOW TITLE OVERRIDE"};
        this.userDescription = {result: null, printFn: printFunctions.printStringProp, printName: "USER DESCRIPTION"};
        this.metaDescription = {result: null, printFn: printFunctions.printStringProp, printName: "META DESCRIPTION"};
        this.questionnaire = {result: null, printFn: printFunctions.printStringProp, printName: "QUESTIONNAIRE ID"};
        this.productName = {result: null, printFn: printFunctions.printStringProp, printName: "PRODUCT NAME"};
        this.projectId = {result: null, printFn: printFunctions.printStringProp, printName: "PROJECT ID"};
        this.bucketCollections = {result: null, printFn: printFunctions.printStringProp, printName: "BUCKET COLLECTIONS"};
        this.primaryCollection = {result: null, printFn: printFunctions.printStringProp, printName: "PRIMARY COLLECTIONS"};
        this.supporter = {result: null, printFn: printFunctions.printStringProp, printName: "SUPPORTER"};
        this.publication = {result: null, printFn: printFunctions.printStringProp, printName: "PUBLICATION"};
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //--------------------------------
}

module.exports = PropertiesChecklist;