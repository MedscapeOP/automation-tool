const N = "\n";

function headlineTextFlag(headlineText) {
    headlineText = headlineText.toUpperCase();
    return `
// ------------------------------------------------------------
// ${headlineText}
// ------------------------------------------------------------
`;
}

module.exports = {
    N,
    headlineTextFlag
};
