const config = require('../config');

var exportObject = {};

exportObject[config.programs.clinicalBrief.codeName] = function (ticketHTML) {
    return "";
}

exportObject[config.programs.spotlight.codeName] = function (ticketHTML) {
    return "";
}

exportObject[config.programs.curbsideConsult.codeName] = function (ticketHTML) {
    return "";
}

module.exports = exportObject;