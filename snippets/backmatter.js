function backmatterFrontPage (program) {
    if (program.hasOUS) {
        return `
        <p>
        <strong>Disclaimer</strong>
        </p>
        <p>The educational activity presented above may involve simulated case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient is intended or should be inferred.</p>
        <p>The material presented here does not necessarily reflect the views of WebMD Global, LLC or companies that support educational programming on medscape.org. These materials may discuss therapeutic products that have not been approved by the European Medicines Agency for use in Europe and off-label uses of approved products. A qualified healthcare professional should be consulted before using any therapeutic product discussed. Readers should verify all information and data before treating patients or employing any therapies described in this educational activity.</p>
        `;
    } else {
        return `
        <p>
            <strong>Disclaimer</strong>
        </p>
        <p>The educational activity presented above may involve simulated case-based scenarios. The patients depicted in these scenarios are fictitious and no association with any actual patient is intended or should be inferred.</p>
        <p>The material presented here does not necessarily reflect the views of Medscape, LLC, or companies that support educational programming on medscape.org. These materials may discuss therapeutic products that have not been approved by the US Food and Drug Administration and off-label uses of approved products. A qualified healthcare professional should be consulted before using any therapeutic product discussed. Readers should verify all information and data before treating patients or employing any therapies described in this educational activity.</p>
        `;
    }
}

module.exports = {
    backmatterFrontPage
}