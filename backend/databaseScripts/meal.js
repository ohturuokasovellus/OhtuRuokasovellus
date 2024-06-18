const { sql } = require('../database');

/**
 * Fetch restaurant specific meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      meal_id: number, 
*      meal_name: string, 
*      purchase_code: string,
*  }[]>}
*/
const getMealEmissionsWithId = async (restaurantId) => {
    const result = await sql`
       SELECT meal_id, name as meal_name, purchase_code
       FROM meals
       WHERE restaurant_id = ${restaurantId} AND is_active = TRUE;
   `;
    return result;
};

/**
 * Fetch all meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      meal_id: number, 
*      meal_name: string, 
*      purchase_code: string,
*  }[]>}
*/
const getAllMealEmissions = async (restaurantId) => {
    const result = await sql`
       SELECT meal_id, name as meal_name, purchase_code
       FROM meals
       WHERE restaurant_id = ${restaurantId} AND is_active = TRUE;
   `;
    return result;
};

module.exports = {
    getMealEmissionsWithId,
    getAllMealEmissions
};