const {getNutrients} = require('../services/calculateNutrients');
const filesystem = require('fs');

const data = 'id,tuoteryhmä,name,energia laskennallinen (kJ),'+
    'rasva (g),rasvahapot tyydyttyneet (g),hiilihydraatti imeytyvä (g),'+
    'sokerit (g),kuitu kokonais- (g),proteiini (g),suola (mg),'+
    'CO2 (g/100g tuotetta), kasvis\n'+
    '1,vihannekset,potato,50,1,0.5,10,1,5,0.1,0.1,5,true\n'+
    '2,fishes,fried fish,150,4,2,0,0,0,20,600,10,false\n';


describe('calculate nutrients', () => {
    beforeEach(() => {
        filesystem.writeFileSync('backend/csvFiles/example_nutrients.csv', 
            data
        );
    });

    afterEach(() => {
        filesystem.rmSync('backend/csvFiles/example_nutrients.csv');
    });

    test('nutrients are calculated correctly', async () => {
        const nutrients = await getNutrients({'1': 100, '2':50}, 
            'backend/csvFiles/example_nutrients.csv');

        const correctNutrients = {'energy': '125.00', 'fat': '3.00' , 
            'saturatedFat': '1.50', 'carbohydrates': '10.00', 'sugar': '1.00', 
            'fiber': '5.00', 'protein': '10.10', 'salt': '300.10', 
            'co2Emissions': 10, 'vegetablePercent': '66.67'};

        expect(nutrients).toEqual(correctNutrients);
    });
});