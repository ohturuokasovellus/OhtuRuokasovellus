const filesystem = require('fs');
const papa = require('papaparse');

async function getIngredients(csvFilePath){
    const csvFile = filesystem.createReadStream(csvFilePath);
    return new Promise(resolve => {
        let ingredientCategoryDictionary = {};
        let ingredientIdDictionary = {};

        papa.parse(csvFile, {
            worker: true, // Don't bog down the main thread if its a big file
            step: function(result) {
                if (result.data.at(0) != 'id' && result.data.at(2) != 'name')
                { // skip column names, 
                    //first word of the line is 'id' or a id number
                    if(!(result.data.at(1) in ingredientCategoryDictionary)) {
                        // check if ingredient category is not already 
                        // in the ingredientCategoryDictionary
                        ingredientCategoryDictionary[result.data.at(1)] = [];
                    }
                    if(!(result.data.at(0) in ingredientIdDictionary)) {
                        // check if ingredient id is not already 
                        // in the ingredientIdDictionary
                        ingredientIdDictionary[String(result.data.at(2))] = 
                            result.data.at(0);
                    }

                    ingredientCategoryDictionary[result.data.at(1)]
                        .push(result.data.at(2));
                }
            },
            complete: function() {
                resolve([ingredientIdDictionary, ingredientCategoryDictionary]);
            }
        });
    });
}

module.exports = {getIngredients};