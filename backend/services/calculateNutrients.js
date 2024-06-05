const filesystem = require('fs');
const papa = require('papaparse');

/**
 * 
 * @param {number} amount 
 * @param {Array} ingredientNutrients 
 * @param {Dictionary} nutrients 
 * @returns {Dictionary}
 */
function calculateNutrientsForIngredient(amount, ingredientNutrients, 
    nutrients){

    const nutrientCoefficient = amount / 100;

    try {
        const carbs = Number(ingredientNutrients[1]);
        const protein = Number(ingredientNutrients[2]);
        const fat = Number(ingredientNutrients[3]);
        const fiber = Number(ingredientNutrients[4]);
        const sugar = Number(ingredientNutrients[5]);
        const sodium = Number(ingredientNutrients[6]);
        const saturatedFat = Number(ingredientNutrients[7]);
        const unsaturatedFat = Number(ingredientNutrients[8]);
        const energy = Number(ingredientNutrients[9]);
        const co2Emissions = Number(ingredientNutrients[10]);

        nutrients['carbohydrates'] += carbs * nutrientCoefficient;
        nutrients['protein'] += protein* nutrientCoefficient;
        nutrients['fat'] += fat * nutrientCoefficient;
        nutrients['fiber'] += fiber * nutrientCoefficient;
        nutrients['sugar'] += sugar * nutrientCoefficient;
        nutrients['sodium'] += sodium * nutrientCoefficient;
        nutrients['saturatedFat'] += saturatedFat * nutrientCoefficient;
        nutrients['unsaturatedFat'] += unsaturatedFat * nutrientCoefficient;
        nutrients['energy'] += energy * nutrientCoefficient;
        nutrients['co2Emissions'] += co2Emissions * nutrientCoefficient;
    }
    catch(error){
        console.log(error);
    }

    return nutrients;
}

/**
 * Calculates nutrients from ingredients, https://stackoverflow.com/a/52350312
 * @param {Dictionary} mealIngredients 
 * @param {string} csvPathName - path of the csv that we want to read
 * @returns {Dictionary}
 */
async function getNutrients(mealIngredients, csvPathName){
    const csvFile = filesystem.createReadStream(csvPathName);

    return new Promise(resolve => {
        let nutrients = {'carbohydrates':0, 'protein': 0, 'fat': 0, 
            'fiber': 0, 'sugar': 0, 'sodium': 0, 'saturatedFat': 0, 
            'unsaturatedFat': 0, 'energy': 0, 'co2Emissions': 0};

        papa.parse(csvFile, {
            worker: true, // Don't bog down the main thread if its a big file
            step: function(result) {
                if (result.data.at(0) != '') { // skip column names
                    if(result.data.at(0) in mealIngredients) { // check if
                        // ingredient is found in the mealIngredients
                        calculateNutrientsForIngredient(
                            mealIngredients[result.data.at(0)], 
                            result.data, nutrients);
                    }
                }
            },
            complete: function() {
                resolve(nutrients);
            }
        });
        
    });

}

module.exports = {getNutrients};
