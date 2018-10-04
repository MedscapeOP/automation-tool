var spotlightList = [
    'prof_article_slide_presentation',
    'front_label',
    'above_title',
    'title',
    'contrbtr_pre_content',
    'contrbtr_byline',
    'contrbtr_group',
    'contrbtr_bulk_info',
    'contrbtr_post_content',
    'supprtr_grant_group',
    'body_label',
    'toc_element',
    'back_label',
    'ref_grp',
    'cpyrt_holder',
    'cpyrt_ovrd',
    'disclmr_ovrd',
    'bkmtr_front',
    'bkmtr_glossary',
    'bkmtr_ack',
    'bkmtr_discl',
    'bkmtr_funding',
    'bkmtr_reprnt_addr',
    'bkmtr_abbr_notes',
    'bkmtr_last',
    'img_ttl_bkgrd',
    'img_publ_logo'
]

var curbsideList = [
    'prof_article_slide_presentation',
    'front_label',
    'above_title',
    'title',
    'contrbtr_pre_content',
    'contrbtr_byline',
    'contrbtr_group',
    'contrbtr_bulk_info',
    'contrbtr_post_content',
    'supprtr_grant_group',
    'body_label',
    'toc_element',
    'back_label',
    'ref_grp',
    'cpyrt_holder',
    'cpyrt_ovrd',
    'disclmr_ovrd',
    'bkmtr_front',
    'bkmtr_glossary',
    'bkmtr_ack',
    'bkmtr_discl',
    'bkmtr_funding',
    'bkmtr_reprnt_addr',
    'bkmtr_abbr_notes',
    'bkmtr_last',
    'img_ttl_bkgrd',
    'img_publ_logo'
]

var briefList = [
    'prof_article',
    'front_label',
    'above_title',
    'title',
    'contrbtr_pre_content',
    'contrbtr_byline',
    'contrbtr_group',
    'contrbtr_bulk_info',
    'contrbtr_post_content',
    'supprtr_grant_group',
    'body_label',
    'toc_element',
    'back_label',
    'layer_grp',
    'ref_grp',
    'cpyrt_holder',
    'cpyrt_ovrd',
    'disclmr_ovrd',
    'bkmtr_front',
    'bkmtr_glossary',
    'bkmtr_ack',
    'bkmtr_discl',
    'bkmtr_funding',
    'bkmtr_reprnt_addr',
    'bkmtr_abbr_notes',
    'bkmtr_last',
    'img_ttl_bkgrd',
    'img_publ_logo'
]

var jcmeList = [
    'prof_article',
    'front_label',
    'above_title',
    'title',
    'contrbtr_pre_content',
    'contrbtr_byline',
    'contrbtr_group',
    'contrbtr_bulk_info',
    'contrbtr_post_content',
    'supprtr_grant_group',
    'body_label',
    'toc_element',
    'back_label',
    'layer_grp',
    'ref_grp',
    'cpyrt_holder',
    'cpyrt_ovrd',
    'disclmr_ovrd',
    'bkmtr_front',
    'bkmtr_glossary',
    'bkmtr_ack',
    'bkmtr_discl',
    'bkmtr_funding',
    'bkmtr_reprnt_addr',
    'bkmtr_abbr_notes',
    'bkmtr_last',
    'img_ttl_bkgrd',
    'img_publ_logo'
];

var _ = require('lodash');

console.log(_.isEqual(curbsideList.sort(), spotlightList.sort())); //true


/*
SPOTLIGHT 
    <prof_article_slide_presentation>
        <front_label>Front Matter</front_label>
        <above_title/>
        <title>
            <p>Optimizing Statin Therapy: Role of Patient-Centered Care</p>
        </title>
        <contrbtr_pre_content>
            <p>As an organization accredited by the ACCME, Medscape, LLC, requires everyone who is in a position to control the content of an education activity to disclose all relevant financial relationships with any commercial interest.  The ACCME defines "relevant financial relationships" as financial relationships in any amount, occurring within the past 12 months, including financial relationships of a spouse or life partner, that could create a conflict of interest.</p>
            <p>Medscape, LLC, encourages Authors to identify investigational products or off-label uses of products regulated by the US Food and Drug Administration, at first mention and where appropriate in the content.</p>
        </contrbtr_pre_content>
        <contrbtr_byline>,
            <p>Joyce L. Ross, MSN, CRNP, CLS; Joseph Lillo, DO, CPI; Michael Cobble, MD</p>
        </contrbtr_byline>
        <contrbtr_group/>
        <contrbtr_group/>
        <contrbtr_bulk_info/>
        <contrbtr_post_content>
            <h3>Peer Reviewer</h3>
            <p>This activity has been peer reviewed and the reviewer has disclosed the following relevant financial relationships:
                <br/>
                Served as a consultant for: Abbot; Heartware ; Medtronic; Thoratec;
            </p>
        </contrbtr_post_content>
        <supprtr_grant_group>
            <supprtr_grant_attr>/webmd/professional_assets/medscape/images/grant_attribution/kowa_pharm_amer-ieg-txt.gif</supprtr_grant_attr>
        </supprtr_grant_group>
        <body_label>Body</body_label>
        <toc_element/>
        <back_label>Back Matter</back_label>
        <ref_grp>
            <ref_item/>
        </ref_grp>
        <cpyrt_holder>
            <p>Medscape, LLC</p>
        </cpyrt_holder>
        <cpyrt_ovrd/>
        <disclmr_ovrd/>
        <bkmtr_front>
            <p>
                <strong>Disclaimer</strong>
            </p>
            <p>The educational activity presented above may involve simulated case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient is intended or should be inferred.</p>
            <p>The material presented here does not necessarily reflect the views of Medscape, LLC, or companies that support educational programming on medscape.org. These materials may discuss therapeutic products that have not been approved by the US Food and Drug Administration and off-label uses of approved products. A qualified healthcare professional should be consulted before using any therapeutic product discussed. Readers should verify all information and data before treating patients or employing any therapies described in this educational activity.</p>
        </bkmtr_front>
        <bkmtr_glossary/>
        <bkmtr_ack/>
        <bkmtr_discl/>
        <bkmtr_funding/>
        <bkmtr_reprnt_addr/>
        <bkmtr_abbr_notes/>
        <bkmtr_last/>
        <img_ttl_bkgrd/>
        <img_publ_logo/>
    </prof_article_slide_presentation>
*/