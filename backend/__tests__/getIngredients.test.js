const {getIngredientCategory} = require('../services/getIngredients');
const filesystem = require('fs');

const data = 'id,tuoteryhmä,name,energia. laskennallinen (kJ),'+
    'rasva (g),rasvahapot tyydyttyneet (g),hiilihydraatti imeytyvä (g),'+
    'sokerit (g),kuitu. kokonais- (g),proteiini (g),suola (mg),'+
    'CO2 (g/100g tuotetta)\n'+
    '1,potatoes,potato,50,1,0.5,10,1,5,0.1,0.1,5\n'+
    '2,fishes,fried fish,150,4,2,0,0,0,20,600,10\n';


describe('get ingredients', () => {
    beforeEach(() => {
        filesystem.writeFile('backend/csvFiles/example_nutrients.csv', 
            data, (err) => {
            // In case of a error throw err.
                if (err) throw err;
            });
    });

    test('ingredients are returned correctly', async () => {
        const ingredients = await getIngredientCategory(
            'backend/csvFiles/example_nutrients.csv');

        const correctIngredients = {'potatoes': ['potato'], 
            'fishes': ['fried fish']};

        expect(ingredients).toEqual(correctIngredients);
    });
});