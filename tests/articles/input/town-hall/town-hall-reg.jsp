<%-- include jsp tag libraries for use on the page --%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>
<%@ page import="com.webmd.common.ProfileCache" %>
<%@ page import="com.medscape.common.util.LocaleUtil" %>
<%@ page import="com.webmd.util.CommonAttributes" %>
<%@ page import="com.webmd.registration.core.User" %>
<%@ page import="com.webmd.registration.core.Address" %>
<%@ page import="com.webmd.registration.UserAttribute" %>
<%@ page import="org.apache.commons.codec.binary.Base64" %>
<%@ page import="com.webmd.common.core.WebMDProfessionalDomain"%>
<%@ page import="com.webmd.auth.core.GlobalRequestContext"%>
<%@ page import="java.util.*" %>

<%@ taglib uri="/WEB-INF/tld/prof-customtags.tld" prefix="medscape" %>
<%
    User user = null;
    user = (User) session.getAttribute(CommonAttributes.MEMBERINFO);
    String userName = "";
    String userFirstName = "";
    String userLastName = "";
    String userEmail = "";
    String userID = null;
    String userLocale = "";
    Integer qnaID; 
    
    if(user != null){ 
        userName = user.getDisplayName();
        userFirstName = user.getPerson().getFirstName();
        userLastName = user.getPerson().getLastName();
        userEmail = user.getPerson().getEmail().getAddress();
        //userID = user.getGlobalUserID();
        userLocale = user.getProfession().getLocale();  
    }

    String origURL = "https://"+request.getServerName()+request.getAttribute("javax.servlet.forward.request_uri").toString();
    byte[] b64Bytes = Base64.encodeBase64(origURL.getBytes());
    String b64String = new String(b64Bytes);
    String urlCache = CommonAttributes.URLCACHE + "=" + b64String;
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<%-- Page Title for tab bar, bookmarks, etc --%>
<title>Preventing HPV-Related Disease: From Global Perspectives to Local Solutions</title> 

<%-- Meta information for content scrapers, social media and search engines --%>
    <meta name="description" content="An international panel from high- and low-resource countries will share their perspectives and experiences with HPV prevention programs." />
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

<%-- Set QNA ID for Registration --%>    
<%  
    qnaID = 51168; 
%>

<%-- Set page variables --%>
<script type="text/javascript">
    //
    // be precise when updating these variables
    //
    var townHallAddress = "14 Darling Drive", //just street address
        townHallCity = "Sydney", //city
        townHallState = "NSW", //state
        townHallZip = "2000", //zip
        townHallFullAddress = townHallAddress + ", " + townHallCity + ", " + townHallState + " " + townHallZip, //full address: used for map too!
        encodedAddress = encodeURIComponent(townHallFullAddress);
    
    //used for QNA register form
    var regUsername = "<%=userName %>",
        regTitle = "",
        regFirstName = "<%=userFirstName %>",
        regLastName = "<%=userLastName %>",
        regEmail = "<%=userEmail %>",
        regUserId = "",
        regLocale = "<%=userLocale %>";

    var submitHeader = "Thank you for signing up, " + regTitle + " " + regFirstName + " " + regLastName,
        submitSubheader = "You will receive a reminder email the day before the event.";

    //add to calendar variables
    var atcDateStart = "2018-10-03 12:30:00",
        atcDateEnd = "2018-10-03 14:30:00",
        atcTimezone = "Australia/Sydney", // Use https://timezonedb.com/time-zones for format
        atcTitle = "Preventing HPV-Related Disease: From Global Perspectives to Local Solutions", //Event Title
        atcDescription = "An international panel from high- and low-resource countries will share their perspectives and experiences with HPV prevention programs. Please join us for this Medscape Live event. For more information, visit https://www.medscape.org/sites/townhall/public/hpv-global-to-local", //Activity teaser + Please join us for this Medscape Live event. For more information, visit https://www.medscape.org/sites/townhall/public/######
        atcLocation = "International Convention Centre Sydney, 14 Darling Drive, Sydney, NSW 2000, Australia", //Address of event
        atcOrganizer = "Medscape, LLC", //Default Medscape, LLC / WebMD Global if OUS.
        atcOrganizerEmail = "";//username@email.com - leave blank most of the time unless provided.


