const _ = require("lodash");
const utils = require("../utils");
const articleUtils = require('./article-utils');
const {PropertiesChecklist} = require("../classes");
const prodticket = require('../prodticket');
const snippets = require('../snippets');


/*
Properties to Include: 
1) ArticleID - command arg 
2) Title - ticket - DONE 
3) Window Title Override - ticket - DONE 
4) User Description - ticket - DONE
5) Meta Description - ticket - DONE
6) Questionnaire - prompt - DONE
7) Product Name - ticket - DONE
8) Project ID - ticket (first "Activity SF#") - DONE 
9) Bucket Collections - prompt - DONE
10) Primary Collections - prompt - DONE 
11) Supporter - ticket - DONE 
12) Publication - prompt - DONE 
*/
/* CHECKLIST FUNCTION  
-------------------------------------- */
function getChecklist(ticket, program) {
    var checklist = new PropertiesChecklist();
    // TITLE
    checklist.title.result = prodticket.getTitle(ticket, program);
    
    // WINDOW TITLE OVERRIDE       
    checklist.windowTitleOverride.result = prodticket.getTitle(ticket, program);
    
    // USER DESCRIPTION 
    checklist.userDescription.result = prodticket.getTeaser(ticket, program);

    // META DESCRIPTION      
    checklist.metaDescription.result = prodticket.getTeaser(ticket, program);
    
    // PRODUCT NAME
    checklist.productName.result = prodticket.getProductType(ticket, program);

    // PROJECT ID  
    checklist.projectId.result = prodticket.getProjectId(ticket, program);

    // SUPPORTER 
    checklist.supporter.result = prodticket.getSupporter(ticket, program);

    return checklist;
}



/* MASTER FUNCTION 
-------------------------------------- */
function buildChecklist(checklist, program) {
    checklist.questionnaire.result = program.questionnaire;
    checklist.bucketCollections.result = program.bucketCollections;
    checklist.primaryCollection.result = program.primaryCollection;
    checklist.publication.result = program.publication;
    var checklistResult = checklist.print();
    
    return {
        finishedArticleObject: checklist,
        checklistHTML: checklistResult.printHTML  
    };
};

module.exports = {
    getChecklist,
    buildChecklist
}
