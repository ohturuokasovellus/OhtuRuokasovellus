const { sql } = require('../database');
const { compareHashes } = require('../services/hash');

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
 * @returns {Promise<boolean>} Whether the given email
 *  already exists in the database.
 */
const doesEmailExist = async email => {
    const result = await sql`
        SELECT exists (SELECT 1 FROM users 
        WHERE 
            pgp_sym_decrypt(email::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${email}
            AND email IS NOT NULL
            LIMIT 1);
    `;
    return result.at(0).exists;
};

/**
 * @param {string} username 
 * @returns {Promise<boolean>} Whether the given 
 * username already exists in the database.
 */
const doesUsernameExist = async username => {
    // https://stackoverflow.com/q/8149596
    const result = await sql`
        SELECT exists
        (SELECT 1 FROM users 
        WHERE 
            pgp_sym_decrypt(username::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${username}
            AND username IS NOT NULL
            LIMIT 1);
    `;
    return result.at(0).exists;
};

const getBirthYear = async (userId) => {
    const result = await sql`
    SELECT pgp_sym_decrypt(birth_year::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY})
            as decrypted_birth_year
    FROM users WHERE user_id = ${userId}
    `;
    return result.at(0).decrypted_birth_year;
};

const getGender = async (userId) => {
    const result = await sql `
    SELECT pgp_sym_decrypt(gender::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY})
            as decrypted_gender FROM users
    WHERE user_id = ${userId}
    `;
    return result.at(0).decrypted_gender;
};

/**
 * Get user's restaurant id based on user's id.
 * @param {number} userId
 * @returns {Promise<number|null>} restaurant id or null if not found
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
 * @param {string} username 
 * @param {string} password hashed password 
 * @returns {Promise<{ userId: number, username: string,
*  restaurantId: number?}?>} User if there exists user with given credentials
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
 * Check if a user is associated with a restaurant.
 * @param {number} userId
 * @returns {Promise<boolean>} true if user is a restaurant user
 */
const isRestaurantUser = async userId => {
    const result = await sql`
        SELECT exists
        (SELECT restaurant_id FROM users WHERE user_id = ${userId}
        AND username IS NOT NULL
        AND restaurant_id IS NOT NULL LIMIT 1);
    `;
    return result.at(0).exists;
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

module.exports = {
    checkPassword,
    deleteUser,
    doesEmailExist,
    doesUsernameExist,
    getBirthYear,
    getGender,
    getRestaurantIdByUserId,
    getUser,
    getUserIdByEmail,
    getUserInfo,
    insertUser,
    isRestaurantUser,
    updateUserRestaurantByEmail
};
