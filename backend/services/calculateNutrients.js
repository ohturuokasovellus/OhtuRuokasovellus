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

    // ingredientNutrients is of form: id, tuoteryhmä, name,
    // energia. laskennallinen (kJ),  rasva (g),
    // rasvahapot tyydyttyneet (g), hiilihydraatti imeytyvä (g),
    // sokerit (g),kuitu. kokonais- (g),proteiini (g),suola (mg),
    // CO2 (g/100g tuotetta)

    const nutrientCoefficient = amount / 100;

    try {
        const energy = Number(ingredientNutrients[3]);
        const fat = Number(ingredientNutrients[4]);
        const saturatedFat = Number(ingredientNutrients[5]);
        const carbs = Number(ingredientNutrients[6]);
        const sugar = Number(ingredientNutrients[7]);
        const fiber = Number(ingredientNutrients[8]);
        const protein = Number(ingredientNutrients[9]);
        const salt = Number(ingredientNutrients[10]);
        const co2Emissions = Number(ingredientNutrients[11]);

        nutrients['energy'] += energy * nutrientCoefficient;
        nutrients['fat'] += fat * nutrientCoefficient;
        nutrients['saturatedFat'] += saturatedFat * nutrientCoefficient;
        nutrients['carbohydrates'] += carbs * nutrientCoefficient;
        nutrients['sugar'] += sugar * nutrientCoefficient;
        nutrients['fiber'] += fiber * nutrientCoefficient;
        nutrients['protein'] += protein* nutrientCoefficient;
        nutrients['salt'] += salt * nutrientCoefficient;
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
        let nutrientsDictionary = {'energy': 0, 'fat': 0,  'saturatedFat': 0, 
            'carbohydrates':0, 'sugar': 0, 'fiber': 0, 'protein': 0, 
            'salt': 0, 'co2Emissions': 0};

        papa.parse(csvFile, {
            worker: true, // Don't bog down the main thread if its a big file
            step: function(result) {
                if (result.data.at(0) != 'id') { // skip column names, 
                    //first word of the line is 'id' or a id number
                    
                    if(result.data.at(0) in mealIngredients) { // check if
                        // ingredient id is found in the mealIngredients
                        calculateNutrientsForIngredient(
                            mealIngredients[result.data.at(0)], 
                            result.data, nutrientsDictionary);
                    }
                }
            },
            complete: function() {
                resolve(nutrientsDictionary);
            }
        });
        
    });

}

module.exports = {getNutrients};
