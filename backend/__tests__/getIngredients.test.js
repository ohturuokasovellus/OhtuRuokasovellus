const {getIngredients, getVegetablesAndFruits} 
    = require('../services/getIngredients');
const filesystem = require('fs');

const data = 'id,tuoteryhmä,name,energia. laskennallinen (kJ),'+
    'rasva (g),rasvahapot tyydyttyneet (g),hiilihydraatti imeytyvä (g),'+
    'sokerit (g),kuitu. kokonais- (g),proteiini (g),suola (mg),'+
    'CO2 (g/100g tuotetta)\n'+
    '1,vihannekset,potato,50,1,0.5,10,1,5,0.1,0.1,5\n'+
    '2,fishes,fried fish,150,4,2,0,0,0,20,600,10\n';


describe('get ingredients', () => {
    beforeEach(() => {
        filesystem.writeFileSync('backend/csvFiles/example_nutrients.csv', 
            data
        );
    });
    test('ingredient names are returned correctly', async () => {
        const ingredients = await getIngredients(
            'backend/csvFiles/example_nutrients.csv');
        
        const ingredientNames = ingredients[0];

        const correctIngredientNames = {'potato': '1', 
            'fried fish': '2'};

        expect(ingredientNames).toEqual(correctIngredientNames);
    });

    test('ingredients are returned correctly', async () => {
        const ingredients = await getIngredients(
            'backend/csvFiles/example_nutrients.csv');
        
        const ingredientCategories = ingredients[1];

        const correctIngredients = {'vihannekset': ['potato'], 
            'fishes': ['fried fish']};

        expect(ingredientCategories).toEqual(correctIngredients);
    });

    test('vegetablesAndFruits are returned correctly', async () => {
        const vegetablesOrFruits = await getVegetablesAndFruits(
            'backend/csvFiles/example_nutrients.csv');

        const correctIngredients = ['potato']; 

        expect(vegetablesOrFruits).toEqual(correctIngredients);
    });
});