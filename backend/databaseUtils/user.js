const { sql } = require('../database');

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

module.exports = {
    doesEmailExist,
    doesUsernameExist,
    getBirthYear,
    getGender,
    isRestaurantUser
};
