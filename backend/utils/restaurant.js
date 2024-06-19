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
const getRestaurantName = async (restaurantId) => {
    const result = await sql`
        SELECT name AS restaurant_name
        FROM restaurants
        WHERE restaurant_id = ${restaurantId}
        LIMIT 1;
   `;
    return result;
};

module.exports = {
    getRestaurantName
};