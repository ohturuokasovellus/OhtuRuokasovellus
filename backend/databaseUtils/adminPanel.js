/* eslint-disable camelcase */
require('dotenv').config();
const postgres = require('postgres');

const sql = postgres(process.env.E2ETEST == '1' ?
    process.env.E2ETEST_POSTGRES_URL :
    process.env.BACKEND_POSTGRES_URL);

/**
 * Get restaurants
 * @returns {Promise<List>} list of restaurant objects
*/
const getRestaurants = async () => {
    const result = await sql`
       SELECT restaurant_id, name from restaurants
       WHERE is_active = TRUE;
   `;
    return result.map(row => ({
        restaurantId: row.restaurant_id,
        name: row.name,
    }));
};

/**
 * Get restaurant users
 * @returns {Promise<List>} list of restaurant user usernames
*/
const getRestaurantUsers = async (restaurantId) => {
    const result = await sql`
       SELECT pgp_sym_decrypt(username::bytea, 
        ${process.env.DATABASE_ENCRYPTION_KEY}) AS username
        FROM users WHERE restaurant_id = ${restaurantId};
   `;
    return result;
};

/**
 * Set restaurant to inactive
*/
const setRestaurantToInactive = async (restaurantId) => {
    await sql`
        UPDATE restaurants SET is_active = FALSE
        WHERE restaurant_id = ${restaurantId};
   `;
};

/**
 * Set meal to inactive.
 * @param {number} mealId
 */
const setRestaurantMealsToInactive = async (restaurantId) => {
    await sql`
        UPDATE meals SET is_active = FALSE
        WHERE restaurant_id = ${restaurantId};
    `;
};

/**
 * query for deattaching users from restaurant
 * @param {number} restaurantId
 */
const deattachUsersFromRestaurant = async (restaurantId) => {
    await sql`
        UPDATE users SET restaurant_id = NULL
        WHERE restaurant_id = ${restaurantId};
    `;
};

/**
 * query for adding user to restaurant
 * @param {number} restaurantId
 * @param {string} username
 * @returns {Promise<Boolean>} true if success
 */
const addUserToRestaurant = async (restaurantId, username) => {
    const result = await sql`
        UPDATE users SET restaurant_id = ${restaurantId}
        WHERE pgp_sym_decrypt(username::bytea, 
        ${process.env.DATABASE_ENCRYPTION_KEY}) = ${username};
    `;
    return result.count === 1;
};

module.exports = {
    sql,
    getRestaurants,
    getRestaurantUsers,
    setRestaurantToInactive,
    setRestaurantMealsToInactive,
    deattachUsersFromRestaurant,
    addUserToRestaurant
};
