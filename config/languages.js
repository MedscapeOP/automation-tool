// USE CLIP INSTEAD OF CONFLUENCE TO BUILD OBJECT
// Put required code snippets inside of language object
module.exports = {
    english: {
        videoConfigSuffix: "e",
        xmlLang: "en"
    },
    spanishLATAM: {
        videoConfigSuffix: "s",
        xmlLang: "es-419",
        transcriptSuffix: "transcript_spa",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Comentarios en espa&#241;ol",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Este comentario es parte de una actividad educativa m&#225;s extensa. Despu&#233;s de participar, vuelva a&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;&#160;para acceder a todo el contenido educativo relacionado.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "pdf descargable en espa&#241;ol"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Transcripci&#243;n en espa&#241;ol"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Subt&#237;tulos en espa&#241;ol"
        }
    },
    spanishSpain: {
        videoConfigSuffix: "s",
        xmlLang: "es",
        transcriptSuffix: "transcript_spa",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "comentarios de expertos en ingl&#233;s",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Este comentario es parte de una actividad educativa m&#225;s extensa. Despu&#233;s de participar, vuelva a&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;&#160;para acceder a todo el contenido educativo relacionado.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "pdf descargable en espa&#241;ol"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "transcripci&#243;n en ingl&#233;s"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "subt&#237;tulos en ingl&#233;s"
        }
    },
    french: {
        videoConfigSuffix: "f",
        xmlLang: "fr",
        transcriptSuffix: "transcript_fre",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Commentaire d'expert en fran&#231;ais",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                    <p>Ce commentaire fait partie d&#8217;une activit&#233; de formation plus vaste.<strong>&#160;</strong>Apr&#232;s la participation, pri&#232;re de retourner &#224;&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;pour acc&#233;der &#224; l&#8217;ensemble du contenu de formation reli&#233;.&#160;</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "PDF t&#233;l&#233;chargeable en fran&#231;ais"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Transcription en fran&#231;ais"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Sous-titres en fran&#231;ais"
        }
    },
    italian: {
        videoConfigSuffix: "i",
        xmlLang: "it",
        transcriptSuffix: "transcript_ita",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Commento dell'esperto in italiano",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Il presente commento fa parte di un'attivit&#224; didattica pi&#249; ampia.<strong>&#160;</strong>Dopo la partecipazione, si prega di tornare a&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;per accedere all'intero contenuto didattico correlato.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "PDF scaricabile in italiano"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Trascrizione in italiano"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Sottotitoli in italiano"
        }
    },
    german: {
        videoConfigSuffix: "g",
        xmlLang: "de",
        transcriptSuffix: "transcript_ger",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Deutscher Expertenkommentar",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Dieser Kommentar ist Teil einer umfangreicheren Fortbildungsma&#223;nahme. Kehren Sie f&#252;r den Zugriff auf alle zugeh&#246;rigen Fortbildungsinhalte nach Ihrer Teilnahme bitte zur&#252;ck zu&#160;&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "herunterladbare pdf-Datei in Deutsch"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Transkription in Deutsch"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Deutsche Untertitel"
        }
    },
    portugueseBrazil: {
        videoConfigSuffix: "p",
        xmlLang: "pt",
        transcriptSuffix: "transcript_por",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Coment&#225;rio de especialista em portugu&#234;s",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Este coment&#225;rio faz parte de uma atividade educacional maior. Depois de participar, por favor voltar ao&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>para acessar todo o conte&#250;do educativo relacionado.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "Dispon&#237;vel para download em pdf"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Transcri&#231;&#227;o em portugu&#234;s"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Legendas em portugu&#234;s"
        }
    },
    portuguesePortugal: {
        videoConfigSuffix: "p",
        xmlLang: "pt",
        transcriptSuffix: "transcript_por",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Coment&#225;rios de especialistas em portugu&#234;s",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Este coment&#225;rio faz parte de uma atividade de forma&#231;&#227;o mais ampla. Ap&#243;s participar, por favor volte a&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>para aceder a todo o conte&#250;do de forma&#231;&#227;o relacionado.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "PDF transfer&#237;vel em portugu&#234;s"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Transcri&#231;&#227;o em portugu&#234;s"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Legendas em portugu&#234;s"
        }
    },
    danish: {
        videoConfigSuffix: "d",
        xmlLang: "da",
        transcriptSuffix: "transcript_dan",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "Dansk ekspertkommentar",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>Need Statement in Danish<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong></p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "PDF p&#229; dansk, som kan downloades"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "Kopi p&#229; dansk"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "Danske undertekster"
        }
    },
    russian: {
        videoConfigSuffix: "r",
        xmlLang: "ru",
        transcriptSuffix: "transcript_rus",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "&#1050;&#1086;&#1084;&#1084;&#1077;&#1085;&#1090;&#1072;&#1088;&#1080;&#1080; &#1101;&#1082;&#1089;&#1087;&#1077;&#1088;&#1090;&#1072; &#1085;&#1072; &#1088;&#1091;&#1089;&#1089;&#1082;&#1086;&#1084; &#1103;&#1079;&#1099;&#1082;&#1077;",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>&#160;&#1044;&#1072;&#1085;&#1085;&#1099;&#1081; &#1082;&#1086;&#1084;&#1084;&#1077;&#1085;&#1090;&#1072;&#1088;&#1080;&#1081; &#1103;&#1074;&#1083;&#1103;&#1077;&#1090;&#1089;&#1103; &#1095;&#1072;&#1089;&#1090;&#1100;&#1102; &#1073;&#1086;&#1083;&#1077;&#1077; &#1082;&#1088;&#1091;&#1087;&#1085;&#1086;&#1081; &#1086;&#1073;&#1088;&#1072;&#1079;&#1086;&#1074;&#1072;&#1090;&#1077;&#1083;&#1100;&#1085;&#1086;&#1081; &#1076;&#1077;&#1103;&#1090;&#1077;&#1083;&#1100;&#1085;&#1086;&#1089;&#1090;&#1080;.<strong>&#160;&#160;</strong>&#1055;&#1086;&#1089;&#1083;&#1077; &#1091;&#1095;&#1072;&#1089;&#1090;&#1080;&#1103;, &#1087;&#1086;&#1078;&#1072;&#1083;&#1091;&#1081;&#1089;&#1090;&#1072;, &#1074;&#1077;&#1088;&#1085;&#1080;&#1090;&#1077;&#1089;&#1100; &#1082;&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;&#1076;&#1083;&#1103; &#1087;&#1086;&#1083;&#1091;&#1095;&#1077;&#1085;&#1080;&#1103; &#1076;&#1086;&#1089;&#1090;&#1091;&#1087;&#1072; &#1082;&#1086; &#1074;&#1089;&#1077;&#1084; &#1089;&#1086;&#1086;&#1090;&#1074;&#1077;&#1090;&#1089;&#1090;&#1074;&#1091;&#1102;&#1097;&#1080;&#1084; &#1086;&#1073;&#1088;&#1072;&#1079;&#1086;&#1074;&#1072;&#1090;&#1077;&#1083;&#1100;&#1085;&#1099;&#1084; &#1084;&#1072;&#1090;&#1077;&#1088;&#1080;&#1072;&#1083;&#1072;&#1084;.&#160;</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "&#1057;&#1082;&#1072;&#1095;&#1080;&#1074;&#1072;&#1077;&#1084;&#1099;&#1081; &#1074; &#1092;&#1086;&#1088;&#1084;&#1072;&#1090;&#1077; pdf &#1085;&#1072; &#1088;&#1091;&#1089;&#1089;&#1082;&#1086;&#1084; &#1103;&#1079;&#1099;&#1082;&#1077;"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "&#1058;&#1088;&#1072;&#1085;&#1089;&#1082;&#1088;&#1080;&#1087;&#1090; &#1085;&#1072; &#1088;&#1091;&#1089;&#1089;&#1082;&#1086;&#1084; &#1103;&#1079;&#1099;&#1082;&#1077;"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "&#1057;&#1091;&#1073;&#1090;&#1080;&#1090;&#1088;&#1099; &#1085;&#1072; &#1088;&#1091;&#1089;&#1089;&#1082;&#1086;&#1084; &#1103;&#1079;&#1099;&#1082;&#1077;"
        }
    },
    japanese: {
        videoConfigSuffix: "j",
        xmlLang: "ja",
        transcriptSuffix: "transcript_jpn",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "&#26085;&#26412;&#35486;&#12398;&#23554;&#38272;&#23478;&#12395;&#12424;&#12427;&#35299;&#35500;",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>&#12371;&#12398;&#27880;&#37320;&#12399;&#12289;&#12424;&#12426;&#22823;&#12365;&#12394;&#25945;&#32946;&#12450;&#12463;&#12486;&#12451;&#12499;&#12486;&#12451;&#12398;&#19968;&#37096;&#12391;&#12377;&#12290;&#21442;&#21152;&#24460;&#12289;&#12377;&#12409;&#12390;&#12398;&#38306;&#36899;&#12377;&#12427;&#25945;&#32946;&#20869;&#23481;&#12395;&#12450;&#12463;&#12475;&#12473;&#12377;&#12427;&#12383;&#12417;&#12289;&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;&#12395;&#25147;&#12387;&#12390;&#12367;&#12384;&#12373;&#12356;&#12290;</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "&#12480;&#12454;&#12531;&#12525;&#12540;&#12489;&#21487;&#33021;&#12394;&#26085;&#26412;&#35486;PDF"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "&#26085;&#26412;&#35486;&#12398;&#12488;&#12521;&#12531;&#12473;&#12463;&#12522;&#12503;&#12488;"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "&#26085;&#26412;&#35486;&#12398;&#23383;&#24149;"
        }
    },
    korean: {
        videoConfigSuffix: "k",
        xmlLang: "ko",
        transcriptSuffix: "transcript_kor",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "&#54620;&#44397;&#50612; &#51204;&#47928;&#44032; &#51452;&#49437;",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>&#51060; &#45436;&#54217;&#51008; &#51204;&#52404; &#44368;&#50977; &#54876;&#46041;&#51032; &#54620; &#48512;&#48516;&#51077;&#45768;&#45796;.&#160; &#52280;&#50668;&#54616;&#49888; &#54980;, &#44288;&#47144;&#46108; &#47784;&#46304; &#44368;&#50977; &#45236;&#50857;&#50640; &#50641;&#49464;&#49828;&#54616;&#47140;&#47732;&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#47196; &#44032;&#49884;&#44592; &#48148;&#46989;&#45768;&#45796;.&#160;</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "&#45796;&#50868;&#47196;&#46300; &#44032;&#45733;&#54620; &#54620;&#44397;&#50612; PDF"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "&#54620;&#44397;&#50612; &#45824;&#48376;&#160;"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "&#54620;&#44397;&#50612; &#51088;&#47561;"
        }
    },
    chinese: {
        videoConfigSuffix: "c",
        xmlLang: "zh",
        transcriptSuffix: "transcript_chi",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "&#20013;&#25991;&#19987;&#23478;&#35780;&#35770;",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p>&#36825;&#20010;&#35780;&#35770;&#39033;&#30446;&#26159;&#19968;&#22823;&#22411;&#22521;&#35757;&#27963;&#21160;&#30340;&#19968;&#37096;&#20998;. &#21152;&#20837;&#20043;&#21518;, &#35831;&#22238; &#21040;&#160;<strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong>&#160;&#160;,&#20415;&#21487;&#35775;&#38382;&#25152;&#26377;&#30456;&#20851;&#30340;&#22521;&#35757;&#20869;&#23481;.</p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "&#21487;&#19979;&#36733;&#30340;PDF&#20013;&#25991;&#29256;"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: "&#20013;&#25991;&#25991;&#23383;&#31295;"
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: "&#20013;&#25991;&#23383;&#24149;"
        }
    },
    arabic: {
        videoConfigSuffix: "a",
        xmlLang: "ar",
        transcriptSuffix: "transcript_ara",
        expertCommentary: {
            tocType: "Sidebar",
            calloutText: "",
            addOnIntroduction: function (articleID, programTitle) {
                return `
                <p><strong><a href="/viewarticle/${articleID}">${programTitle}</a></strong></p>
                `;
            }
        }, 
        downloadablePDF: {
            tocType: "Sidebar",
            calloutText: "&#1605;&#1604;&#1601; PDF &#1602;&#1575;&#1576;&#1604; &#1604;&#1604;&#1578;&#1581;&#1605;&#1610;&#1604; &#1576;&#1575;&#1604;&#1604;&#1594;&#1577; &#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;&#160;"
        },
        transcriptPDF: {
            tocType: "Sidebar",
            calloutText: ""
        }, 
        subtitles: {
            tocType: "Sidebar",
            calloutText: ""
        }
    }
};