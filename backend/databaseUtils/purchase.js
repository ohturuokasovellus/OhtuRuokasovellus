const { sql } = require('../database');

/**
 * Save purchase to the database.
 * @param {number} userId ID of the user who made the purchase.
 * @param {string} purchaseCode The 8-character purchase code of the meal.
 */
const addPurchase = async (userId, purchaseCode) => {
    await sql`
        INSERT INTO purchases (user_id, meal_id)
        VALUES (
            ${userId},
            (SELECT meal_id FROM meals WHERE purchase_code = ${purchaseCode})
        );
    `;
};

/**
 * Fetch all purchases of a single user.
 * @param {number} userId The ID of the user whose purchases to return.
 * @returns {Promise<{ date: string, mealId: number, mealName: string }[]>}
 *  All of the purchases of the user. Date is in ISO8601 format.
*/
const getPurchases = async userId => {
    const result = await sql`
    SELECT p.purchased_at, m.name, m.meal_id
    FROM purchases AS p, meals AS m
    WHERE p.user_id = ${userId} AND p.meal_id = m.meal_id
    `;
    return result.map(row => ({
        date: row.purchased_at,
        mealId: row.meal_id,
        mealName: row.name,
    }));
};

module.exports = {
    addPurchase,
    getPurchases
};