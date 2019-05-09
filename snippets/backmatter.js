function backmatterFrontPage (program) {
    if (program.codeName == 'brief') {
        return `
        <p><strong>Disclaimer</strong></p>
        <p>The educational activity presented above may involve simulated, case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient, whether living or deceased, is intended or should be inferred. The material presented here does not necessarily reflect the views of Medscape, LLC, or any individuals or commercial entities that support companies that support educational programming on medscape.org. These materials may include discussion of therapeutic products that have not been approved by the US Food and Drug Administration, off-label uses of approved products, or data that were presented in abstract form. These data should be considered preliminary until published in a peer-reviewed journal. Readers should verify all information and data before treating patients or employing any therapies described in this or any educational activity. A qualified healthcare professional should be consulted before using any therapeutic product discussed herein.</p>
        `;
    }
    if (program.hasOUS) {
        return `
        <p>
        <strong>Disclaimer</strong>
        </p>
        <p>The educational activity presented above may involve simulated, case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient, whether living or deceased, is intended or should be inferred. The material presented here does not necessarily reflect the views of Medscape, LLC, or any individuals or commercial entities that support companies that support educational programming on medscape.org. These materials may include discussion of therapeutic products that have not been authorized by the European Medicines Agency for use in Europe, off-label uses of authorized products, or data that were presented in abstract form. These data should be considered preliminary until published in a peer-reviewed journal. Readers should verify all information and data before treating patients or employing any therapies described in this or any educational activity. A qualified healthcare professional should be consulted before using any therapeutic product discussed herein.</p>
        `;
    } else {
        return `
        <p>
            <strong>Disclaimer</strong>
        </p>
        <p>The educational activity presented above may involve simulated, case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient, whether living or deceased, is intended or should be inferred. The material presented here does not necessarily reflect the views of Medscape, LLC, or any individuals or commercial entities that support companies that support educational programming on medscape.org. These materials may include discussion of therapeutic products that have not been approved by the US Food and Drug Administration, off-label uses of approved products, or data that were presented in abstract form. These data should be considered preliminary until published in a peer-reviewed journal. Readers should verify all information and data before treating patients or employing any therapies described in this or any educational activity. A qualified healthcare professional should be consulted before using any therapeutic product discussed herein.</p>
        `;
    }
}

module.exports = {
    backmatterFrontPage
}