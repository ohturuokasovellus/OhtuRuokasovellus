/* eslint-disable id-length */
/** Convert kJ to kcal.
 * @param {string|number} kj energy in kJ
 * @returns {number} energy in kcal rounded to one decimal point
 */
const convertKJ2Kcal = (kj) => {
    let kjValue = kj;

    if (typeof kj === 'string') {
        kjValue = parseFloat(kj);
    }

    if (isNaN(kjValue) || kj === null) {
        throw new Error(`invalid input: ${kj} is not a number`);
    }

    const kcal = kjValue * 0.239006;
    return parseFloat(kcal.toFixed(1));
};

/** Convert kcal to kJ.
 * @param {string|number} kcal energy in kcal
 * @returns {number} energy in kJ rounded to one decimal point
 */
const convertKcal2KJ = (kcal) => {
    let kcalValue = kcal;

    if (typeof kcal === 'string') {
        kcalValue = parseFloat(kcal);
    }

    if (isNaN(kcalValue) || kcal === null) {
        throw new Error(`invalid input: ${kcal} is not a number`);
    }

    const kj = kcalValue * 4.184;
    return parseFloat(kj.toFixed(1));
};

export { convertKJ2Kcal, convertKcal2KJ };
