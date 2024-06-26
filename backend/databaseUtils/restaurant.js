const { sql } = require('../database');

/**
 * @param {string} email 
 * @returns {Promise<boolean>} Whether the given restaurant
 *  already exists in the database.
 */
const doesRestaurantExist = async name => {
    const result = await sql`
    SELECT exists (SELECT 1 FROM restaurants WHERE name = ${name} LIMIT 1)`;
    return result.at(0).exists;
};

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
    doesRestaurantExist,
    getRestaurantName,
    insertRestaurant
};