const { sql } = require('../database');

/**
 * Fetch all meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{restaurant_name: string}>|[]}
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

/**
 * Insert a new restaurant into the database.
 * @param {string} restaurantName
 * @returns {Promise<number>} - id of the new restaurant
 */
const insertRestaurant = async (restaurantName) => {
    const result = await sql`
        INSERT INTO restaurants (name)
        VALUES (${restaurantName})
        RETURNING restaurant_id
    `;
    return result.at(0).restaurant_id;
};

module.exports = {
    getRestaurantName,
    insertRestaurant
};