</script>

<%-- Include global style --%>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<%@ include file="/files/common/css/global-responsive.jsp" %>

<%-- Include townhall/calendar widget styles --%>
<link rel="stylesheet" href="//<medscape:domain type=" imageServer "/>/medscape-core/medscape-atc/css/medscape-atc.css" type="text/css" media="all" /> 
<link rel="stylesheet" href="//<medscape:domain type=" imageServer "/>/medscape-core/cme/css/townhall/townhall-new.css" type="text/css" media="all" /> 
<style>


<%--
//   ======================================================================
//   SPECIAL CLASSES:                                                     |
//   |--------------------------------------------------------------------|
//   |  * .town-hall-bgStripe: add to .town-hall__section to add bg color |
//   |====================================================================|

//   ===================================================================
//   |  Change background image of section via background-image: url   |
//   |-----------------------------------------------------------------|
//   |  * First declaration is for retina, second for non-retina. Be   |
//   |    sure to leave the "&resize=1240:600" at the end of the url.  |
//   |  * The background-color affects the color in front of the header|
//   |    and footer background image.                                 |
//   |=================================================================|


// Hero Section --%>
    @media only screen and (-webkit-min-device-pixel-ratio:2), only screen and (min-resolution:192dpi) {
    .town-hall-hero-content-bg {
        background-image: url('//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/hpv-global-to-local.jpg');
    }}
    .town-hall-hero-content-bg {
        background-image: url('//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/hpv-global-to-local.jpg?interpolation=lanczos-none&resize=1240:600'); /**/
    }
    .town-hall-hero-content-color {
        background-color: rgba(0, 0, 0, 0.4);
    }


<%-- // Footer Section--%>
    @media only screen and (-webkit-min-device-pixel-ratio:2), only screen and (min-resolution:192dpi) {
    .town-hall-footer-hero {
        background-image: url('//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/hpv-global-to-local.jpg');
    }}
    .town-hall-footer-hero {
        background-image: url('//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/hpv-global-to-local.jpg?interpolation=lanczos-none&resize=1240:600');/**/
    }
</style>

<%@ include file="/files/header/common/header-dfp.jsp" %>
</head>

<body>
<%-- REQUIRED --%>
    <var href="javascript:;" rel="<medscape:includeif loginStatus="false"><%=CommonAttributes.LOGIN_URL%>&<%=urlCache%></medscape:includeif>" class="townhall-entry" class="disabled button"<medscape:includeif loginStatus="true"> data-userid="<%=user.getGlobalUserID()*25 %>"</medscape:includeif>></var>
<%-- /REQUIRED --%>

<div class="town-hall" id="bodypadding">

