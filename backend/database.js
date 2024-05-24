require('dotenv').config();
const postgres = require('postgres');

//const sql = postgres('postgres://username:password@host:port/database', {
//  host: process.env.POSTGRES_IP, // Postgres ip address[s] or domain name[s]
//  port: 5432,                                // Postgres server port[s]
//  database: process.env.POSTGRES_DB_NAME,    // Name of database to connect to
//  username: process.env.POSTGRES_USERNAME,   // Username of database user
//  password: process.env.POSTGRES_PASSWORD,   // Password of database user
//})

const sql = postgres(process.env.E2ETEST == '1' ?
    process.env.E2ETEST_POSTGRES_URL :
    process.env.BACKEND_POSTGRES_URL);

const insertUser = async (username, password, email) => {
    await sql`
        INSERT INTO users (username, password, email)
        VALUES (${username}, ${password}, ${email})
    `;
};

const getUser = async (username, password) => {
    const result = await sql`
        SELECT * FROM users
        WHERE username = ${username} and password = ${password};
    `;
    return result[0];
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
        (SELECT 1 FROM users WHERE username = ${username} LIMIT 1);
    `;
    return result.at(0).exists;
};

/**
 * @param {string} email 
 * @returns {Promise<boolean>} Whether the given email
 *  already exists in the database.
 */
const doesEmailExist = async email => {
    const result = await sql`
        SELECT exists (SELECT 1 FROM users WHERE email = ${email} LIMIT 1);
    `;
    return result.at(0).exists;
};

/**
 * Insert a new meal to the database.
 * @param {string} name Name of the meal.
 * @returns {Promise<number>} ID of the created meal.
 */
const insertMeal = async name => {
    // TODO: add another parameter for the restaurant id
    const result = await sql`
        INSERT INTO meals (name, restaurant_id)
        VALUES (${name}, 1)
        RETURNING meal_id;
    `;
    return result.at(0).meal_id;
};

/**
 * Attach image to the meal.
 * @param {number} mealId
 * @param {Buffer} imageData
 * @returns {Promise<boolean>} Whether the meal existed
 *  (and thus the image was successfully added).
 */
const addMealImage = async (mealId, imageData) => {
    const result = await sql`
        UPDATE meals SET image = ${imageData} WHERE meal_id = ${mealId};
    `;
    return result.count === 1;
};

/**
 * Fetch all meals from the database.
 * @returns {Promise<{ name: string }[]>}
 */
const getMeals = async () => {
    // TODO: add parameter for the restaurant id
    //       and filter the results with that
    const result = await sql`
        SELECT name FROM meals WHERE restaurant_id = 1;
    `;
    return result;
};

const isRestaurantUser = async userId => {
    const result = await sql`
        SELECT exists
        (SELECT restaurant_id FROM users WHERE user_id = ${userId} LIMIT 1);
    `;
    return result.at(0).exists;
};

module.exports = {
    sql,
    insertUser,
    doesUsernameExist,
    getUser,
    doesEmailExist,
    insertMeal,
    addMealImage,
    getMeals,
    isRestaurantUser
};
