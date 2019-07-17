// const _ = require("lodash");

class SlideComponent {
    constructor(articleID, componentNumber, rawSlides, numberOfSlides=null) {
        this.articleID = articleID + "";
        this.componentNumber = componentNumber;
        this.rawSlides = rawSlides;
        this.numberOfSlides = numberOfSlides;
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 
    get slidePath() {
        if (this.componentNumber) {
            return `${this.articleID.slice(0, 3)}/${this.articleID.slice(3)}/${this.articleID}_${this.componentNumber + 1}`;
        }
        else {
            return `${this.articleID.slice(0, 3)}/${this.articleID.slice(3)}`;
        }
    }

    //--------------------------------
    // METHODS 
    //-------------------------------- 
    toObjectLiteral() {
        var articleID = this.articleID;
        var componentNumber = this.componentNumber;
        var slidePath = this.slidePath;
        var rawSlides = this.rawSlides;
        var numberOfSlides = this.numberOfSlides;
        if (numberOfSlides) {
            return {
                articleID,
                componentNumber, 
                slidePath,
                rawSlides,
                numberOfSlides 
            };     
        } else {
            return {
                articleID,
                componentNumber, 
                slidePath,
                rawSlides 
            };
        }
    }
}

module.exports = SlideComponent;

/*
{
    articleID: "900319",
    componentNumber: 1, 
    slidePath: "900/319/900319_2",
    rawSlides: `<p>&lt;&lt;insert Intro slide 1; 00:00 &gt;&gt;  </p>

    <p><strong>&lt;&lt;Level 2&gt;&gt;</strong> <strong>Diagnostic and Management Challenges in Patients With Chronic Migraine</strong></p>
    
    <p>&lt;&lt;insert Intro slide 2; 00:15 &gt;&gt;  </p>
    
    <p><strong>&lt;&lt;Level 2&gt;&gt; Faculty</strong></p>
    
    <p>&lt;&lt;insert Intro slide 3; 00:30 &gt;&gt;  </p>
    
    <p><strong>&lt;&lt;Level 2&gt;&gt; Disclaimer</strong></p>
    
    <p>&lt;&lt;end slides&gt;&gt;</p>`
}
*/