<%-- Header Section --%>
<div class="town-hall-header">
    <div class="logo-wrapper">
        <div class="town-hall-medscape-logo">
            <a href="http://www.medscape.org"></a>
        </div>
        <div class="education"></div>
    </div>
    <div class="share-wrapper">
        <div class="share">Share</div>
        <div class="town-hall-share"></div> <a href="javascript:;" class="register">Register</a>
        <div class="tooltip">
            <a class="share-close" href="javascript:;">
                <img src="//img.medscape.com/pi/logos/townhall-new/close.svg" alt="close">
            </a>
            <ul>
                <li class="facebook">
                    <a href="javascript:;" data-track="face">
                        <img src="//img.medscapestatic.com/pi/logos/townhall-new/facebook.svg?9999" alt="facebook">
                    </a>
                </li>
                <li class="twitter">
                    <a href="javascript:;" data-track="twit">
                        <img src="//img.medscapestatic.com/pi/logos/townhall-new/twitter.svg?9999" alt="twitter">
                    </a>
                </li>
                <li class="linkedin">
                    <a href="javascript:;" data-track="link">
                        <img src="//img.medscapestatic.com/pi/logos/townhall-new/linkedin.svg?9999" alt="linkedin">
                    </a>
                </li>
                <li class="google">
                    <a href="javascript:;" data-track="google">
                        <img src="//img.medscapestatic.com/pi/logos/townhall-new/googleplus.svg?9999" alt="google">
                    </a>
                </li>
                <li class="mail">
                    <a href="javascript:;" data-track="email">
                        <img src="//img.medscapestatic.com/pi/logos/townhall-new/email.svg?9999" alt="email">
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="town-hall-hero">
    <div class="town-hall-nav show-nav">
        <div class="town-hall-navbg">
            
        <%-- Navigation Section --%>
        <%--
        //   ===================================================================
        //   |  Reorder nav elements to match the section                  |
        //   |-----------------------------------------------------------------|
        //   |  * Anchors are named based on the section (without 'town-hall-')|
        //   |  * Change link-title per ancher section                         |
        //   |=================================================================|
        --%>
            <ul>
                <li>
                    <a href="#register" data-section="register" class="">
                        <input type="radio" name="navLink" id="register-0">
                        <label class="link" for="register-0"></label>
                        <span class="link-title">Registration/Overview</span>
                        <span class="linkbg"></span>
                    </a>
                </li>
                <li>
                    <a href="#content" data-section="content" class="">
                        <input type="radio" name="navLink" id="content-2">
                        <label class="link" for="content-2"></label>
                        <span class="link-title">Speakers/Program</span>
                        <span class="linkbg"></span>
                    </a>
                </li>
                <li>
                    <a href="#details" data-section="details" class="">
                        <input type="radio" name="navLink" id="details-4">
                        <label class="link" for="details-4"></label>
                        <span class="link-title">Activity Information</span>
                        <span class="linkbg"></span>
                    </a>
                </li>
                <li>
                    <a href="#map" data-section="map">
                        <input type="radio" name="navLink" id="map-5">
                        <label class="link" for="map-5"></label>
                        <span class="link-title">Map</span>
                        <span class="linkbg"></span>
                    </a>
                </li>
                <li>
                    <a href="#sponsors" data-section="sponsors" class="">
                        <input type="radio" name="navLink" id="sponsors-6">
                        <label class="link" for="sponsors-6"></label> <span class="link-title">Partner/Supporter</span>
                        <span class="linkbg"></span>
                    </a>
                </li>
            </ul>
            <%-- /Navigation Section --%>
        </div>
    </div>
    <div class="town-hall-hero-content-color"></div>
    <div class="town-hall-hero-content-bg"></div>
    <svg width='0' height='0'>
        <defs>
            <clipPath id="clipping" clipPathUnits="objectBoundingBox">
            <polygon points="0 0, 1 0, 1 0.85, 0.5 1, 0 0.85" />
            </clipPath>
        </defs>
    </svg>
    <svg width='0' height='0'>
        <defs>
        <clipPath id="clipping2" clipPathUnits="objectBoundingBox">
            <polygon points="0 0, 1 0, 1 0.9, 0.5 1, 0 0.9" />
        </clipPath>
        </defs>
    </svg>

    <%-- Header Details --%>
    <div class="town-hall-hero-content">
        <div class="town-hall-title">Preventing HPV-Related Disease</div>
        <div class="town-hall-subtitle">From Global Perspectives to Local Solutions</div>
        <div class="town-hall-location">Sydney, Australia - International Convention Centre Sydney</div>
        <div class="town-hall-calander">October 3, 2018 <span>@</span> 12:30pm</div>
        <div class="medscape-live">
            <img src="//img.medscapestatic.com/pi/sites/townhall/supporter-logos/medscape-live-stacked.svg">
        </div>
    </div>
    <%-- /Header Details --%>
    
    <div class="town-hall-activity-nav">
        <ul></ul>
    </div>
