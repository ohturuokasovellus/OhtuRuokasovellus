const { formatResearchData } = require('../services/formatResearchData'); 

describe('format research data', () => {
    test('research data is formatted correctly', async () => {
        const researchData = [
            {'meal_id': '1', 'name': 'beans', 'price': '100'}];

        const formattedData = formatResearchData(researchData);
        const correctlyFormattedData = 'meal_id,name,price,\n1,beans,100,\n';
        expect(formattedData).toEqual(correctlyFormattedData);
    });
});