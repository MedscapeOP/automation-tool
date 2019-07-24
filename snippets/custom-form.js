const utils = require('../utils');

function certificateLinks(eligibilitiesArray) {
    var result = "";
    eligibilitiesArray.forEach((eligibility) => {
        if (eligibility.inActivity) {
            result += `https://www.staging.medscape.org/viewcertificate/${eligibility.activityID}_${eligibility.type}\n`
        }
    });
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function mediaInfo(articleID, videoRSSLink, componentNumber=null) {
    var currentYear = new Date().getFullYear();
    var result = "";
    if (componentNumber) {
        result = `
        Config (JSON) File Location: en/pi/editorial/studio/configs/${currentYear}/education/${articleID}/${articleID}_${componentNumber + 1}.json
        Mobile Start: en/thumbnail_library/mobile_start/org/${currentYear}/${articleID}_${componentNumber + 1}_start.png
        Video RSS Location Mobile App: ${videoRSSLink}
    
        VALIDATOR LINK: https://api.staging.medscape.com/contentservice/video/validate/results?path=en/pi/editorial/studio/configs/${currentYear}/education/${articleID}/${articleID}_${componentNumber + 1}.json
        `;
    } else {
        result = `
        Config (JSON) File Location: en/pi/editorial/studio/configs/${currentYear}/education/${articleID}/${articleID}.json
        Mobile Start: en/thumbnail_library/mobile_start/org/${currentYear}/${articleID}_start.png
        Video RSS Location Mobile App: ${videoRSSLink}
    
        VALIDATOR LINK: https://api.staging.medscape.com/contentservice/video/validate/results?path=en/pi/editorial/studio/configs/${currentYear}/education/${articleID}/${articleID}.json
        `;
    }
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

module.exports = {
    certificateLinks,
    mediaInfo
};