</div>
<div class="town-hall-register-arrow"></div>
<%-- /Header Section --%>

<%-- Registration Section --%>
<div class="register-now town-hall-register town-hall__section">
    <div class="qna-render" data-formid="1" data-render="1" data-curpage="1" data-totalpages="1" data-questionnaireid="<%=qnaID %>"></div>
</div>
<%-- /Registration Section --%>

<%--    ------------------ TownHall Info ---------------------  
//   ========================================================================
//   SPECIAL CLASSES:                                                       |
//   |--------------------------------------------------------------------  |
//   |  * .icon-left, .icon-right: added to the info .town-hall--subsection |
//   |====================================================================  |
 --%>
<div class="town-hall-info town-hall__section town-hall__section--ready">
    <div class="town-hall--subsection background icon-left">
        <div class="title">Activity Overview</div>
        <p class="detail">Human papillomavirus (HPV) infection has been well-established as the leading cause of cervical cancer, but a significant and growing body of evidence has linked HPV to anogenital cancers (anus, vulva, vagina and penis) and head and neck cancers. Worldwide, there are more than 630,000 HPV- associated cancers every year. HPV vaccination has the potential to dramatically reduce the burden of HPV-associated cancers. In this session, pioneers of these efforts from low- and high-resource countries will share global perspectives on challenges, solutions, successes, andvaluable lessons learned from setbacks and failures in the efforts to reduce HPV-related disease and death.</p>
    </div>
</div>

<%-- Speakers/Program Section --%>
<div class="town-hall-content town-hall__section town-hall__section--ready town-hall-bgStripe">
<%--
//   ===================================================================
//   |  Reorder .speaker-list-item elements as needed; editing the     |
//   |  following as necessary:                                        |
//   |-----------------------------------------------------------------|
//   |  * change image as needed                                       |
//   |  * .speaker-name                                                |
//   |  * .speaker-title                                               |
//   |  * .speaker-info                                                |
//   |  * .speaker-twitter                                             |
//   |  * .speaker-linkedin                                            |
//   |=================================================================|
--%>
<div class="town-hall-speaker town-hall--subsection">
    <div class="speaker">Speakers</div>
    <div class="speaker-list">
        <ul class="speaker-list-item">
            <li>
                <img src="//img.medscapestatic.com/person/alexander_kenneth_a.jpg" title="Co-Moderator">
            </li>
            <li>
                <div class="speaker-name">Kenneth A. Alexander, MD, PhD</div>
                <div class="speaker-title">Co-Moderator</div>
                <div class="speaker-info">                
                    Chief
                    <br>
                    Division of Infectious Diseases
                    <br>
                    Nemours Children's Hospital
                    <br>
                    Orlando, Florida                
                </div>
            </li>
        </ul>
        <ul class="speaker-list-item">
            <li>
                <img src="//img.medscapestatic.com/person/garland_suzanne_m.jpg" title="Co-Moderator">
            </li>
            <li>
                <div class="speaker-name">Suzanne M. Garland, AO, MBBS, MD, FRCPA, FRANZCOG&#160;<em>Ad Eundem,&#160;</em>FAChSHM, FASM, FFSc(RCPA)</div>
                <div class="speaker-title">Co-Moderator</div>
                <div class="speaker-info">                
                    Professor
                    <br>
                    Reproductive &amp; Neonatal Infectious Diseases
                    <br>
                    Department of Obstetrics and Gynecology
                    <br>
                    Melbourne Medical School
                    <br>
                    Melbourne, Australia            
                </div>
            </li>
        </ul>
        <ul class="speaker-list-item">
            <li>
                <img src="//img.medscapestatic.com/person/kumarasamy_suresh.jpg" title="Panelist">
            </li>
            <li>
                <div class="speaker-name">Suresh Kumarasamy, MBBS, MObGyn, FRCOG, FRCPI</div>
                <div class="speaker-title">Panelist</div>
                <div class="speaker-info">
                    Adjunct Clinical Professor
                    <br>
                    Penang Medical College
                    <br>
                    Consultant Gynecologist and Gynecological Oncologist
                    <br>
                    Gleneagles Penang
                    <br>
                    Georgetown, Malaysia
                </div>
            </li>
        </ul>
        <ul class="speaker-list-item">
            <li>
                <img src="//img.medscapestatic.com/person/tsetsegsaikhan_batmunkh.jpg" title="Panelist">
            </li>
            <li>
                <div class="speaker-name">Batmunkh Tsetsegsaikhan, PhD, MPH/MHM</div>
                <div class="speaker-title">Panelist</div>
                <div class="speaker-info">
                    Founder &amp; CEO
                    <br>
                    National Cancer Council of Mongolia
                    <br>
                    Ulaanbaatar, Mongolia
                </div>
            </li>
        </ul>
    </div>
