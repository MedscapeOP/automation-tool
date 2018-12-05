function copyrightHolderMarkup (program) {
    if (program.hasOUS) {
        return `<p>WebMD Global, LLC</p>`;
    } else {
        return `<p>Medscape, LLC</p>`;
    }
}

module.exports = {
    copyrightHolderMarkup
}