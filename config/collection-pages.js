// for title background image names - tentatively just banner-page-name.jpg
const _ = require('lodash');
const fs = require('fs-extra');

const collectionPages = [
    {
        "title": "ABC Cardiovascular Disparities Center 2020",
        "fileName": "abc-cardio-disparity",
        "bannerFileName": null
    },
    {
        "title": "ACS and Beyond: Worldwide Perspectives in Acute and Secondary Prevention",
        "fileName": "acs-and-beyond",
        "bannerFileName": "banner-acs-and-beyond-2017.jpg"
    },
    {
        "title": "ACS Management in the Modern Era",
        "fileName": "acs-management",
        "bannerFileName": "banner-acs-and-beyond-2017.jpg"
    },
    {
        "title": "Australia/New Zealand Coverage of Acute Coronary Syndrome",
        "fileName": "acute-coronary-syndrome",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Acute Heart Failure",
        "fileName": "acute-heart-failure",
        "bannerFileName": null
    },
    {
        "title": "Advances in Adult ADHD",
        "fileName": "adhd",
        "bannerFileName": null
    },
    {
        "title": "Antiplatelet Therapies",
        "fileName": "advances-antiplatelet-therapies",
        "bannerFileName": null
    },
    {
        "title": "Advancing MS Strategies: Targeting Irreversible Aspects of Disease Pathology",
        "fileName": "advancing-ms-strategies",
        "bannerFileName": null
    },
    {
        "title": "Medscape: Aesthetic Medicine CME/CE Interactive Lecture and Case Series",
        "fileName": "aesthetic-medicine",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Allergy Management",
        "fileName": "allergy-management",
        "bannerFileName": null
    },
    {
        "title": "Medscape: Anemia of Chronic Kidney Disease: The Current Therapeutic Landscape and Novel Treatment Options",
        "fileName": "anemia-ckd",
        "bannerFileName": null
    },
    {
        "title": "Advances in Dialysis-Associated Anemia",
        "fileName": "anemia-dialysis",
        "bannerFileName": null
    },
    {
        "title": "Medscape: Advances in Angiogenesis Inhibition",
        "fileName": "angiogenesis",
        "bannerFileName": null
    },
    {
        "title": "Management des Anticoagulants en Cardio-Neurovasculaire",
        "fileName": "anticoagulants-cardio-neurovasculaire",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Anticoagulation Management and Vascular Protection",
        "fileName": "anticoagulation-thrombosis",
        "bannerFileName": "banner-anticoagulation-thrombosis-2017.jpg"
    },
    {
        "title": "Advances in Antiplatelet Therapy: The CV and GI Risk Conundrum",
        "fileName": "antiplatelet-therapy",
        "bannerFileName": null
    },
    {
        "title": "Antithrombotic Therapies for Early Management of NSTE-Acute Coronary Syndromes",
        "fileName": "antithrombotic-therapies",
        "bannerFileName": null
    },
    {
        "title": "Medscape: Advances in Arrhythmia & Ischemia",
        "fileName": "arrhythmia-ischemia",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Atopic Dermatitis: From Barriers to Better Care",
        "fileName": "atopic-dermatitis",
        "bannerFileName": "banner-atopic-dermatitis-2017.jpg"
    },
    {
        "title": "Clinical Advances in Moderate-to-Severe Atopic Dermatitis",
        "fileName": "atopic-derm-mgt",
        "bannerFileName": "banner-atopic-derm-mgt.jpg"
    },
    {
        "title": "Advances in atrial fibrilation educational programs",
        "fileName": "atrial-fibrillation",
        "bannerFileName": null
    },
    {
        "title": "Advances in Beauty",
        "fileName": "beauty",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Bipolar Depression: A Path to Improved Patient Care",
        "fileName": "bipolar-depression",
        "bannerFileName": null
    },
    {
        "title": "Guided by Objective Measures: Challenging Case Scenarios in Rheumatoid Arthritis",
        "fileName": "blended-learning-ra",
        "bannerFileName": null
    },
    {
        "title": "",
        "fileName": "blood-pressure-control",
        "bannerFileName": "blood-pressure-control.jpg"
    },
    {
        "title": "",
        "fileName": "breast-cancer",
        "bannerFileName": "breast-cancer.jpg"
    },
    {
        "title": "",
        "fileName": "breast-cancer-metastatic",
        "bannerFileName": "breast-cancer-metastatic.jpg"
    },
    {
        "title": "",
        "fileName": "btk-inhibitors",
        "bannerFileName": "btk-inhibitors.jpg"
    },
    {
        "title": "",
        "fileName": "cancer-immunotherapy",
        "bannerFileName": "cancer-immunotherapy.jpg"
    },
    {
        "title": "",
        "fileName": "cardiac-biomarkers",
        "bannerFileName": "cardiac-biomarkers.jpg"
    },
    {
        "title": "",
        "fileName": "cardio-disease-t2dm",
        "bannerFileName": "cardio-disease-t2dm.jpg"
    },
    {
        "title": "",
        "fileName": "cardio-live-cases",
        "bannerFileName": "cardio-live-cases.jpg"
    },
    {
        "title": "",
        "fileName": "cardiology-diabetes-hot-topics",
        "bannerFileName": "cardiology-diabetes-hot-topics.jpg"
    },
    {
        "title": "",
        "fileName": "cardiometabolic-risk-management",
        "bannerFileName": "cardiometabolic-risk-management.jpg"
    },
    {
        "title": "",
        "fileName": "cdk4-6-inhibition-breast-cancer",
        "bannerFileName": "cdk4-6-inhibition-breast-cancer.jpg"
    },
    {
        "title": "",
        "fileName": "central-line-insertion",
        "bannerFileName": "central-line-insertion.jpg"
    },
    {
        "title": "",
        "fileName": "challenging-case-scenarios-ra",
        "bannerFileName": "challenging-case-scenarios-ra.jpg"
    },
    {
        "title": "",
        "fileName": "challenging-case-scenarios-ra-details",
        "bannerFileName": "challenging-case-scenarios-ra-details.jpg"
    },
    {
        "title": "",
        "fileName": "childhood-obesity",
        "bannerFileName": "childhood-obesity.jpg"
    },
    {
        "title": "",
        "fileName": "chronic-hyperkalemia",
        "bannerFileName": "chronic-hyperkalemia.jpg"
    },
    {
        "title": "",
        "fileName": "chronic-rhinosinusitis",
        "bannerFileName": "chronic-rhinosinusitis.jpg"
    },
    {
        "title": "",
        "fileName": "cinv-nausea",
        "bannerFileName": "cinv-nausea.jpg"
    },
    {
        "title": "",
        "fileName": "ckd-cvd",
        "bannerFileName": "ckd-cvd.jpg"
    },
    {
        "title": "",
        "fileName": "ckd-mineral-bone-disorder",
        "bannerFileName": "ckd-mineral-bone-disorder.jpg"
    },
    {
        "title": "",
        "fileName": "clinicaloncology",
        "bannerFileName": "clinicaloncology.jpg"
    },
    {
        "title": "",
        "fileName": "combination-therapy-for-pah",
        "bannerFileName": "combination-therapy-for-pah.jpg"
    },
    {
        "title": "",
        "fileName": "complement-disorders",
        "bannerFileName": "complement-disorders.jpg"
    },
    {
        "title": "",
        "fileName": "complex-dyslipidemia",
        "bannerFileName": "complex-dyslipidemia.jpg"
    },
    {
        "title": "",
        "fileName": "continuous-cardiac-monitoring",
        "bannerFileName": "continuous-cardiac-monitoring.jpg"
    },
    {
        "title": "",
        "fileName": "copd",
        "bannerFileName": "copd.jpg"
    },
    {
        "title": "",
        "fileName": "copd-asthma",
        "bannerFileName": "copd-asthma.jpg"
    },
    {
        "title": "",
        "fileName": "cteph",
        "bannerFileName": "cteph.jpg"
    },
    {
        "title": "",
        "fileName": "cv-disease-mgmt",
        "bannerFileName": "cv-disease-mgmt.jpg"
    },
    {
        "title": "",
        "fileName": "cv-risk-reduction",
        "bannerFileName": "cv-risk-reduction.jpg"
    },
    {
        "title": "",
        "fileName": "depression-treatment",
        "bannerFileName": "depression-treatment.jpg"
    },
    {
        "title": "",
        "fileName": "diabetes-cardiovascular",
        "bannerFileName": "diabetes-cardiovascular.jpg"
    },
    {
        "title": "",
        "fileName": "diabetes-cardiovascular-risk",
        "bannerFileName": "diabetes-cardiovascular-risk.jpg"
    },
    {
        "title": "",
        "fileName": "diabetes-edu-tv",
        "bannerFileName": "diabetes-edu-tv.jpg"
    },
    {
        "title": "",
        "fileName": "diabetes-incretin-therapy",
        "bannerFileName": "diabetes-incretin-therapy.jpg"
    },
    {
        "title": "",
        "fileName": "diabetes-management",
        "bannerFileName": "diabetes-management.jpg"
    },
    {
        "title": "",
        "fileName": "diabetesexchange",
        "bannerFileName": "diabetesexchange.jpg"
    },
    {
        "title": "",
        "fileName": "diagnostics",
        "bannerFileName": "diagnostics.jpg"
    },
    {
        "title": "",
        "fileName": "dna-damage-response",
        "bannerFileName": "dna-damage-response.jpg"
    },
    {
        "title": "",
        "fileName": "dna-damage-response-international",
        "bannerFileName": "dna-damage-response-international.jpg"
    },
    {
        "title": "",
        "fileName": "dna-damage-response-united-states",
        "bannerFileName": "dna-damage-response-united-states.jpg"
    },
    {
        "title": "",
        "fileName": "drug-eluting-stents-adv",
        "bannerFileName": "drug-eluting-stents-adv.jpg"
    },
    {
        "title": "",
        "fileName": "egfr-mutated-nsclc",
        "bannerFileName": "egfr-mutated-nsclc.jpg"
    },
    {
        "title": "",
        "fileName": "ehr",
        "bannerFileName": "ehr.jpg"
    },
    {
        "title": "",
        "fileName": "emerging-agents-ra",
        "bannerFileName": "emerging-agents-ra.jpg"
    },
    {
        "title": "",
        "fileName": "emerging-immunotherapy",
        "bannerFileName": "emerging-immunotherapy.jpg"
    },
    {
        "title": "",
        "fileName": "epilepsy",
        "bannerFileName": "epilepsy.jpg"
    },
    {
        "title": "",
        "fileName": "evolving-anticoagulation",
        "bannerFileName": "evolving-anticoagulation.jpg"
    },
    {
        "title": "",
        "fileName": "eye",
        "bannerFileName": "eye.jpg"
    },
    {
        "title": "",
        "fileName": "fa_mtev",
        "bannerFileName": "fa_mtev.jpg"
    },
    {
        "title": "",
        "fileName": "faster-acting-insulin",
        "bannerFileName": "faster-acting-insulin.jpg"
    },
    {
        "title": "",
        "fileName": "gene-therapy-hemophilia",
        "bannerFileName": "gene-therapy-hemophilia.jpg"
    },
    {
        "title": "",
        "fileName": "genitourinary-health",
        "bannerFileName": "genitourinary-health.jpg"
    },
    {
        "title": "",
        "fileName": "global-af-stroke-prevention",
        "bannerFileName": "global-af-stroke-prevention.jpg"
    },
    {
        "title": "",
        "fileName": "global-pah",
        "bannerFileName": "global-pah.jpg"
    },
    {
        "title": "",
        "fileName": "global-update-pneumococcal",
        "bannerFileName": "global-update-pneumococcal.jpg"
    },
    {
        "title": "",
        "fileName": "glp1",
        "bannerFileName": "glp1.jpg"
    },
    {
        "title": "",
        "fileName": "glp1-receptor-agonists",
        "bannerFileName": "glp1-receptor-agonists.jpg"
    },
    {
        "title": "",
        "fileName": "glycemic-control",
        "bannerFileName": "glycemic-control.jpg"
    },
    {
        "title": "",
        "fileName": "gout",
        "bannerFileName": "gout.jpg"
    },
    {
        "title": "",
        "fileName": "hcv",
        "bannerFileName": "hcv.jpg"
    },
    {
        "title": "",
        "fileName": "hcv2012",
        "bannerFileName": "hcv2012.jpg"
    },
    {
        "title": "",
        "fileName": "healthcare-reform",
        "bannerFileName": "healthcare-reform.jpg"
    },
    {
        "title": "",
        "fileName": "healthcare-updates",
        "bannerFileName": "healthcare-updates.jpg"
    },
    {
        "title": "",
        "fileName": "healthcare-updates-poll",
        "bannerFileName": "healthcare-updates-poll.jpg"
    },
    {
        "title": "",
        "fileName": "heart-of-woman",
        "bannerFileName": "heart-of-woman.jpg"
    },
    {
        "title": "",
        "fileName": "heart-rate-risk",
        "bannerFileName": "heart-rate-risk.jpg"
    },
    {
        "title": "",
        "fileName": "heartfailure-ckd-management",
        "bannerFileName": "heartfailure-ckd-management.jpg"
    },
    {
        "title": "",
        "fileName": "hematological-malignancies",
        "bannerFileName": "hematological-malignancies.jpg"
    },
    {
        "title": "",
        "fileName": "hemophilia-management",
        "bannerFileName": "hemophilia-management.jpg"
    },
    {
        "title": "",
        "fileName": "hepatitis-c",
        "bannerFileName": "hepatitis-c.jpg"
    },
    {
        "title": "",
        "fileName": "her2-cornerstone",
        "bannerFileName": "her2-cornerstone.jpg"
    },
    {
        "title": "",
        "fileName": "hereditary-angioedema",
        "bannerFileName": "hereditary-angioedema.jpg"
    },
    {
        "title": "",
        "fileName": "hernia",
        "bannerFileName": "hernia.jpg"
    },
    {
        "title": "",
        "fileName": "hiv-art-of-treatment",
        "bannerFileName": "hiv-art-of-treatment.jpg"
    },
    {
        "title": "",
        "fileName": "hiv-management",
        "bannerFileName": "hiv-management.jpg"
    },
    {
        "title": "",
        "fileName": "hiv-optimizing-patient-care",
        "bannerFileName": "hiv-optimizing-patient-care.jpg"
    },
    {
        "title": "",
        "fileName": "hiv-screening-prevention",
        "bannerFileName": "hiv-screening-prevention.jpg"
    },
    {
        "title": "",
        "fileName": "hiv-testing",
        "bannerFileName": "hiv-testing.jpg"
    },
    {
        "title": "",
        "fileName": "hormone-receptor-positive-breastcancer",
        "bannerFileName": "hormone-receptor-positive-breastcancer.jpg"
    },
    {
        "title": "",
        "fileName": "hot-topics-in-dermatology",
        "bannerFileName": "hot-topics-in-dermatology.jpg"
    },
    {
        "title": "",
        "fileName": "hot-topics-in-thromboembolic-disease",
        "bannerFileName": "hot-topics-in-thromboembolic-disease.jpg"
    },
    {
        "title": "",
        "fileName": "hr-positive-breast-cancer",
        "bannerFileName": "hr-positive-breast-cancer.jpg"
    },
    {
        "title": "",
        "fileName": "hyperhidrosis",
        "bannerFileName": "hyperhidrosis.jpg"
    },
    {
        "title": "",
        "fileName": "hyperkalemia",
        "bannerFileName": "hyperkalemia.jpg"
    },
    {
        "title": "",
        "fileName": "hypersomnolence",
        "bannerFileName": "hypersomnolence.jpg"
    },
    {
        "title": "",
        "fileName": "hypertriglyceridemia",
        "bannerFileName": "hypertriglyceridemia.jpg"
    },
    {
        "title": "",
        "fileName": "hypotension",
        "bannerFileName": "hypotension.jpg"
    },
    {
        "title": "",
        "fileName": "ibs-c-constipation",
        "bannerFileName": "ibs-c-constipation.jpg"
    },
    {
        "title": "",
        "fileName": "ic-onc",
        "bannerFileName": "ic-onc.jpg"
    },
    {
        "title": "",
        "fileName": "ic-onc-chicago",
        "bannerFileName": "ic-onc-chicago.jpg"
    },
    {
        "title": "",
        "fileName": "ic-onc-houston",
        "bannerFileName": "ic-onc-houston.jpg"
    },
    {
        "title": "",
        "fileName": "ic-onc-london-uk",
        "bannerFileName": "ic-onc-london-uk.jpg"
    },
    {
        "title": "",
        "fileName": "ic-onc-los-angeles",
        "bannerFileName": "ic-onc-los-angeles.jpg"
    },
    {
        "title": "",
        "fileName": "ic-onc-miami",
        "bannerFileName": "ic-onc-miami.jpg"
    },
    {
        "title": "",
        "fileName": "individualized-diab-mgmt",
        "bannerFileName": "individualized-diab-mgmt.jpg"
    },
    {
        "title": "",
        "fileName": "inflammatory-bowel-disease",
        "bannerFileName": "inflammatory-bowel-disease.jpg"
    },
    {
        "title": "",
        "fileName": "inflammatory-diseases",
        "bannerFileName": "inflammatory-diseases.jpg"
    },
    {
        "title": "",
        "fileName": "inflammatory-joint-diseases",
        "bannerFileName": "inflammatory-joint-diseases.jpg"
    },
    {
        "title": "",
        "fileName": "influenza-prevention",
        "bannerFileName": "influenza-prevention.jpg"
    },
    {
        "title": "",
        "fileName": "innovative-insulin-paradigms",
        "bannerFileName": "innovative-insulin-paradigms.jpg"
    },
    {
        "title": "",
        "fileName": "insulin-analogues",
        "bannerFileName": "insulin-analogues.jpg"
    },
    {
        "title": "",
        "fileName": "intensive-ldl-management",
        "bannerFileName": "intensive-ldl-management.jpg"
    },
    {
        "title": "",
        "fileName": "issues-in-hemophilia",
        "bannerFileName": "issues-in-hemophilia.jpg"
    },
    {
        "title": "",
        "fileName": "life-course-immunization",
        "bannerFileName": "life-course-immunization.jpg"
    },
    {
        "title": "",
        "fileName": "long-acting-opioids",
        "bannerFileName": "long-acting-opioids.jpg"
    },
    {
        "title": "",
        "fileName": "low-testosterone",
        "bannerFileName": "low-testosterone.jpg"
    },
    {
        "title": "",
        "fileName": "lymphocytic-leukemia",
        "bannerFileName": "lymphocytic-leukemia.jpg"
    },
    {
        "title": "",
        "fileName": "major-depressive-disorder",
        "bannerFileName": "major-depressive-disorder.jpg"
    },
    {
        "title": "",
        "fileName": "mcrpc",
        "bannerFileName": "mcrpc.jpg"
    },
    {
        "title": "",
        "fileName": "mdd",
        "bannerFileName": "mdd.jpg"
    },
    {
        "title": "",
        "fileName": "metastatic-melanoma",
        "bannerFileName": "metastatic-melanoma.jpg"
    },
    {
        "title": "",
        "fileName": "migraine-time-to-act",
        "bannerFileName": "migraine-time-to-act.jpg"
    },
    {
        "title": "",
        "fileName": "military-families",
        "bannerFileName": "military-families.jpg"
    },
    {
        "title": "",
        "fileName": "military-families-advisory",
        "bannerFileName": "military-families-advisory.jpg"
    },
    {
        "title": "",
        "fileName": "military-families-resources",
        "bannerFileName": "military-families-resources.jpg"
    },
    {
        "title": "",
        "fileName": "modern-diabetes-management",
        "bannerFileName": "modern-diabetes-management.jpg"
    },
    {
        "title": "",
        "fileName": "modern-obesity-management",
        "bannerFileName": "modern-obesity-management.jpg"
    },
    {
        "title": "",
        "fileName": "mood-spectrum",
        "bannerFileName": "mood-spectrum.jpg"
    },
    {
        "title": "",
        "fileName": "mri",
        "bannerFileName": "mri.jpg"
    },
    {
        "title": "",
        "fileName": "ms",
        "bannerFileName": "ms.jpg"
    },
    {
        "title": "",
        "fileName": "ms-patient-outcomes",
        "bannerFileName": "ms-patient-outcomes.jpg"
    },
    {
        "title": "",
        "fileName": "multidisciplinary-imaging",
        "bannerFileName": "multidisciplinary-imaging.jpg"
    },
    {
        "title": "",
        "fileName": "multiple-myeloma",
        "bannerFileName": "multiple-myeloma.jpg"
    },
    {
        "title": "",
        "fileName": "multiple-sclerosis",
        "bannerFileName": "multiple-sclerosis.jpg"
    },
    {
        "title": "",
        "fileName": "multiple-sclerosis-tv",
        "bannerFileName": "multiple-sclerosis-tv.jpg"
    },
    {
        "title": "",
        "fileName": "narcolepsy",
        "bannerFileName": "narcolepsy.jpg"
    },
    {
        "title": "",
        "fileName": "neuro-oncology",
        "bannerFileName": "neuro-oncology.jpg"
    },
    {
        "title": "",
        "fileName": "neurologyexchange",
        "bannerFileName": "neurologyexchange.jpg"
    },
    {
        "title": "",
        "fileName": "neurotoxins",
        "bannerFileName": "neurotoxins.jpg"
    },
    {
        "title": "",
        "fileName": "new-era-for-hf-management",
        "bannerFileName": "new-era-for-hf-management.jpg"
    },
    {
        "title": "",
        "fileName": "noveltreatmentinms",
        "bannerFileName": "noveltreatmentinms.jpg"
    },
    {
        "title": "",
        "fileName": "obesity-mgmt",
        "bannerFileName": "obesity-mgmt.jpg"
    },
    {
        "title": "",
        "fileName": "obesity-treatment",
        "bannerFileName": "obesity-treatment.jpg"
    },
    {
        "title": "",
        "fileName": "oncology-practice-patterns",
        "bannerFileName": "oncology-practice-patterns.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange",
        "bannerFileName": "oncologyexchange.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange-colorectal-cancer",
        "bannerFileName": "oncologyexchange-colorectal-cancer.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange-mantle-cell-lymphoma",
        "bannerFileName": "oncologyexchange-mantle-cell-lymphoma.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange-multiple-myeloma",
        "bannerFileName": "oncologyexchange-multiple-myeloma.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange-non-hodgkins-lymphoma",
        "bannerFileName": "oncologyexchange-non-hodgkins-lymphoma.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange-ovarian-cancer",
        "bannerFileName": "oncologyexchange-ovarian-cancer.jpg"
    },
    {
        "title": "",
        "fileName": "oncologyexchange-renal-cell-carcinoma",
        "bannerFileName": "oncologyexchange-renal-cell-carcinoma.jpg"
    },
    {
        "title": "",
        "fileName": "onychomycosis",
        "bannerFileName": "onychomycosis.jpg"
    },
    {
        "title": "",
        "fileName": "oraltherapies-hm",
        "bannerFileName": "oraltherapies-hm.jpg"
    },
    {
        "title": "",
        "fileName": "organ-transplantation",
        "bannerFileName": "organ-transplantation.jpg"
    },
    {
        "title": "",
        "fileName": "osteoarthritis",
        "bannerFileName": "osteoarthritis.jpg"
    },
    {
        "title": "",
        "fileName": "osteoporosis",
        "bannerFileName": "osteoporosis.jpg"
    },
    {
        "title": "",
        "fileName": "overcoming-obesity",
        "bannerFileName": "overcoming-obesity.jpg"
    },
    {
        "title": "",
        "fileName": "pah",
        "bannerFileName": "pah.jpg"
    },
    {
        "title": "",
        "fileName": "pah-tv",
        "bannerFileName": "pah-tv.jpg"
    },
    {
        "title": "",
        "fileName": "pain",
        "bannerFileName": "pain.jpg"
    },
    {
        "title": "",
        "fileName": "pain-tv",
        "bannerFileName": "pain-tv.jpg"
    },
    {
        "title": "",
        "fileName": "patient-stories-ms",
        "bannerFileName": "patient-stories-ms.jpg"
    },
    {
        "title": "",
        "fileName": "patients-rights",
        "bannerFileName": "patients-rights.jpg"
    },
    {
        "title": "",
        "fileName": "pd-related-symptoms",
        "bannerFileName": "pd-related-symptoms.jpg"
    },
    {
        "title": "",
        "fileName": "pdp",
        "bannerFileName": "pdp.jpg"
    },
    {
        "title": "",
        "fileName": "ped-acq-brain-injury",
        "bannerFileName": "banner-advances-pediatric-acquired-brain-injury.jpg"
    },
    {
        "title": "",
        "fileName": "pertussis-disease",
        "bannerFileName": "pertussis-disease.jpg"
    },
    {
        "title": "",
        "fileName": "ph-tv-season2",
        "bannerFileName": "ph-tv-season2.jpg"
    },
    {
        "title": "",
        "fileName": "pneumonia-tv",
        "bannerFileName": "pneumonia-tv.jpg"
    },
    {
        "title": "",
        "fileName": "postpartum-depression",
        "bannerFileName": "postpartum-depression.jpg"
    },
    {
        "title": "",
        "fileName": "prostate-cancer",
        "bannerFileName": "prostate-cancer.jpg"
    },
    {
        "title": "",
        "fileName": "proteasome-mm",
        "bannerFileName": "proteasome-mm.jpg"
    },
    {
        "title": "",
        "fileName": "psoriasis-mgmt",
        "bannerFileName": "psoriasis-mgmt.jpg"
    },
    {
        "title": "",
        "fileName": "quality-management-t2d",
        "bannerFileName": "quality-management-t2d.jpg"
    },
    {
        "title": "",
        "fileName": "ra-practice",
        "bannerFileName": "ra-practice.jpg"
    },
    {
        "title": "",
        "fileName": "relapsing-remitting-ms",
        "bannerFileName": "relapsing-remitting-ms.jpg"
    },
    {
        "title": "",
        "fileName": "renal-cell-essentials",
        "bannerFileName": "renal-cell-essentials.jpg"
    },
    {
        "title": "",
        "fileName": "residual-risk-mgmt",
        "bannerFileName": "residual-risk-mgmt.jpg"
    },
    {
        "title": "",
        "fileName": "resistant-hypertension-adv",
        "bannerFileName": "resistant-hypertension-adv.jpg"
    },
    {
        "title": "",
        "fileName": "respiratory-diseases",
        "bannerFileName": "respiratory-diseases.jpg"
    },
    {
        "title": "",
        "fileName": "restless-legs-syndrome",
        "bannerFileName": "restless-legs-syndrome.jpg"
    },
    {
        "title": "",
        "fileName": "rosacea",
        "bannerFileName": "rosacea.jpg"
    },
    {
        "title": "",
        "fileName": "rotavirus-tv",
        "bannerFileName": "rotavirus-tv.jpg"
    },
    {
        "title": "",
        "fileName": "sanford-health",
        "bannerFileName": "sanford-health.jpg"
    },
    {
        "title": "",
        "fileName": "schizophrenia",
        "bannerFileName": "schizophrenia.jpg"
    },
    {
        "title": "",
        "fileName": "schizophrenia-treatment",
        "bannerFileName": "schizophrenia-treatment.jpg"
    },
    {
        "title": "",
        "fileName": "seborrheic-keratosis",
        "bannerFileName": "seborrheic-keratosis.jpg"
    },
    {
        "title": "",
        "fileName": "secondary-prevention-cvd",
        "bannerFileName": "secondary-prevention-cvd.jpg"
    },
    {
        "title": "",
        "fileName": "seizures",
        "bannerFileName": "seizures.jpg"
    },
    {
        "title": "",
        "fileName": "severe-rare-disorders",
        "bannerFileName": "severe-rare-disorders.jpg"
    },
    {
        "title": "",
        "fileName": "sle",
        "bannerFileName": "sle.jpg"
    },
    {
        "title": "",
        "fileName": "sleep-disorders",
        "bannerFileName": "sleep-disorders.jpg"
    },
    {
        "title": "",
        "fileName": "sleep-disorders-cme",
        "bannerFileName": "sleep-disorders-cme.jpg"
    },
    {
        "title": "",
        "fileName": "solid-tumors",
        "bannerFileName": "solid-tumors.jpg"
    },
    {
        "title": "",
        "fileName": "stroke-continuous-cardiac-monitoring",
        "bannerFileName": "stroke-continuous-cardiac-monitoring.jpg"
    },
    {
        "title": "",
        "fileName": "systemic-lupus-erythematosus",
        "bannerFileName": "systemic-lupus-erythematosus.jpg"
    },
    {
        "title": "",
        "fileName": "systemicsclerosis-lungfibrosis",
        "bannerFileName": "systemicsclerosis-lungfibrosis.jpg"
    },
    {
        "title": "",
        "fileName": "t2d-tv",
        "bannerFileName": "t2d-tv.jpg"
    },
    {
        "title": "",
        "fileName": "t2dm-management",
        "bannerFileName": "t2dm-management.jpg"
    },
    {
        "title": "",
        "fileName": "tardive-dyskinesia",
        "bannerFileName": "tardive-dyskinesia.jpg"
    },
    {
        "title": "",
        "fileName": "targetingpi3k",
        "bannerFileName": "targetingpi3k.jpg"
    },
    {
        "title": "",
        "fileName": "thrombosis",
        "bannerFileName": "thrombosis.jpg"
    },
    {
        "title": "",
        "fileName": "thrombosis-acs",
        "bannerFileName": "thrombosis-acs.jpg"
    },
    {
        "title": "",
        "fileName": "thrombosis-tv",
        "bannerFileName": "thrombosis-tv.jpg"
    },
    {
        "title": "",
        "fileName": "tumor",
        "bannerFileName": "tumor.jpg"
    },
    {
        "title": "",
        "fileName": "ulcerative-colitis",
        "bannerFileName": "ulcerative-colitis.jpg"
    },
    {
        "title": "",
        "fileName": "understanding-neurodegenerative-disorders",
        "bannerFileName": "understanding-neurodegenerative-disorders.jpg"
    },
    {
        "title": "",
        "fileName": "vte-tv",
        "bannerFileName": "vte-tv.jpg"
    },
    {
        "title": "",
        "fileName": "weekly-glp1-agonists",
        "bannerFileName": "weekly-glp1-agonists.jpg"
    }
];

module.exports = collectionPages;