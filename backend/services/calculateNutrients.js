const filesystem = require('fs');
const papa = require('papaparse');
const { getVegetablesAndFruits }  = require('../services/getIngredients');

/**
 * 
 * @param {number} mass - mass of the ingredient used, in grams
 * @param {Array} ingredientNutrients 
 * @param {Dictionary} nutrients 
 * @returns {Dictionary}
 */
function calculateNutrientsForIngredient(mass, ingredientNutrients, 
    nutrients){
    // ingredientNutrients is of form: id, tuoteryhmä, name,
    // energia. laskennallinen (kJ),  rasva (g),
    // rasvahapot tyydyttyneet (g), hiilihydraatti imeytyvä (g),
    // sokerit (g),kuitu. kokonais- (g),proteiini (g),suola (mg),
    // CO2 (g/100g tuotetta)

    // coefficient is mass / 100, because the default mass is 100g
    const nutrientCoefficient = mass / 100;

    try {
        const energy = Number(ingredientNutrients[3].replace(' ', ''));
        const fat = Number(ingredientNutrients[4].replace(' ', ''));
        const saturatedFat = Number(ingredientNutrients[5].replace(' ', ''));
        const carbs = Number(ingredientNutrients[6].replace(' ', ''));
        const sugar = Number(ingredientNutrients[7].replace(' ', ''));
        const fiber = Number(ingredientNutrients[8].replace(' ', ''));
        const protein = Number(ingredientNutrients[9].replace(' ', ''));
        const salt = Number(ingredientNutrients[10].replace(' ', ''));
        const co2Emissions = Number(ingredientNutrients[11].replace(' ', ''));

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
 * @param {Dictionary} mealIngredients - mealId is key, mass is value
 * @param {string} csvPathName - path of the csv that we want to read
 * @returns {Dictionary}
 */
async function getNutrients(mealIngredients, csvPathName){
    const csvFile = filesystem.createReadStream(csvPathName);

    // find every ingredient name that belongs to the vegetables or fruits
    // category.
    const vegetablesAndFruits = await getVegetablesAndFruits(csvPathName);

    return new Promise(resolve => {
        let nutrientsDictionary = {'energy': 0, 'fat': 0,  'saturatedFat': 0, 
            'carbohydrates':0, 'sugar': 0, 'fiber': 0, 'protein': 0, 
            'salt': 0, 'co2Emissions': 0, 'vegetablePercent': 0, 'mealMass': 0};
        
        let vegetableMass = 0;

        papa.parse(csvFile, {
            worker: true, // Don't bog down the main thread if its a big file
            step: function(result) {
                if (result.data.at(0) != 'id') { // skip column names, 
                    // first word of a line is 'id' or a id number
                    
                    if(result.data.at(0) in mealIngredients) { // check if
                        // ingredient id is found in the mealIngredients
                        const mass = mealIngredients[result.data.at(0)];
                        nutrientsDictionary['mealMass'] += Number(mass);

                        // if ingredient name is found in vegetablesAndFruits
                        if(vegetablesAndFruits.includes(result.data.at(2))){
                            vegetableMass += mealIngredients[result.data.at(0)];
                        }

                        calculateNutrientsForIngredient(mass, 
                            result.data, nutrientsDictionary);
                    }
                }
            },
            complete: function() {
                const mealMass = nutrientsDictionary['mealMass'];
                const vegetablePercent = (vegetableMass / mealMass 
                    * 100).toFixed(2);
                nutrientsDictionary['vegetablePercent'] = vegetablePercent;

                nutrientsDictionary = updateNutrients(nutrientsDictionary);
               
                resolve(nutrientsDictionary);
            }
        });
    });
}

function updateNutrients(nutrientsDictionary){
    const allMass = nutrientsDictionary['mealMass'];

    // we have thus far saved all the nutrients in the meal,
    // so now we have to save the nutrients to be per 100g
    // nutrients / 100g = allNutrients / allMass
    // nutrients = allNutrients / allMass * 100g
    nutrientsDictionary['energy'] = (nutrientsDictionary['energy'] 
        / allMass * 100).toFixed(2);
    nutrientsDictionary['fat'] = (nutrientsDictionary['fat'] 
        / allMass * 100).toFixed(2);
    nutrientsDictionary['saturatedFat'] = (nutrientsDictionary['saturatedFat'] 
        / allMass * 100).toFixed(2);
    nutrientsDictionary['carbohydrates'] = (nutrientsDictionary['carbohydrates']
        / allMass * 100).toFixed(2);
    nutrientsDictionary['sugar'] = (nutrientsDictionary['sugar'] 
        / allMass * 100).toFixed(2);
    nutrientsDictionary['fiber'] = (nutrientsDictionary['fiber'] 
        / allMass * 100).toFixed(2);
    nutrientsDictionary['protein'] = (nutrientsDictionary['protein'] 
        / allMass * 100).toFixed(2);
    nutrientsDictionary['salt'] = (nutrientsDictionary['salt'] 
        / allMass * 100).toFixed(2);

    return nutrientsDictionary;
}

module.exports = {getNutrients};
