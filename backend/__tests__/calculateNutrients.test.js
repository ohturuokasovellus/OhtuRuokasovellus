const {getNutrients} = require('../services/calculateNutrients');
const filesystem = require('fs');

const data = 'id,tuoteryhmä,name,energia. laskennallinen (kJ),'+
    'rasva (g),rasvahapot tyydyttyneet (g),hiilihydraatti imeytyvä (g),'+
    'sokerit (g),kuitu. kokonais- (g),proteiini (g),suola (mg),'+
    'CO2 (g/100g tuotetta)\n'+
    '1,potatoes,potato,50,1,0.5,10,1,5,0.1,0.1,5\n'+
    '2,fishes,fried fish,150,4,2,0,0,0,20,600,10\n';


describe('calculate nutrients', () => {
    beforeEach(() => {
        filesystem.writeFile('backend/csvFiles/example_nutrients.csv', 
            data, (err) => {
            // In case of a error throw err.
                if (err) throw err;
            });
    });

    test('nutrients are calculated correctly', async () => {
        const nutrients = await getNutrients({'1': 100, '2':50}, 
            'backend/csvFiles/example_nutrients.csv');

        const correctNutrients = {'energy': 125, 'fat': 3 , 
            'saturatedFat': 1.5, 'carbohydrates': 10, 'sugar': 1, 
            'fiber': 5, 'protein': 10.1, 'salt': 300.1, 
            'co2Emissions': 10};

        expect(nutrients).toEqual(correctNutrients);
    });
});