/*
USE IN try.webdriver.io 
*/
const assert = require('assert');

describe('webdriver.io page', () => {
    it('should have the right title', () => {
        browser.url('https://webmd.attask-ondemand.com/project/view?ID=5c1d3d34007fcfda5bade0f41523e293');
        const title = browser.getTitle();
        $('.edit-link.btn.btn-text').click();
        let inputLabel = $('label=Article ID Certificate Page or Live Event');
        console.log("INPUT: ", inputLabel);
    });
});