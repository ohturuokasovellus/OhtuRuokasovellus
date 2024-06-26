/* eslint-disable camelcase */
require('dotenv').config();
const postgres = require('postgres');
const { compareHashes } = require('./services/hash');

//const sql = postgres('postgres://username:password@host:port/database', {
//  host: process.env.POSTGRES_IP, // Postgres ip address[s] or domain name[s]
//  port: 5432,                                // Postgres server port[s]
//  database: process.env.POSTGRES_DB_NAME,    // Name of database to connect to
//  username: process.env.POSTGRES_USERNAME,   // Username of database user
//  password: process.env.POSTGRES_PASSWORD,   // Password of database user
//})

const databaseURL = process.env.E2ETEST == '1' ?
    process.env.E2ETEST_POSTGRES_URL : process.env.BACKEND_POSTGRES_URL;

// Our databases for workflows do not support many connectios
// so we have to limit them here
const sql = postgres(databaseURL, 
    { max: process.env.E2ETEST == '1' ? 1 : 10 }
);

/**
 * Insert a new user into the database.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {number} birthYear
 * @param {string} gender
 * @param {string} education
 * @param {string} income
 */
const insertUser = async (
    username, password, email, birthYear,
    gender, education, income) => {
    await sql`
        INSERT INTO users (
            username, password, email, birth_year,
            gender, education, income
            )
        VALUES (
            pgp_sym_encrypt(${username},
            ${process.env.DATABASE_ENCRYPTION_KEY}),
            ${password},
            pgp_sym_encrypt(
            ${email},${process.env.DATABASE_ENCRYPTION_KEY}),
            pgp_sym_encrypt(
            ${birthYear},${process.env.DATABASE_ENCRYPTION_KEY}),
            pgp_sym_encrypt(
            ${gender},${process.env.DATABASE_ENCRYPTION_KEY}),
            pgp_sym_encrypt(
            ${education},${process.env.DATABASE_ENCRYPTION_KEY}),
            pgp_sym_encrypt(
            ${income},${process.env.DATABASE_ENCRYPTION_KEY})
            )
        `;
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

/**
 * @param {string} username 
 * @param {string} password hashed password 
 * @returns {Promise<{ userId: number, username: string,
 *  restaurantId: number?}?>} Whether there exists user with given credentials
 */
const getUser = async (username, password) => {
    const result = await sql`
        SELECT user_id, pgp_sym_decrypt(username::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS username, 
            password, restaurant_id, is_admin FROM users
        WHERE pgp_sym_decrypt(username::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) 
            = ${username} AND username IS NOT NULL AND password IS NOT NULL;
    `;
    if (result.length !== 1) {
        return null;
    }
    if (compareHashes(password, result[0].password) !== true) {
        return null;
    }
    return {
        userId: result[0].user_id,
        username: result[0].username,
        restaurantId: result[0].restaurant_id,
        isAdmin: result[0].is_admin
    };
};

/**
 * Check whether the given password matches the correct password of a user.
 * @param {number} userId ID of the user whose password to check
 * @param {string} password Hashed password
 * @returns {Promise<boolean>} Whether the password is correct
 */
const checkPassword = async (userId, password) => {
    const result = await sql`
        SELECT password FROM users
        WHERE user_id = ${userId} AND password IS NOT NULL;
    `;
    if (result.length !== 1) {
        return false;
    }
    return compareHashes(password, result[0].password);
};

/**
 * Get most of the personal information of a user.
 * @param {number} userId
 * @returns {Promise<{ username: string, email: string, birth_year: string,
 *  gender: string, education: string, income: string }?>}
 */
const getUserInfo = async userId => {
    const result = await sql`
        SELECT
            pgp_sym_decrypt(username::bytea,
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS username,
            pgp_sym_decrypt(email::bytea,
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS email,
            pgp_sym_decrypt(birth_year::bytea,
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS birth_year,
            pgp_sym_decrypt(gender::bytea,
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS gender,
            pgp_sym_decrypt(education::bytea,
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS education,
            pgp_sym_decrypt(income::bytea,
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS income
        FROM users
        WHERE user_id = ${userId} AND username IS NOT NULL;
    `;
    if (result.length !== 1) return null;
    return result[0];
};

/**
 * Get user id based on email.
 * @param {string} email
 * @returns {Promise<number|null>} - user id or null if not found
 */
const getUserIdByEmail = async (email) => {
    const result = await sql`
    SELECT user_id FROM users
    WHERE pgp_sym_decrypt(email::bytea, 
        ${process.env.DATABASE_ENCRYPTION_KEY}) = ${email}
        AND email IS NOT NULL
    LIMIT 1
    `;
    return result.at(0).user_id;
};

/**
 * Get user's restaurant id based on user's id.
 * @param {number} userId
 * @returns {Promise<number|null>} - restaurant id or null if not found
 */
const getRestaurantIdByUserId = async (userId) => {
    const result = await sql`
    SELECT restaurant_id FROM users
    WHERE user_id = ${userId}
    AND username IS NOT NULL
    LIMIT 1
    `;
    return result.at(0).restaurant_id;
};

/**
 * Update user's restaurant id based on email.
 * @param {string} email
 * @param {number} restaurantId new restaurant id
 * @returns {Promise<boolean>} true if successful
 */
const updateUserRestaurantByEmail = async (email, restaurantId) => {
    const result = await sql`
        UPDATE users
        SET restaurant_id = ${restaurantId}
        WHERE pgp_sym_decrypt(email::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${email}
            AND email IS NOT NULL
        RETURNING restaurant_id
    `;
    return result.length > 0;
};

/**
 * Delete user's username, email and password from the database.
 * @param {number} userId ID of the user.
 */
const deleteUser = async userId => {
    await sql`
        UPDATE users SET username = NULL, password = NULL, email = NULL
        WHERE user_id = ${userId};
    `;
};

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

/**
 * Query for setting evaluation metric
 * @param {number} evalKey evaluation metric key
 * @param {number} evalValue evaluation value
 * @returns {Promise<Boolean>} true if success
*/
const setEvaluationMetric = async (userId, evalKey, evalValue) => {
    const result = await sql`
        INSERT INTO evaluations (user_id, eval_key, eval_value)
        VALUES (${userId}, ${evalKey}, ${evalValue})
        ON CONFLICT (user_id, eval_key)
        DO UPDATE SET eval_value = EXCLUDED.eval_value;
   `;
    return result.count === 1;
};

/**
 * Get all self evaluation metrics of a user.
 * @param {number} userId
 * @returns {Promise<{ eval_key: number, eval_value: number }[]>}
 */
const getEvaluations = async userId => {
    return await sql`
        SELECT eval_key, eval_value
        FROM evaluations
        WHERE user_id = ${userId};
    `;
};

module.exports = {
    sql,
    insertUser,
    insertRestaurant,
    getUser,
    checkPassword,
    getUserInfo,
    getUserIdByEmail,
    getRestaurantIdByUserId,
    deleteUser,
    doesRestaurantExist,
    updateUserRestaurantByEmail,
    addPurchase,
    getPurchases,
    setEvaluationMetric,
    getEvaluations,
};
