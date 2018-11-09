const {TOCElement, SectionElement, SubsectionElement} = require('../classes/index');
const utils = require('../utils');

/* 
In-Language Addon Functions
*/

function buildInLanguageTOC (slideIntro, sectionHeader, tocType, tocLabel) {

    slideIntro = utils.cleanHTML.insertEntityPlaceholders(slideIntro);

    var subsectionInstance = new SubsectionElement(true, false, false);
    subsectionInstance.subsectionContent = utils.wrapSlideIntro(slideIntro);

    var sectionInstance = new SectionElement(false, false);
    sectionInstance.sectionHeader = sectionHeader;
    sectionInstance.insertSubsectionElement(subsectionInstance);

    var tocInstance = new TOCElement(tocType, false, false);
    tocInstance.tocLabel = tocLabel;
    tocInstance.insertSectionElement(sectionInstance);

    return tocInstance;
}

function pdfSlideIntro (firstThree, lastThree, articleID, language) {
    var result = `
        <p>
        <style type="text/css">
            #inlinePdfChrome {display:none;} #inlinePdfNonChrome {display:block;} #edu_left_col {width:100% !important;}
        </style>
            <span class="disableAccmeOverlay" id="inlinePdfNonChrome">
                <object width="100%" height="500px" data="http://img.medscapestatic.com/images/${firstThree}/${lastThree}/${articleID}_${language.transcriptSuffix}.pdf#view=FitV" type="application/pdf">
                    <div id="dlSlides">
                        <p>Download the pdf.</p>
                        <div class="dlBtn">
                            <a class="cme_btn" href="http://img.medscapestatic.com/images/${firstThree}/${lastThree}/${articleID}_${language.transcriptSuffix}.pdf" target="_blank">Download Now</a>
                        </div>
                    </div>
                </object>
            </span>
            <iframe width="860px" height="500px" class="disableAccmeOverlay" id="inlinePdfChrome" src="http://img.medscapestatic.com/images/${firstThree}/${lastThree}/${articleID}_${language.transcriptSuffix}.pdf">&nbsp;</iframe>
        </p>
    `;
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function videoEmbed (articleID, language) {
    var result = `
    <div class="app-loading">
    <div class="webcomp-player" data-config="en/pi/editorial/studio/configs/2018/education/${articleID}/${articleID}_${language.videoConfigSuffix}.json" data-playertype="edu" id="cme-video-player">&nbsp;</div>
    </div>
    `;
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function expertCommentary(articleID, language, programTitle) {    
    var tocLabel = language.expertCommentary.calloutText; 
    var sectionHeader = language.expertCommentary.calloutText;
    var tocType = language.expertCommentary.tocType;
    var slideIntro = language.expertCommentary.addOnIntroduction(articleID, programTitle) + videoEmbed(articleID, language);
    return buildInLanguageTOC(slideIntro, sectionHeader, tocType, tocLabel);
}

function downloadablePDF (articleID, language, programTitle) {
    var firstThree = articleID.slice(0, 3);
    var lastThree = articleID.slice(3);
    var tocLabel = language.downloadablePDF.calloutText;
    var sectionHeader = language.downloadablePDF.calloutText;
    var tocType = language.downloadablePDF.tocType;
    var slideIntro = pdfSlideIntro(firstThree, lastThree, articleID, language);
    return buildInLanguageTOC(slideIntro, sectionHeader, tocType, tocLabel);
}

function transcriptPDF(articleID, language, programTitle) {
    var firstThree = articleID.slice(0, 3);
    var lastThree = articleID.slice(3);
    var tocLabel = language.transcriptPDF.calloutText;
    var sectionHeader = language.transcriptPDF.calloutText;
    var tocType = language.transcriptPDF.tocType;
    var slideIntro = pdfSlideIntro(firstThree, lastThree, articleID, language);
    return buildInLanguageTOC(slideIntro, sectionHeader, tocType, tocLabel);
}

function subtitles(articleID, language, programTitle) {
    var tocLabel = language.subtitles.calloutText; 
    var sectionHeader = language.subtitles.calloutText;
    var tocType = language.subtitles.tocType;
    var slideIntro = videoEmbed(articleID, language);
    return buildInLanguageTOC(slideIntro, sectionHeader, tocType, tocLabel);
}


module.exports = {
    downloadablePDF,
    transcriptPDF,
    expertCommentary,
    subtitles
};