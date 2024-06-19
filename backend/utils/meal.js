const { sql } = require('../database');

/**
 * Fetch all meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      restaurant_id: number, 
*      co2_emissions: string
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