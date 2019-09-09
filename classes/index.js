const XMLElement = require('./xml_element');
const ProfArticle = require('./prof_article');
const ProfActivity = require('./prof_activity');
const TOCElement = require('./toc_element');
const SectionElement = require('./sec_element');
const SubsectionElement = require('./subsec_element');
const SlideGroup = require('./slide_grp');
const SlideComponent = require('./slide_component');
const Component = require('./component');
const ArticleChecklist = require('./article_checklist');
const BriefChecklist = require('./brief_checklist');
const FirstResponseChecklist = require('./first_response_checklist');
const SpotlightChecklist = require('./spotlight_checklist');
const TownHallEnduringChecklist = require('./townhall_enduring_checklist');
const TownHallCertChecklist = require('./townhall_cert_checklist');
const TownHallRegChecklist = require('./townhall_reg_checklist');
const TestAndTeachChecklist = require('./test-and-teach-checklist');
const PropertiesChecklist = require('./properties_checklist');
const ActivityChecklist = require('./activity_checklist');
const ProgramTimeline = require('./program_timeline');
const ContributorGroup = require('./contrbtr_group');
const ContributorElement = require('./contrbtr_element');

module.exports = {
    XMLElement,
    ProfArticle,
    ProfActivity,
    TOCElement,
    SectionElement,
    SubsectionElement,
    SlideGroup,
    SlideComponent,
    Component,
    ArticleChecklist,
    SpotlightChecklist,
    FirstResponseChecklist,
    BriefChecklist,
    TownHallEnduringChecklist,
    TownHallCertChecklist,
    TownHallRegChecklist,
    TestAndTeachChecklist,
    PropertiesChecklist,
    ActivityChecklist,
    ProgramTimeline,
    ContributorGroup,
    ContributorElement
}