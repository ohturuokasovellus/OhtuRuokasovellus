const filesystem = require('fs');
const papa = require('papaparse');

async function getIngredients(csvFilePath){
    const csvFile = filesystem.createReadStream(csvFilePath);
    return new Promise(resolve => {
        let ingredientDictionary = {};

        papa.parse(csvFile, {
            worker: true, // Don't bog down the main thread if its a big file
            step: function(result) {
                if (result.data.at(0) != 'id') { // skip column names, 
                    //first word of the line is 'id' or a id number
                    if(!(result.data.at(1) in ingredientDictionary)) {
                        // check if ingredient category is not already 
                        // in the mealIngredients
                        ingredientDictionary[result.data.at(1)] = [];
                    }
                    ingredientDictionary[result.data.at(1)]
                        .push(result.data.at(2));
                }
            },
            complete: function() {
                resolve(ingredientDictionary);
            }
        });
    });
}

module.exports = {getIngredients};