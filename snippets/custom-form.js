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

module.exports = {
    certificateLinks
};