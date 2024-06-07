import { CalculateNutriScore } from '../utils/calculateNutriScore';

describe('nutri-score', () => {
    test('nutri-score is calculated correctly', () => {
        const nutrition = {
            energy: 4.184*81, // gets converted into joules, worth 1 bad point
            carbohydrates: 7,
            sugar: 7, // carbs + sugar = 14, worth 3 bad points
            saturatedFat: 3.1, // worth 3 bad point
            salt: 450, // worth 4 bad point
            vegetablePercent: 81, // worth 5 good points
            fiber: 3, // worth 4 good points
            protein: 1, // worth 0 good points
        };

        // good points = 9, bad points = 11
        // nutriscore =  bad points - good points = 2
    
        const nutriScore = CalculateNutriScore(nutrition);
        
        expect(nutriScore).toBe(2);

        const nutrition2 = {
            energy: 0,
            carbohydrates: 0,
            sugar: 0, 
            saturatedFat: 0, 
            salt: 0, 
            vegetablePercent: 0, 
            fiber: 0,
            protein: 0, 
        };
    
        const nutriScore2 = CalculateNutriScore(nutrition2);
        
        expect(nutriScore2).toBe(0);
    }); 
});
