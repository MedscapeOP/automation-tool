const inLanguage = require('./in-language');

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

function videoEmbed (slidesComponent, articleID=null) {
    if (articleID) {
        return `
        <div class="app-loading">
            <div id="cme-video-player" data-playertype="edu" data-config="en/pi/editorial/studio/configs/2018/education/${articleID}/${articleID}.json" class="webcomp-player">
                &nbsp;
            </div>
        </div>
        `;
    } 
    // IF NO ARTICLE ID USE SLIDES COMPONENT TO BUILD SNIPPET 
    var videoEmbedPath = function () {
        if (slidesComponent.componentNumber) {
            return `${slidesComponent.articleID}/${slidesComponent.articleID}_${slidesComponent.componentNumber + 1}`;
        } else {
            return `${slidesComponent.articleID}/${slidesComponent.articleID}`;
        }
    }

    if (slidesComponent.componentNumber) {
        return `
        <div class="app-loading">
            <div id="cme-video-player" data-playertype="edu" data-config="en/pi/editorial/studio/configs/2018/education/${videoEmbedPath()}.json" class="webcomp-player">
                &nbsp;
            </div>
        </div>
        `;
    } else {
        return `
        <div class="app-loading">
            <div id="cme-video-player" data-playertype="edu" data-config="en/pi/editorial/studio/configs/2018/education/${videoEmbedPath()}.json" class="webcomp-player">
                &nbsp;
            </div>
        </div>
        <div id="page_nav_top">
            <div id="prev_page_nav">
                <a href="${slidesComponent.articleID}">&laquo; Back </a>
            </div>
            <div id="next_page_nav">
                <a href="${slidesComponent.articleID}_3">Next&raquo;</a>
                <a style="height: 17px;" id="next_toc_link" href="javascript:next_toc();">
                    <img border="0" src="http://img.medscape.com/pi/cme/ornaments/arrow-next-toc.png" class="inline_img" alt="" />
                </a>
            </div>
            <div class="spacer">&nbsp;</div>
        </div>
        `;
    }
}

/* 
In-Language stuff 
*/

module.exports = {
    videoEmbed,
    forYourPatient,
    downloadableSlides,
    inLanguage
};