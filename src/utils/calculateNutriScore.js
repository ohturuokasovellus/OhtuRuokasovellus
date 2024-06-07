/**
 * 
 * @param {Dictionary} nutrition 
 * @returns {number} nutriScore
 */
function CalculateNutriScore(nutrition) {
    const kilocalories = Number(nutrition.energy) / 4.184;

    let negativePoints = 0;
    let positivePoints = 0;

    if (kilocalories > 800){
        negativePoints += 10;
    } else if (kilocalories > 720){
        negativePoints += 9;
    } else if (kilocalories > 640){
        negativePoints += 8;
    } else if (kilocalories > 560){
        negativePoints += 7;
    } else if (kilocalories > 480){
        negativePoints += 6;
    } else if (kilocalories > 400){
        negativePoints += 5;
    } else if (kilocalories > 320){
        negativePoints += 4;
    } else if (kilocalories > 240){
        negativePoints += 3;
    } else if (kilocalories > 160){
        negativePoints += 2;
    } else if (kilocalories > 80){
        negativePoints += 1;
    }

    const simpleSugars = Number(nutrition.carbohydrates) 
        + Number(nutrition.sugar);

    if (simpleSugars > 45){
        negativePoints += 10;
    } else if (simpleSugars > 40){
        negativePoints += 9;
    } else if (simpleSugars > 36){
        negativePoints += 8;
    } else if (simpleSugars > 31){
        negativePoints += 7;
    } else if (simpleSugars > 27){
        negativePoints += 6;
    } else if (simpleSugars > 22.5){
        negativePoints += 5;
    } else if (simpleSugars > 18){
        negativePoints += 4;
    } else if (simpleSugars > 13.5){
        negativePoints += 3;
    } else if (simpleSugars > 9){
        negativePoints += 2;
    } else if (simpleSugars > 4.5){
        negativePoints += 1;
    }

    const saturatedFats = Number(nutrition.saturatedFat);

    if(saturatedFats > 10){
        negativePoints += 10;
    }
    else{
        // for example, if saturatedFats is 9.9, 9 is added 
        // to the negativePoints. If saturatedFats is 2.2, 2 is added.
        negativePoints += Math.floor(saturatedFats);
    }

    const salts = Number(nutrition.salt);

    if (salts > 900){
        negativePoints += 10;
    } else if (salts > 810){
        negativePoints += 9;
    } else if (salts > 720){
        negativePoints += 8;
    } else if (salts > 630){
        negativePoints += 7;
    } else if (salts > 540){
        negativePoints += 6;
    } else if (salts > 450){
        negativePoints += 5;
    } else if (salts > 360){
        negativePoints += 4;
    } else if (salts > 270){
        negativePoints += 3;
    } else if (salts > 180){
        negativePoints += 2;
    } else if (salts > 90){
        negativePoints += 1;
    }

    const percentageOfVegetables = Number(nutrition.vegetablePercent);

    if (percentageOfVegetables > 80){
        positivePoints += 5;
    } else if (percentageOfVegetables > 60) {
        positivePoints += 2;
    } else if (percentageOfVegetables > 40) {
        positivePoints += 1;
    }

    const fibre = Number(nutrition.fiber);

    if (fibre > 4.5) {
        positivePoints += 5;
    } else if (fibre > 2.8) {
        positivePoints += 4;
    } else if (fibre > 2.1) {
        positivePoints += 3;
    } else if (fibre > 1.4) {
        positivePoints += 2;
    } else if(fibre > 0.7) {
        positivePoints += 1;
    }

    const proteins = Number(nutrition.protein);

    if (proteins > 8) {
        positivePoints += 5;
    } else if (proteins > 6.4) {
        positivePoints += 4;
    } else if (proteins > 4.8) {
        positivePoints += 3;
    } else if (proteins > 3.2) {
        positivePoints += 2;
    } else if (proteins > 1.6) {
        positivePoints += 1;
    }

    const nutriScore = negativePoints - positivePoints;
    return nutriScore;
}

export { CalculateNutriScore };
