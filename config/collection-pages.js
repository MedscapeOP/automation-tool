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
        "title": "Advances in Blood Pressure Control",
        "fileName": "blood-pressure-control",
        "bannerFileName": null
    },
    {
        "title": "Enhancing Endocrine Responsiveness in Advanced Breast Cancer",
        "fileName": "breast-cancer",
        "bannerFileName": null
    },
    {
        "title": "Metastatic Breast Cancer Clinic",
        "fileName": "breast-cancer-metastatic",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances: Targeting B-Cell Malignancies",
        "fileName": "btk-inhibitors",
        "bannerFileName": "banner-ca-btk-inhibitors-2018.jpg"
    },
    {
        "title": "Clinical Advances in Cancer Immunotherapy",
        "fileName": "cancer-immunotherapy",
        "bannerFileName": "banner-cancer-immunotherapy-2017.jpg"
    },
    // {
    //     "title": "Clinical Advances in Biomarkers and Testing",
    //     "fileName": "cardiac-biomarkers",
    //     "bannerFileName": "cardiac-biomarkers.jpg"
    // },
    {
        "title": "Clinical Advances in Bridging Cardiovascular Disease and T2DM",
        "fileName": "cardio-disease-t2dm",
        "bannerFileName": "banner-cardio-disease-t2dm-2017.jpg"
    },
    {
        "title": "Hot Topics in Cardiology and Metabolism",
        "fileName": "cardiology-diabetes-hot-topics",
        "bannerFileName": "banner-cardiology-diabetes-hot-topics.jpg"
    },
    {
        "title": "Clinical Advances in Cardiometabolic Risk Management in Type 2 Diabetes",
        "fileName": "cardiometabolic-risk-management",
        "bannerFileName": null
    },
    {
        "title": "Advances in CDK4 and 6 Inhibition in Breast Cancer",
        "fileName": "cdk4-6-inhibition-breast-cancer",
        "bannerFileName": "banner_cdk4-6-inhibition-breast-cancer.jpg"
    },
    {
        "title": "Advances In Central Line Insertion and Care: Prevention and Control of Catheter-Related Infection",
        "fileName": "central-line-insertion",
        "bannerFileName": null
    },
    {
        "title": "Medscape | Blended Learning: Meeting the Goals of RA Control",
        "fileName": "challenging-case-scenarios-ra",
        "bannerFileName": null
    },
    {
        "title": "Medscape | Blended Learning: Meeting the Goals of RA Control",
        "fileName": "challenging-case-scenarios-ra-details",
        "bannerFileName": null
    },
    {
        "title": "Taking Control: Clinicians Against Childhood Obesity",
        "fileName": "childhood-obesity",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Hyperkalemia",
        "fileName": "chronic-hyperkalemia",
        "bannerFileName": "banner-chronic-hyperkalemia-2017.jpg"
    },
    {
        "title": "Evidence-Based Approaches to Maximal Medical Management of Chronic Rhinosinusitis",
        "fileName": "chronic-rhinosinusitis",
        "bannerFileName": "banner-rhinosinusitis-optinose-2018.jpg"
    },
    {
        "title": "CINV: Advancing Clinical Care and Improving Patient Outcomes",
        "fileName": "cinv-nausea",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Chronic Kidney Disease -- Mineral and Bone Disorder",
        "fileName": "ckd-mineral-bone-disorder",
        "bannerFileName": null
    },
    {
        "title": "Emerging Practice Patterns in Clinical Oncology",
        "fileName": "clinicaloncology",
        "bannerFileName": "banner-oncology-practice-patterns-2017.jpg"
    },
    {
        "title": "Early Combination Therapy for PAH",
        "fileName": "combination-therapy-for-pah",
        "bannerFileName": "banner-combination-therapy-for-pah-2017.jpg"
    },
    {
        "title": "Advances in Complex Dyslipidemia",
        "fileName": "complex-dyslipidemia",
        "bannerFileName": null
    },
    {
        "title": "Advances in Acute Stroke Care and the Role of Continuous Cardiac Monitoring",
        "fileName": "continuous-cardiac-monitoring",
        "bannerFileName": "banner-stroke-continuous-cardiac-monitoring-2017.jpg"
    },
    {
        "title": "Inhaled Medication Delivery Systems in COPD Management",
        "fileName": "copd",
        "bannerFileName": "banner-copd.jpg"
    },
    {
        "title": "Clinical Advances in Obstructive Airways Diseases: COPD and Severe Asthma",
        "fileName": "copd-asthma",
        "bannerFileName": "banner_copd-asthma.jpg"
    },
    {
        "title": "Clinical Advances in CTEPH: Emerging Treatment Paradigms",
        "fileName": "cteph",
        "bannerFileName": null
    },
    {
        "title": "Interventional Approaches to CV Disease Management",
        "fileName": "cv-disease-mgmt",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Cardiovascular Disease Risk Reduction",
        "fileName": "cv-risk-reduction",
        "bannerFileName": null
    },
    {
        "title": "Major Depressive Disorder: Focus on Patient-Centered Care",
        "fileName": "depression-treatment",
        "bannerFileName": "banner-depression-treatment.jpg"
    },
    {
        "title": "Clinical Advances with GLP-1 Receptor Agonists - The Link Between Diabetes and CV Risk",
        "fileName": "diabetes-cardiovascular",
        "bannerFileName": "banner-diabetes-cardiovascular-2017.jpg"
    },
    {
        "title": "Clinical Advances in Type 2 Diabetes and Cardiovascular Risk",
        "fileName": "diabetes-cardiovascular-risk",
        "bannerFileName": null
    },
    {
        "title": "Diabetes Education TV: Challenges & Complexities",
        "fileName": "diabetes-edu-tv",
        "bannerFileName": null
    },
    {
        "title": "Advancing Diabetes Care with Incretin-Based Therapies",
        "fileName": "diabetes-incretin-therapy",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Diabetes Management with GLP-1 Agonists",
        "fileName": "diabetes-management",
        "bannerFileName": null
    },
    {
        "title": "Diabetes Exchange",
        "fileName": "diabetesexchange",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Biomarkers and Testing",
        "fileName": "diagnostics",
        "bannerFileName": "banner-diagnostics.jpg"
    },
    {
        "title": "Clinical Advances in Targeting DNA Damage Response",
        "fileName": "dna-damage-response",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Targeting DNA Damage Response",
        "fileName": "dna-damage-response-international",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Targeting DNA Damage Response",
        "fileName": "dna-damage-response-united-states",
        "bannerFileName": null
    },
    {
        "title": "Drug-Eluting Stents",
        "fileName": "drug-eluting-stents-adv",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in EGFR-Mutated NSCLC",
        "fileName": "egfr-mutated-nsclc",
        "bannerFileName": "banner-egfr-mutated-nsclc-2017.jpg"
    },
    {
        "title": "Electronic Health Records Incentive Programs",
        "fileName": "ehr",
        "bannerFileName": "banner-ehr.jpg"
    },
    {
        "title": "Evolution Beyond Current Targets: Emerging Oral Agents in RA",
        "fileName": "emerging-agents-ra",
        "bannerFileName": "banner-emerging-agents-ra-2017.jpg"
    },
    {
        "title": "Emerging Horizons in Cancer Immunotherapy",
        "fileName": "emerging-immunotherapy",
        "bannerFileName": "banner-emerging-immunotherapy.jpg"
    },
    {
        "title": "Clinical Advances in Practical Perspectives on the Clinical Management of Epilepsy",
        "fileName": "epilepsy",
        "bannerFileName": "banner-epilepsy-2017.jpg"
    },
    {
        "title": "Evolving Anticoagulation in AF and VTE",
        "fileName": "evolving-anticoagulation",
        "bannerFileName": "banner-evolving-anticoagulation-2017.jpg"
    },
    {
        "title": "Advances in Ophthalmology: Dry Eye, Glaucoma, and nAMD",
        "fileName": "eye",
        "bannerFileName": "banner-eye-2017.jpg"
    },
    {
        "title": "Challenges & avancées dans l'anticoagulation de la FA & MTEV",
        "fileName": "fa_mtev",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Insulin Therapies for Advanced Diabetes Management",
        "fileName": "faster-acting-insulin",
        "bannerFileName": "banner-faster-acting-insulin-2017.jpg"
    },
    {
        "title": "Clinical Advances in Gene Therapy for Hemophilia",
        "fileName": "gene-therapy-hemophilia",
        "bannerFileName": "banner-gene-therapy-hemophilia.jpg"
    },
    {
        "title": "Clinical Advances in Men's Genitourinary and Sexual Health",
        "fileName": "genitourinary-health",
        "bannerFileName": null
    },
    {
        "title": "Global AF Stroke Prevention & VTE Treatment",
        "fileName": "global-af-stroke-prevention",
        "bannerFileName": "banner-global-af-stroke-prevention-2017.jpg"
    },
    {
        "title": "Clinical Advances in Pulmonary Arterial Hypertension",
        "fileName": "global-pah",
        "bannerFileName": "banner-global-pah-2017.jpg"
    },
    {
        "title": "Global Update on Pneumococcal Disease",
        "fileName": "global-update-pneumococcal",
        "bannerFileName": null
    },
    {
        "title": "Innovations in GLP-1 Therapy",
        "fileName": "glp1",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in GLP-1 Receptor Agonists",
        "fileName": "glp1-receptor-agonists",
        "bannerFileName": null
    },
    {
        "title": "Advances in Glycemic Control",
        "fileName": "glycemic-control",
        "bannerFileName": null
    },
    {
        "title": "Medscape: Advances in Gout: New Solutions to an Age-Old Disease",
        "fileName": "gout",
        "bannerFileName": null
    },
    {
        "title": "Clinical Course in HCV",
        "fileName": "hcv",
        "bannerFileName": null
    },
    {
        "title": "Center for Healthcare Quality and Payment Reforms",
        "fileName": "healthcare-reform",
        "bannerFileName": "banner-healthcare-reform2017.jpg"
    },
    {
        "title": "Healthcare Updates: Highlights From CMS - Medscape Education",
        "fileName": "healthcare-updates",
        "bannerFileName": "banner-healthcare-updates.jpg"
    },
    // {
    //     "title": "The Heart of a Woman",
    //     "fileName": "heart-of-woman",
    //     "bannerFileName": null
    // },
    {
        "title": "Clinical Advances in Heart Rate as a Risk Factor in Heart Failure",
        "fileName": "heart-rate-risk",
        "bannerFileName": null
    },
    {
        "title": "Heart Failure and Chronic Kidney Disease Management Challenges",
        "fileName": "heartfailure-ckd-management",
        "bannerFileName": "banner-heartfailure-ckd-management.jpg"
    },
    {
        "title": "Clinical Advances in the Treatment of CD30+ Hematological Malignancies",
        "fileName": "hematological-malignancies",
        "bannerFileName": "banner-hematological-malignancies-2017.jpg"
    },
    {
        "title": "Clinical Advances in Hemophilia: Management for Life",
        "fileName": "hemophilia-management",
        "bannerFileName": "banner-hemophilia-management-2017.jpg"
    },
    {
        "title": "Curing Hepatitis C: Clinical Advances Toward a Future Without Interferon",
        "fileName": "hepatitis-c",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Understanding HER2 - A Cornerstone of Breast Cancer Therapy",
        "fileName": "her2-cornerstone",
        "bannerFileName": null
    },
    {
        "title": "Advances in Hereditary Angioedema",
        "fileName": "hereditary-angioedema",
        "bannerFileName": null
    },
    {
        "title": "Advances in Hernia and Abdominal Wall Repair",
        "fileName": "hernia",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in HIV: Optimizing Patient Care",
        "fileName": "hiv-art-of-treatment",
        "bannerFileName": "banner-hiv-art-of-treatment.jpg"
    },
    {
        "title": "HIV Management",
        "fileName": "hiv-management",
        "bannerFileName": "banner-hiv-management-2017.jpg"
    },
    {
        "title": "CLINICAL ADVANCES IN HIV: Emerging Regimens; Optimizing Care",
        "fileName": "hiv-optimizing-patient-care",
        "bannerFileName": "banner-hiv-optimizing-patient-care.jpg"
    },
    {
        "title": "Clinical Advances in HIV Prevention",
        "fileName": "hiv-screening-prevention",
        "bannerFileName": null
    },
    {
        "title": "Advances in HIV Testing, Linkage to Care, and Treatment",
        "fileName": "hiv-testing",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Hormone Receptor-Positive Advanced Breast Cancer",
        "fileName": "hormone-receptor-positive-breastcancer",
        "bannerFileName": "banner-hormone-receptor-positive-breastcancer-2017.jpg"
    },
    {
        "title": "Hot Topics in Dermatology",
        "fileName": "hot-topics-in-dermatology",
        "bannerFileName": "banner-hot-topics-dermatology-34735.jpg"
    },
    {
        "title": "Hot Topics in Thromboembolic Disease",
        "fileName": "hot-topics-in-thromboembolic-disease",
        "bannerFileName": null
    },
    {
        "title": "Advances in HR-Positive Breast Cancer",
        "fileName": "hr-positive-breast-cancer",
        "bannerFileName": "banner-hr-positive-breast-cancer-2017.jpg"
    },
    {
        "title": "Clinical Advances in Hyperhidrosis Management",
        "fileName": "hyperhidrosis",
        "bannerFileName": "banner-hyperhidrosis.jpg"
    },
    {
        "title": "Clinical Advances in Chronic Kidney Disease: Focus on Hyperkalemia and Anemia",
        "fileName": "hyperkalemia",
        "bannerFileName": "banner-hyperkalemia-2018.jpg"
    },
    {
        "title": "Hypersomnolence: Exploring Narcolepsy & OSA",
        "fileName": "hypersomnolence",
        "bannerFileName": "banner-hypersomnolence-2018.jpg"
    },
    {
        "title": "Clinical Advances in the Treatment of Hypertriglyceridemia",
        "fileName": "hypertriglyceridemia",
        "bannerFileName": "banner-hypertriglyceridemia-2017.jpg"
    },
    {
        "title": "Clinical Advances in Vasodilatory Shock: Treating Hypotension to Improve Outcomes",
        "fileName": "hypotension",
        "bannerFileName": "banner-hypotension.jpg"
    },
    {
        "title": "Medscape: Advances in IBS-C and Chronic Constipation",
        "fileName": "ibs-c-constipation",
        "bannerFileName": null
    },
    {
        "title": "IC-ONC: Immunotherapy Collaborative of Oncology Networked Communities",
        "fileName": "ic-onc",
        "bannerFileName": "ic-collection-header.jpg"
    },
    {
        "title": "IC-ONC Chicago: Immunotherapy Collaborative of Oncology Networked Communities",
        "fileName": "ic-onc-chicago",
        "bannerFileName": "ic-collection-header.jpg"
    },
    {
        "title": "IC-ONC Houston: Immunotherapy Collaborative of Oncology Networked Communities",
        "fileName": "ic-onc-houston",
        "bannerFileName": "ic-collection-header.jpg"
    },
    {
        "title": "IC-ONC London (UK): Immunotherapy Collaborative of Oncology Networked Communities",
        "fileName": "ic-onc-london-uk",
        "bannerFileName": "ic-collection-header.jpg"
    },
    {
        "title": "IC-ONC Los Angeles: Immunotherapy Collaborative of Oncology Networked Communities",
        "fileName": "ic-onc-los-angeles",
        "bannerFileName": "ic-collection-header.jpg"
    },
    {
        "title": "IC-ONC Miami: Immunotherapy Collaborative of Oncology Networked Communities",
        "fileName": "ic-onc-miami",
        "bannerFileName": "ic-collection-header.jpg"
    },
    {
        "title": "Clinical Advances in Individualized Diabetes Management",
        "fileName": "individualized-diab-mgmt",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Inflammatory Bowel Disease: The Evolving Role of Biologics",
        "fileName": "inflammatory-bowel-disease",
        "bannerFileName": "banner-inflammatory-bowel-disease-2017.jpg"
    },
    {
        "title": "Clinical Advances In Cross-Therapy Considerations in the Inflammatory Disease Spectrum",
        "fileName": "inflammatory-diseases",
        "bannerFileName": "banner-inflammatory-diseases.jpg"
    },
    {
        "title": "Evolution of Treatment Strategies for Inflammatory Joint Diseases",
        "fileName": "inflammatory-joint-diseases",
        "bannerFileName": "banner-inflammatory-joint-diseases.jpg"
    },
    {
        "title": "Advances in Influenza Prevention and Treatment",
        "fileName": "influenza-prevention",
        "bannerFileName": null
    },
    {
        "title": "Advances in Innovative Treatment Paradigms in Diabetes Management",
        "fileName": "innovative-insulin-paradigms",
        "bannerFileName": "banner-innovative-insulin-paradigms.jpg"
    },
    {
        "title": "Improving Diabetes Care with Novel Insulin Therapies",
        "fileName": "insulin-analogues",
        "bannerFileName": "banner-insulin-analogues-2017.jpg"
    },
    {
        "title": "Clinical Advances in Intensive Low-Density Lipoprotein Management",
        "fileName": "intensive-ldl-management",
        "bannerFileName": null
    },
    {
        "title": "Issues in the Management of Hemophilia: A Best Practice Series",
        "fileName": "issues-in-hemophilia",
        "bannerFileName": "banner-issues-in-hemophilia-2017.jpg"
    },
    {
        "title": "Clinical Advances in Life-Course Immunization: A Cornerstone of Event-Free Health",
        "fileName": "life-course-immunization",
        "bannerFileName": "life-course-immunization.png"
    },
    {
        "title": "Opioid Prescribing: Safe Practice, Changing Lives",
        "fileName": "long-acting-opioids",
        "bannerFileName": null
    },
    {
        "title": "Medscape: Advances in the Treatment of Low Testosterone",
        "fileName": "low-testosterone",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Chronic Lymphocytic Leukemia",
        "fileName": "lymphocytic-leukemia",
        "bannerFileName": "banner-lymphocytic-leukemia-2017.jpg"
    },
    {
        "title": "Cognitive Dysfunction in Major Depressive Disorder",
        "fileName": "major-depressive-disorder",
        "bannerFileName": "banner-major-depressive-disorder-2017.jpg"
    },
    {
        "title": "Advances in the Treatment of mCRPC: Targeting the Androgen Pathway",
        "fileName": "mcrpc",
        "bannerFileName": "banner-mcrpc-2017.jpg"
    },
    {
        "title": "Clinical Advances in Major Depressive Disorder",
        "fileName": "mdd",
        "bannerFileName": "34746-collection-header.jpg"
    },
    {
        "title": "Immunotherapeutic Strategies in Metastatic Melanoma: A European Perspective",
        "fileName": "metastatic-melanoma",
        "bannerFileName": null
    },
    {
        "title": "Migraine Prevention: Now Is The Time To Act",
        "fileName": "migraine-time-to-act",
        "bannerFileName": "banner_new_frontiers_in_migraine_34597.jpg"
    },
    {
        "title": "Improving Medical Care for Military Personnel and Their Families - Medscape Education",
        "fileName": "military-families",
        "bannerFileName": "banner-military-families.jpg"
    },
    {
        "title": "Improving Medical Care for Military Personnel and Their Families - Medscape Education",
        "fileName": "military-families-advisory",
        "bannerFileName": null
    },
    {
        "title": "Improving Medical Care for Military Personnel and Their Families - Medscape Education",
        "fileName": "military-families-resources",
        "bannerFileName": null
    },
    {
        "title": "Advances in Modern Diabetes Management -- Tailored to Patient Needs",
        "fileName": "modern-diabetes-management",
        "bannerFileName": "banner-modern-diabetes-management-2017.jpg"
    },
    {
        "title": "Modern Obesity Management: A Synergistic Approach for Today's Patient",
        "fileName": "modern-obesity-management",
        "bannerFileName": null
    },
    {
        "title": "Mood Disorder Spectrum",
        "fileName": "mood-spectrum",
        "bannerFileName": "banner-mood-spectrum-2017.jpg"
    },
    {
        "title": "Clinical Advances in Imaging",
        "fileName": "mri",
        "bannerFileName": "banner-mri-2017.jpg"
    },
    {
        "title": "Clinical Advances in Multiple Sclerosis",
        "fileName": "ms",
        "bannerFileName": null
    },
    {
        "title": "Advances in MS for the Improvement of Patient Outcomes",
        "fileName": "ms-patient-outcomes",
        "bannerFileName": null
    },
    {
        "title": "Advances In: Multidisciplinary Imaging",
        "fileName": "multidisciplinary-imaging",
        "bannerFileName": null
    },
    {
        "title": "Multiple Myeloma: Staying Abreast of Best Practices Across the Clinical Continuum",
        "fileName": "multiple-myeloma",
        "bannerFileName": "banner-multiple-myeloma-2017.jpg"
    },
    {
        "title": "Advances in MS for the Improvement of Patient Outcomes",
        "fileName": "multiple-sclerosis",
        "bannerFileName": null
    },
    {
        "title": "MS TV: Broadcasting the Latest Data on Oral Therapies for RRMS - Medscape Education",
        "fileName": "multiple-sclerosis-tv",
        "bannerFileName": null
    },
    {
        "title": "Hypersomnolence: Exploring Narcolepsy & OSA",
        "fileName": "narcolepsy",
        "bannerFileName": "banner-narcolepsy-2017.jpg"
    },
    {
        "title": "Neuro-Oncology Learning Portfolio: An Update on Glioblastoma | Medscape",
        "fileName": "neuro-oncology",
        "bannerFileName": null
    },
    {
        "title": "Neurology Exchange",
        "fileName": "neurologyexchange",
        "bannerFileName": null
    },
    {
        "title": "In My Practice: Neurotoxins in Aesthetic Medicine",
        "fileName": "neurotoxins",
        "bannerFileName": null
    },
    {
        "title": "Emergence of a New Era for Heart Failure Management",
        "fileName": "new-era-for-hf-management",
        "bannerFileName": "banner-new-era-for-hf-management.jpg"
    },
    {
        "title": "Novel Treatment Approaches in MS",
        "fileName": "noveltreatmentinms",
        "bannerFileName": "banner-noveltreatmentinms-2017.jpg"
    },
    {
        "title": "Advances In Obesity Management",
        "fileName": "obesity-mgmt",
        "bannerFileName": null
    },
    {
        "title": "Obesity Treatment Today: Patient-Centered Approaches to Improving Health Outcomes",
        "fileName": "obesity-treatment",
        "bannerFileName": null
    },
    {
        "title": "Emerging Practice Patterns in Clinical Oncology",
        "fileName": "oncology-practice-patterns",
        "bannerFileName": "banner-oncology-practice-patterns-2017.jpg"
    },
    {
        "title": "Oncology Exchange",
        "fileName": "oncologyexchange",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Oncology Exchange: Colorectal Cancer",
        "fileName": "oncologyexchange-colorectal-cancer",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Oncology Exchange: Evolving Treatment Strategies for Mantle Cell Lymphoma in Elderly Patients",
        "fileName": "oncologyexchange-mantle-cell-lymphoma",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Oncology Exchange: Multiple Myeloma",
        "fileName": "oncologyexchange-multiple-myeloma",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Oncology Exchange: Non-Hodgkin's Lymphoma",
        "fileName": "oncologyexchange-non-hodgkins-lymphoma",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Oncology Exchange: Ovarian Cancer",
        "fileName": "oncologyexchange-ovarian-cancer",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Oncology Exchange: Renal Cell Carcinoma",
        "fileName": "oncologyexchange-renal-cell-carcinoma",
        "bannerFileName": "banner-oncologyexchange-2017.jpg"
    },
    {
        "title": "Clinical Advances in the Management of Onychomycosis",
        "fileName": "onychomycosis",
        "bannerFileName": "banner-onychomycosis-2017.jpg"
    },
    {
        "title": "Clinical Advances in Novel Oral Therapeutics for Hematological Malignancies",
        "fileName": "oraltherapies-hm",
        "bannerFileName": "banner-oraltherapies-cll-2017.jpg"
    },
    {
        "title": "Clinical Advances in the Management of Solid Organ Transplantation",
        "fileName": "organ-transplantation",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in the Care of Knee Osteoarthritis",
        "fileName": "osteoarthritis",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Osteoporosis",
        "fileName": "osteoporosis",
        "bannerFileName": null
    },
    {
        "title": "Treating Obesity as a Chronic Disease: Novel Insights and Strategies",
        "fileName": "overcoming-obesity",
        "bannerFileName": "banner-overcoming-obesity-2017.jpg"
    },
    {
        "title": "Advances in Pulmonary Arterial Hypertension",
        "fileName": "pah",
        "bannerFileName": null
    },
    {
        "title": "PAH TV: Pulmonary Arterial Hypertension Unmasked - Medscape Education",
        "fileName": "pah-tv",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Optimal Approaches for the Management of Osteoarthritis and Low Back Pain",
        "fileName": "pain",
        "bannerFileName": "ca-pain-hero.jpg"
    },
    {
        "title": "Pain TV: Chronic Pain in America - Medscape Education",
        "fileName": "pain-tv",
        "bannerFileName": null
    },
    {
        "title": "Patient Stories in Multiple Sclerosis: Expert Insights Series",
        "fileName": "patient-stories-ms",
        "bannerFileName": "banner-patient-stories-ms-2017.jpg"
    },
    {
        "title": "Protecting Patients' Rights",
        "fileName": "patients-rights",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Parkinson Disease-Related Symptoms",
        "fileName": "pd-related-symptoms",
        "bannerFileName": "pd-related-symptoms.jpg"
    },
    {
        "title": "Clinical Advances in Parkinson’s Disease Psychosis",
        "fileName": "pdp",
        "bannerFileName": "banner-pdp-2017.jpg"
    },
    {
        "title": "Clinical Advances in Pediatric Acquired Brain Injury",
        "fileName": "ped-acq-brain-injury",
        "bannerFileName": "banner-advances-pediatric-acquired-brain-injury.jpg"
    },
    {
        "title": "Pertussis Disease: Solutions for All Ages",
        "fileName": "pertussis-disease",
        "bannerFileName": "banner-pertussis-disease-2017.jpg"
    },
    {
        "title": "PH TV Season 2: Focus on Expanding Care Options and Approaches",
        "fileName": "ph-tv-season2",
        "bannerFileName": null
    },
    {
        "title": "Pneumonia TV: Preventing a Lung Attack",
        "fileName": "pneumonia-tv",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Postpartum Depression: From Diagnosis to New Treatments",
        "fileName": "postpartum-depression",
        "bannerFileName": "banner-postpartum-depression.jpg"
    },
    {
        "title": "Castrate Resistant Prostate Cancer Clinic",
        "fileName": "prostate-cancer",
        "bannerFileName": null
    },
    {
        "title": "",
        "fileName": "proteasome-mm",
        "bannerFileName": "proteasome-mm.jpg"
    },
    {
        "title": "Proteasome Inhibitor Paradigms in Multiple Myeloma",
        "fileName": "psoriasis-mgmt",
        "bannerFileName": "banner-proteasome-mm-2017.jpg"
    },
    {
        "title": "Quality Management T2D",
        "fileName": "quality-management-t2d",
        "bannerFileName": "banner-quality-management-t2d-2017.jpg"
    },
    {
        "title": "Rheumatoid Arthritis in Practice",
        "fileName": "ra-practice",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in MS: Changing the Future for Patients",
        "fileName": "relapsing-remitting-ms",
        "bannerFileName": "banner-relapsing-remitting-ms-2017.jpg"
    },
    {
        "title": "Advances in Renal Cell Carcinoma",
        "fileName": "renal-cell-essentials",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Cardiometabolic Risk Management in Type 2 Diabetes",
        "fileName": "residual-risk-mgmt",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Resistant Hypertension",
        "fileName": "resistant-hypertension-adv",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Chronic Respiratory Diseases: COPD and Asthma",
        "fileName": "respiratory-diseases",
        "bannerFileName": "banner-respiratory-diseases.jpg"
    },
    {
        "title": "Medscape: Advances In Restless Legs Syndrome",
        "fileName": "restless-legs-syndrome",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Rosacea",
        "fileName": "rosacea",
        "bannerFileName": null
    },
    {
        "title": "Rotavirus TV: Global Impact of Rotavirus Vaccination",
        "fileName": "rotavirus-tv",
        "bannerFileName": "banner-rotavirus-tv-2017.jpg"
    },
    {
        "title": "Sanford Health Children's Health, Fitness and Nutrition Initiative",
        "fileName": "sanford-health",
        "bannerFileName": "banner-sanford-health.jpg"
    },
    {
        "title": "The Long-term View: Schizophrenia and the Long-acting Atypical Antipsychotics",
        "fileName": "schizophrenia",
        "bannerFileName": "banner-schizophrenia-2017.jpg"
    },
    {
        "title": "The Future Is Friendly: Advances for Improving Patient Outcomes in Schizophrenia",
        "fileName": "schizophrenia-treatment",
        "bannerFileName": null
    },
    {
        "title": "Benign But Bothersome: A Closer Look at Seborrheic Keratosis",
        "fileName": "seborrheic-keratosis",
        "bannerFileName": "banner-seborrheic-keratosis.jpg"
    },
    {
        "title": "Advances in Secondary Prevention of Cardiovascular Disease",
        "fileName": "secondary-prevention-cvd",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Seizure Disorder Diagnosis and Management",
        "fileName": "seizures",
        "bannerFileName": "banner-seizures-2017.jpg"
    },
    {
        "title": "Advances in the Management of Severe and Rare Disorders",
        "fileName": "severe-rare-disorders",
        "bannerFileName": "banner-severe-rare-disorders.jpg"
    },
    {
        "title": "Clinical Advances in Systemic Lupus Erythematosus: A Focus on Patient-Centered Symptom Management",
        "fileName": "sle",
        "bannerFileName": "banner-advances-systemic-lupus-erythematosus.jpg"
    },
    {
        "title": "Advances in Circadian Rhythm Sleep Disorders and the Management of Excessive Sleepiness",
        "fileName": "sleep-disorders",
        "bannerFileName": null
    },
    {
        "title": "Advances in Circadian Rhythm Sleep Disorders and the Management of Excessive Sleepiness (CME Activities from Other Providers)",
        "fileName": "sleep-disorders-cme",
        "bannerFileName": null
    },
    {
        "title": "Science, Medicine, and Clinical Practice: Expert and Community Updates on Solid Tumors | Medscape",
        "fileName": "solid-tumors",
        "bannerFileName": null
    },
    {
        "title": "Advances in Acute Stroke Care and the Role of Continuous Cardiac Monitoring",
        "fileName": "stroke-continuous-cardiac-monitoring",
        "bannerFileName": "banner-stroke-continuous-cardiac-monitoring-2017.jpg"
    },
    {
        "title": "Clinical Advances in the Management of Systemic Lupus Erythematosus",
        "fileName": "systemic-lupus-erythematosus",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Treatment of Systemic Sclerosis and Progressive Fibrosing Interstitial Lung Diseases",
        "fileName": "systemicsclerosis-lungfibrosis",
        "bannerFileName": "banner-systemicsclerosis-lungfibrosis.jpg"
    },
    {
        "title": "Diabetes Education TV: Challenges & Complexities",
        "fileName": "t2d-tv",
        "bannerFileName": null
    },
    {
        "title": "Type 2 Diabetes Management: Tailored Therapies",
        "fileName": "t2dm-management",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Tardive Dyskinesia",
        "fileName": "tardive-dyskinesia",
        "bannerFileName": "banner-tardive-dyskinesia.jpg"
    },
    {
        "title": "Novel Therapies in B-Cell Malignancies: Targeting BCR Signaling Pathways",
        "fileName": "targetingpi3k",
        "bannerFileName": null
    },
    {
        "title": "Hot Topics in Thrombosis",
        "fileName": "thrombosis",
        "bannerFileName": "banner-thrombosis.jpg"
    },
    {
        "title": "ACS: Worldwide Perspectives in Thrombosis",
        "fileName": "thrombosis-acs",
        "bannerFileName": null
    },
    {
        "title": "Thrombosis TV: Treatment Across the Spectrum of Thromboembolic Disease",
        "fileName": "thrombosis-tv",
        "bannerFileName": "banner-thrombosis-tv-s5.jpg"
    },
    {
        "title": "NCCN Oncology Tumor Board Series",
        "fileName": "tumor",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Ulcerative Colitis",
        "fileName": "ulcerative-colitis",
        "bannerFileName": null
    },
    {
        "title": "Advancing Understanding of Neurodegenerative Disorders",
        "fileName": "understanding-neurodegenerative-disorders",
        "bannerFileName": "banner-understanding-neurodegenerative-disorders-2017.jpg"
    },
    {
        "title": "CME TV: The Real Clinicians of VTE",
        "fileName": "vte-tv",
        "bannerFileName": null
    },
    {
        "title": "Clinical Advances in Weekly GLP-1 Agonists in T2DM",
        "fileName": "weekly-glp1-agonists",
        "bannerFileName": null
    }
];

module.exports = collectionPages;