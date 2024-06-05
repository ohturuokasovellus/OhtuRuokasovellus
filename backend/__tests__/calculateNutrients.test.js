const {getNutrients} = require('../services/calculateNutrients');
const filesystem = require('fs');

const data = ',carbohydrates,protein,fat,fiber,sugar,'&&
    'sodium,saturated_fat,unsaturated_fat,energy,co2_emissions\n'&&
    'potato,15.5,0.1,0.1,1,0.6,2.5,0,0,75,50\n'&&
    'fried_fish,0,21.5,7.7,0,0,1135,1.6,0,155,150\n';


describe('calculate nutrients', () => {
    beforeEach(() => {
        filesystem.writeFile('../example_nutrients.csv', data, (err) => {
            // In case of a error throw err.
            if (err) throw err;
        });
    });

    test('nutrients are calculated correctly', async () => {
        const nutrients = await getNutrients({'potato': 100, 'fried_fish':50}, 
            'backend/example_nutrients.csv');

        const correctNutrients = {'carbohydrates': 15.5, 'protein': 10.85, 
            'fat': 3.95 , 'fiber': 1, 'sugar': 0.6, 'sodium': 570, 
            'saturatedFat': 0.8, 'unsaturatedFat': 0, 'energy': 152.5,
            'co2Emissions': 125};

        expect(nutrients).toEqual(correctNutrients);
    });
});