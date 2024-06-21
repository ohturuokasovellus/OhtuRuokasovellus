/**
 * Function for converting research data.
 * @param {Object[]} researchData - Research data
 * @returns {string[]} Formatted research data
 */
function formatResearchData (researchData) {
    let formattedResearchData = '';

    if (researchData.length < 1) return [];

    for (const key in researchData[0])
    {
        formattedResearchData+=key + ',';
    }

    formattedResearchData+='\n';

    let index = 0;
    while (index < researchData.length){
        let line = '';
        for (const key in researchData[index])
        {
            line+=researchData[index][key] + ',';
        }
        line += '\n';
        formattedResearchData+=line;
        index += 1;
    }

    return formattedResearchData;
}

module.exports = {formatResearchData};