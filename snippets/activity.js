const {TOCElement, SectionElement, SubsectionElement} = require('../classes/index');
const utils = require('../utils');


function instructionsForCredit(program) {
    var result;
    if (program.hasOUS) {
        result = `
        <div>
            <p>
                There are no fees for participating in or receiving credit for this online educational activity. For information about your eligibility to claim credit, please consult your professional licensing board.
                <br/>
                <br/>
                This activity is designed to be completed within the time designated on the title page; physicians should claim only those credits that reflect the time actually spent participating in the activity. To successfully earn credit, participants must complete the activity online during the credit eligibility period that is noted on the title page.
                <br/>
                <br/>
                Follow these steps to claim a credit certificate for completing this activity:
            </p>

            <ol>
                <li>Read the information provided on the title page regarding the target audience, learning objectives, and author disclosures, read and study the activity content and then complete the post-test questions. If you earn a passing score on the post-test and we have determined based on your registration profile that you may be eligible to claim CPD credit for completing this activity, we will issue you a CPD credit certificate.</li>
                <li>Once your CPD credit certificate has been issued, you may view and print the certificate from your CME/CE Tracker. CPD credits will be tallied in your CME/CE Tracker and archived for 6 years; at any point within this time period you can print out the tally as well as the certificates by accessing "Edit Your Profile" at the top of the Medscape Education homepage.</li>
            </ol>

            <p>
                We encourage you to complete an Activity Evaluation to provide feedback for future programming.
                <br/>
                <br/>
                You may now view or print the certificate from your CME/CE Tracker. You may print the certificate but you cannot alter it. Credits will be tallied in your CME/CE Tracker and archived for 6 years; at any point within this time period you can print out the tally as well as the certificates by accessing "Edit Your Profile" at the top of your Medscape homepage.
                <br/>
                <br/>
                *The credit that you receive is based on your user profile.
            </p>          
        </div>
    `;
    } else {
        result = `
            <div>
                <p>There are no fees for participating in or receiving credit for this online educational activity. For information on applicability and acceptance of continuing education credit for this activity, please consult your professional licensing board.
                    <br/>
                    <br/>
                    This activity is designed to be completed within the time designated on the title page; physicians should claim only those credits that reflect the time actually spent in the activity. To successfully earn credit, participants must complete the activity online during the valid credit period that is noted on the title page. To receive 
                    <em>AMA PRA Category 1 Credit&#8482;</em>, you must receive a minimum score of 75% on the post-test.
                    <br/>
                    <br/>
                    Follow these steps to earn CME/CE credit*: 
                </p>
                <ol>
                    <li>Read the target audience, learning objectives, and author disclosures.</li>
                    <li>Study the educational content online or printed out.</li>
                    <li>Online, choose the best answer to each test question. To receive a certificate, you must receive a passing score as designated at the top of the test. We encourage you to complete the Activity Evaluation to provide feedback for future programming.</li>
                </ol>
                <p>You may now view or print the certificate from your CME/CE Tracker. You may print the certificate but you cannot alter it. Credits will be tallied in your CME/CE Tracker and archived for 6 years; at any point within this time period you can print out the tally as well as the certificates from the CME/CE Tracker.
                    <br/>
                    <br/>
                *The credit that you receive is based on your user profile.
                </p>
            </div>
        `;
    }

    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function medscapeProviderStatement(program) {
    var result = "";
    if (program.hasOUS) {
        return null;
    } else {
        result = `
            <p><img src="/webmd/professional_assets/medscape/images/provider/medscape1.150x34.gif" alt="Medscape" /><br />
            <img src="/webmd/professional_assets/medscape/images/provider/interprofessional-continuing-education.jpg?interpolation=lanczos-none&amp;resize=150:96" alt="Interprofessional Continuing Education" /><br />
            In support of improving patient care, Medscape, LLC is jointly accredited by the Accreditation Council for Continuing Medical Education (ACCME), the Accreditation Council for Pharmacy Education (ACPE), and the American Nurses Credentialing Center (ANCC), to provide continuing education for the healthcare team.</p>
        `;
    }
    return utils.cleanHTML.insertEntityPlaceholders(result);
}

function goalStatementCB() {
    return `
        The goal of this activity is to provide medical news to primary care clinicians and other healthcare professionals in order to enhance patient care.
    `;
}

function hardwareRequirements() {
    return `
    <div>
        <p>To access activities, users will need:</p>
        <ul>
            <li>A computer with an Internet connection.</li>
            <li>Internet Explorer 8.x or higher, the latest versions of Firefox or Safari, or any other W3C standards compliant browser.</li>
            <li>
                <a href="http://get.adobe.com/flashplayer/">Adobe Flash Player</a> and/or an HTML5 capable browser may be required for video or audio playback.
            </li>
            <li>Occasionally other additional software may be required such as 
                <a href="http://office.microsoft.com/en-us/powerpoint/">PowerPoint</a> or 
                <a href="http://get.adobe.com/reader/">Adobe Acrobat Reader</a>.
            </li>
        </ul>
    </div>
    `;
}

function additionalCreditAvailable() {
    return `
    <p>
        All other healthcare professionals completing continuing education credit for this activity will be issued a certificate of participation.
        <br/>
        <br/>
        Physicians should claim only the credit commensurate with the extent of their participation in the activity.
    </p>
    `;
}

module.exports = {
    instructionsForCredit,
    medscapeProviderStatement,
    goalStatementCB,
    hardwareRequirements,
    additionalCreditAvailable
};