</div>
<div class="town-hall-program town-hall--subsection">
<%--
//   ===================================================================
//   |  Reorder .program-timeline elements as needed; editing the     |
//   |  following as necessary:                                        |
//   |-----------------------------------------------------------------|
//   |  * .program-subtitle                                            |
//   |  * .program-schedule                                            |
//   |  * .program-info-title                                          |
//   |  * .program-info-subtitle                                       |
//   |=================================================================|
    --%>
        <div class="program-title">
            <span>Program</span>
            <span class="program-subtitle">Wednesday, 3 October, 2018</span>
        </div>
        <div class="program-timeline-wrap">
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>12:30</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Registration</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>13:00</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Welcome and Introductions</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>13:05</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">The HPV Vaccine: What We Know </div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>13:15</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Spotlight on HPV-Related Cancer Prevention: Australia</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>13:35</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Spotlight on HPV-Related Cancer Prevention: Malaysia</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>13:55</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Spotlight on HPV-Related Cancer Prevention: Mongolia</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>14:15</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Concluding Remarks</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
            <ul class="program-timeline">
                <li class="program-schedule">
                    <span>14:20</span>
                </li>
                <li class="program-progress">
                    <span>
                        <span class="program-timepoint"></span>
                        <span class="program-timebar"></span>
                    </span>
                </li>
                <li class="program-info-wrap">
                    <div class="program-info-title">Audience Q &amp; A</div>
                    <div class="program-info-subtitle"></div>
                </li>
            </ul>
        </div>
    </div>
</div>

        <%-- PHOTOBAR Section --%>
        <%--
//   ===================================================================
//   |  A collection of span tags with background images in any order  |
//   |=================================================================|
    --%>
<%-- <div class="town-hall-photobar town-hall__section town-hall__section--ready">

    <span style="background-image: url(//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/image-program-a.jpg)"></span>
    <span style="background-image: url(//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/image-program-a.jpg)"></span>
    <span style="background-image: url(//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/image-program-a.jpg)"></span>
    <span style="background-image: url(//img.medscapestatic.com/pi/sites/townhall/hpv-global-to-local/image-program-a.jpg)"></span>
</div> --%>

