// const _ = require("lodash");

class Component {
    constructor(componentNumber, title, teaser, byline, contentType, articleID) {
        this.componentNumber = componentNumber;
        this.title = title;
        this.teaser = teaser;
        this.byline = byline;
        this.contentType = contentType;
        this.articleID = articleID;
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 

    //--------------------------------
    // METHODS 
    //-------------------------------- 
    toObjectLiteral() {
        var componentNumber = this.componentNumber;
        var title = this.title;
        var teaser = this.teaser;
        var byline = this.byline;
        var contentType = this.contentType;
        var articleID = this.articleID;
        return {
            articleID,
            componentNumber,
            title, 
            teaser,
            byline,
            contentType 
        };     
    }
}

module.exports = Component;

/*
    {
        componentNumber: 1,
        title: `Diagnostic and Management Challenges in Patients With Chronic Migraine`,
        teaser: `Dr Lipton introduces this program on the management of patients with migraine.`,
        byline: `Richard Lipton, MD`,
        contentType: `Expert Commentary-Video`
    }
*/