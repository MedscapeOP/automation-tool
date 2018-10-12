function forYourPatient (articleID, nameOfAddon, pdfFilename) {
    return `<div class="downloadbtn">
            <div class="downloadbtn_lt"></div>
            <div class="downloadbtn_bg_pdf">
                <a href="/px/trk.svr/${articleID}?exturl=http://img.medscape.com/images/${articleID.slice(0, 3)}/${articleID.slice(3)}/${pdfFilename}" target="_blank">${nameOfAddon}</a>
            </div>
            <div class="downloadbtn_rt"></div>
            <div class="spacer">&nbsp;</div>
        </div>
        <div class="spacer">&nbsp;</div>`;
}

function downloadableSlides(articleID) {
    return `<div id="dlSlides">
        <p>A Powerpoint version of the slides from this presentation<br />
            is available for use as a professional resource from Medscape Education.</p>
        <div class="dlBtn"><a class="cme_btn" href="https://img.medscapestatic.com/images/${articleID.slice(0, 3)}/${articleID.slice(3)}/${articleID}_slides.pptx" target="_blank">Download Now</a></div>
    </div>`;
}

module.exports = {
    forYourPatient,
    downloadableSlides
};