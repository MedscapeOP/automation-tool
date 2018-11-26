let daysRegexArray = [
    /.*Sunday,.*/gi,
    /.*Monday,.*/gi,
    /.*Tuesday,.*/gi,
    /.*Wednesday,.*/gi,
    /.*Thursday,.*/gi,
    /.*Friday,.*/gi,
    /.*Saturday,.*/gi 
];

let monthsRegexArray = [
    /.*January.*/gi,
    /.*February.*/gi,
    /.*March.*/gi,
    /.*April.*/gi,
    /.*May.*/gi,
    /.*June.*/gi,
    /.*July.*/gi,
    /.*August.*/gi,
    /.*September.*/gi,
    /.*October.*/gi,
    /.*November.*/gi,
    /.*December.*/gi 
];

module.exports = {
    daysRegexArray,
    monthsRegexArray
}