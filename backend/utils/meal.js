const { sql } = require('../database');

/**
 * Fetch all meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      meal_id: number, 
*      meal_name: string, 
*      purchase_code: string,
*  }[]>}
*/
const getAllMealEmissions = async () => {
    const result = await sql`
       SELECT restaurant_id, co2_emissions
       FROM meals
       WHERE is_active = TRUE;
   `;
    return result;
};

module.exports = {
    getAllMealEmissions
};