<div class="town-hall-details town-hall__section town-hall__section--ready">
<%-- TownHall Details Section --%>
<%--
//   ===================================================================
//   |  Two columns: section-left & section-right                      |
//   |  Reorder or add .objective-section elements as needed;          |
//   |  editing the following as necessary:                            |
//   |-----------------------------------------------------------------|
//   |  * .section-title                                               |
//   |  * .section-info                                                |
//   |  * .section-list: add list and sublists                         |
//   |-----------------------------------------------------------------|
//   |  Special Classes (add to .objective-section):                   |
//   |  * .section-disclosure: disclosure section                      |
//   |  * .section-credits: credits section                            |
//   |  * .section-accreditation:  accreditation section               |
//   |  * .section-logos: handles the logos                            |
//   |=================================================================|
    --%>
    <div class="section-left">
        <div class="objective-section">
            <div class="section-title">Learning Objectives</div>
            <div class="section-info">Upon completion of this activity, participants will:</div>
            <ul class="section-list">
                <li>Have increased knowledge regarding the 
                    <ul>
                        <li>Burden of HPV-related cancers</li>
                        <li>Real-world efficacy and safety of the HPV vaccine</li>
                        <li>Strategies that are making HPV elimination possible</li>
                    </ul>
                </li>
                <li>Have greater competence related to
                    <ul>
                        <li>Translating what is known about the HPV vaccine into a message that will increase vaccine uptake</li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="objective-section">
            <div class="section-title">Target Audience</div>
            <div class="section-info">This activity is intended for pediatricians, primary care physicians, and obstetricians/gynecologists.</div>
        </div>
        <div class="objective-section">
            <div class="section-title">Goal Statement</div>
            <div class="section-info">The goals of this activity are to increase HPV vaccine uptake and decrease HPV-related cancers in females and males.</div>
        </div>
        <%-- <div class="objective-section">
            <div class="section-title">Hours Of Participation For Allied Health Care Professionals</div>
            <div class="section-info">The Medical College of Wisconsin designates this activity for up to 1.0 hours of participation for continuing education for allied health professionals.</div>
        </div>
        <div class="objective-section section-disclosure">
            <div class="section-title">Association Disclaimer Statement </div>
            <div class="section-info">As an organization accredited by the ACCME, Medscape, LLC, requires everyone who is in a position to control the content of an educational activity to disclose all relevant financial relationships with any commercial interest. The ACCME defines 'relevant financial relationships' as financial relationships in any amount, occurring within the past 12 months, including financial relationships of a spouse or life partner that could create a conflict of interest. Medscape, LLC, encourages Authors to identify investigational products or off-label uses of products regulated by the US Food and Drug Administration at first mention and where appropriate in the content.</div>
        </div> --%>
    </div>
    <div class="section-right">
        <div class="objective-section section-credits">
            <div class="section-title">Credits Available</div>
            <ul class="section-list">
                <li>1.50</li>
                <li>For Physicians</li>
            </ul>
            <div class="section-info">Medscape, LLC designates this live activity for a maximum of 1.5 <em>AMA PRA Category 1 Credit(s)&trade;</em>. Physicians should claim only the credit commensurate with the extent of their participation in the activity.</div><%-- Leave div empty if OUS--%>
            <ul class="section-list">
                <li>1.50</li>
                <li>For Nurses</li>
            </ul>
            <div class="section-info">Awarded 1.5 contact hour(s) of continuing nursing education for RNs and APNs.</div>
        </div>
        <div class="objective-section section-accreditation">
            <div class="section-title">Accreditation Statement</div>
            <div class="section-info">In support of improving patient care, Medscape, LLC is jointly accredited by the Accreditation Council for Continuing Medical Education (ACCME), the Accreditation Council for Pharmacy Education (ACPE), and the American Nurses Credentialing Center (ANCC), to provide continuing education for the healthcare team.</div>
            <%-- 
            OUS 
            The Faculty of Pharmaceutical Medicine of the Royal Colleges of Physicians of the United Kingdom (FPM) has reviewed and approved the content of this educational activity and allocated it 2.0 continuing professional development credits (CPD).
            --%>
        </div>
        <div class="objective-section section-logos">
            <div class="section-title"></div>
            <div class="section-info"></div>
            <ul class="section-list">
                <li>
                    <img src="//img.medscapestatic.com/pi/logos/townhall-new/medscape-1-150-x-34@3x.png">
                </li>
                <li>
                    <img src="//img.medscapestatic.com/pi/logos/townhall-new/interprofessional-continuing-education@3x.png">
                </li>
                <%-- Replace with below if OUS
                <li>
                    <img src="//img.medscapestatic.com/pi/sites/townhall/supporter-logos/WebMD_Global_RGB-logo-250x30.png">
                </li>
                --%>
            </ul>
        </div>
    </div>
