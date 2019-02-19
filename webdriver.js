/*
USE IN try.webdriver.io 
NOTES: 
    - WF has to be logged in first 
*/
const assert = require('assert');

describe('webdriver.io page', () => {
    it('should have the right title', () => {
        browser.url('https://webmd.attask-ondemand.com/project/view?ID=5ba11254009e4d918da390e8b37bdc91');
        let title = browser.getTitle();
        console.log(title);
        
        browser.setValue("#username", 'bantonelli@webmd.net');
        browser.setValue("#password", '<password>');
        
        
        
        $('button=Log In').click();
        
        // $('.edit-link.btn.btn-text').click();
        // $('=Custom Forms').click();
        // let inputLabel = $('label=Article ID Certificate Page or Live Event');
        // console.log("INPUT: ", inputLabel);   
        
        title = browser.getTitle();
        console.log("TITLE 2: ", title);
        
        var projectDetailsLoaded = $('=Project Details').waitForExist(5000);
        if (projectDetailsLoaded) {
            $('=Project Details').click();
        }
        
        var customFormsLoaded = $('=Custom Forms').waitForExist(4000);
        if (customFormsLoaded) {
            $('=Custom Forms').click();
        }
        
        var editButtonLoaded = $('.edit-link.btn.btn-text').waitForExist(5000);
        if (editButtonLoaded) {
            $('.edit-link.btn.btn-text').click();
        }
        
        var articleIDFieldExists = $('input[name="DE:Article ID Certificate Page or Live Event"]').waitForExist(5000);
        if (articleIDFieldExists) {
            var articleID = $('input[name="DE:Article ID Certificate Page or Live Event"]').getValue();            
            console.log("ARTICLE_ID: ", articleID);
        }
        
        // console.log("articleIDFieldExists: ", articleIDFieldExists);
        
        // $('.edit-link.btn.btn-text').click();
        // $('=Custom Forms').click();
        // let inputLabel = $('label=Article ID Certificate Page or Live Event');
        // console.log("INPUT: ", inputLabel);
    });
});

// This type of hash in WF link stays the same. 
// 5ba11254009e4d918da390e8b37bdc91
// 5ba11254009e4d918da390e8b37bdc91