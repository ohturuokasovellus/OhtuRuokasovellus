const filesystem = require('fs');
const papa = require('papaparse');
const file = filesystem.createReadStream('backend/example_nutrients.csv');

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

    const carbs = Number(ingredientNutrients[1].replace(',','.'));
    const protein = Number(ingredientNutrients[2].replace(',','.'));
    const fat = Number(ingredientNutrients[3].replace(',','.'));
    const fiber = Number(ingredientNutrients[4].replace(',','.'));
    const sugar = Number(ingredientNutrients[5].replace(',','.'));
    const sodium = Number(ingredientNutrients[6].replace(',','.'));
    const saturatedFat = Number(ingredientNutrients[7].replace(',','.'));
    const unsaturatedFat = Number(ingredientNutrients[8].replace(',','.'));
    const energy = Number(ingredientNutrients[9].replace(',','.'));
    const co2Emissions = Number(ingredientNutrients[10].replace(',','.'));

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

    return nutrients;
}

/**
 * Calculates nutrients from ingredients, https://stackoverflow.com/a/52350312
 * @param {Dictionary} ingredients 
 * @returns {Dictionary}
 */
async function getNutrients(mealIngredients){
    return new Promise(resolve => {
        let nutrients = {'carbohydrates':0, 'protein': 0, 'fat': 0, 
            'fiber': 0, 'sugar': 0, 'sodium': 0, 'saturatedFat': 0, 
            'unsaturatedFat': 0, 'energy': 0, 'co2Emissions': 0};

        papa.parse(file, {
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