</div>

<div class="town-hall-map town-hall__section town-hall__section--ready">
<%-- TownHall Map Section --%>
<%--
//   ===================================================================
//   |  Only edits needed are to update the location details           |
//   |=================================================================|
    --%>
    <div class="town-hall-mapNav" id="town-hall-mapNav"></div>
    <div class="town-hall-maplocation">
        <div class="town-hall-maplocation--wrapper">
            <div class="town-hall-maplocation--city">Sydney</div>
            <div class="town-hall-maplocation--venue">International Convention Centre Sydney</div>
            <div class="town-hall-maplocation--room">Room:  Hall C4.4</div>
            <div class="town-hall-maplocation--address"></div>
        </div>
    </div>
</div>

<div class="town-hall-sponsors town-hall__section town-hall__section--ready">
<%-- TownHall Partners/Sponsors Section --%>
<%--
//   ===================================================================
//   ===================================================================
//   |  Edit .town-hall-(partners/supporters) elements as needed;      |
//   |  editing the following as necessary:                            |
//   |-----------------------------------------------------------------|
//   |  * .(partners/supporters)-title                                 |
//   |  * .(partners/supporters)-info                                  |
//   |  * .(partners/supporters)-logos: takes a data-speed attribute   |
//   |  to speed up or slow down rotation. Images can be placed in any |
//   |  order                                                          |
//   |  remove (partners/supporters) section + .divider-bar if needed  |
//   |=================================================================|
--%>
    <%-- <div class="town-hall-partners">
        <div class="partners-title">Partner</div>
        <div class="partners-info">Medscape is in partnership with:</div>
        <div class="partners-logos" data-speed="3">
            <div><img src="//img.medscapestatic.com/pi/logos/townhall-new/medscape-1-150-x-34@3x.png"></div>
            <div><img src="//img.medscapestatic.com/pi/logos/townhall-new/interprofessional-continuing-education@3x.png"></div>
            <div>Exespanxis, Inc.</div>
            <div><img src="//img.medscapestatic.com/pi/logos/townhall-new/medscape-1-150-x-34@3x.png"></div>
        </div>
    </div>

    <div class="divider-bar"></div> --%>
    
    <div class="town-hall-supporters">
        <div class="supporters-title">Supporter</div>
        <div class="supporters-info">Supported by an independent educational grant from</div>
        <div class="supporters-logos" data-speed="3">
            <div>Merck &amp; Co., Inc.</div>        
            <%--<div><img src="//img.medscapestatic.com/provider/ipsen.200x59.png"></div>--%>
        </div>
    </div>
</div>
<%--    ------------------ FOOTER ---------------------    --%>
    <div class="town-hall-footer">
        <div class="town-hall-footer-hero"></div>
        <div class="town-hall-footer-hero-content"></div>
    </div>
<%--    ------------------ /FOOTER ---------------------    --%>
<svg width='0' height='0'>
        <defs>
        <clipPath id="clippingFoot" clipPathUnits="objectBoundingBox">
            <polygon points="0 1, 1 1, 1 0.35, 0.5 0, 0 0.35" />
        </clipPath>
        </defs>
    </svg>
</div>



<script src="//<medscape:domain type="imageServer"/>/medscape-core/qna-lib/js/qna.min.js"></script>
<script src="//<medscape:domain type=" imageServer "/>/medscape-core/medscape-atc/js/medscape-atc.js"></script>
<script type="text/javascript" src="//<medscape:domain type="imageServer"/>/medscape-core/cme/js/townhall/townhall-new.js"></script>

<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDMHG2py_aiHSKDYhEvIjt8Cy_zVN-W7Ag&callback=googleGeo"></script>
<%@ include file="/files/common/footer/footer-blank.jsp" %>
</body>
</html>