function contrbtrPreContentMarkup (program) {
    if (program.hasOUS) {
        return `
        <p>WebMD Global requires each individual who is in a position to control the content of one of its educational activities to disclose any relevant financial relationships occurring within the past 12 months that could create a conflict of interest.</p>
        `;
    } else {
        return `
        <p>As an organization accredited by the ACCME, Medscape, LLC, requires everyone who is in a position to control the content of an education activity to disclose all relevant financial relationships with any commercial interest.  The ACCME defines \"relevant financial relationships\" as financial relationships in any amount, occurring within the past 12 months, including financial relationships of a spouse or life partner, that could create a conflict of interest.</p>
        <p>Medscape, LLC, encourages Authors to identify investigational products or off-label uses of products regulated by the US Food and Drug Administration, at first mention and where appropriate in the content.</p>
        `
    }
}

module.exports = {
    contrbtrPreContentMarkup
}