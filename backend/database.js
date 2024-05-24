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

const insertUser = async (username, password, email, restaurantId) => {
    await sql`
        INSERT INTO users (username, password, email, restaurant_id)
        VALUES (${username}, ${password}, ${email}, ${restaurantId})
    `;
};

const insertRestaurant = async (name) => {
    const result = await sql`
        INSERT INTO restaurants (name)
        VALUES (${name})
        RETURNING restaurant_id
    `;
    return result[0].restaurant_id;
};

/**
 * @param {string} username 
 * @param {string} password hashed password 
 * @returns {Promise<{ user_id: number, username: string, password: string
 * restaurant_id: number}n>} Whether there exists user with given credentials
 */
const getUser = async (username, password) => {
    const result = await sql`
        SELECT * FROM users
        WHERE username = ${username} and password = ${password};
    `;
    return result[0];
};

// const getRestaurantId = async (username) => {
//     const result = await sql`
//         SELECT restaurant_id FROM users
//         WHERE username = ${username}
//         `;
//     return result[0].restaurant_id;
// };

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
 * Fetch restaurant specific meals from database.
 * @param {number} restaurantId
 * @returns {Promise<{ meal_id: number, meal_name: string, image: string,
 * restaurant_name: string }[]>}
 */
const getMeals = async (restaurantId) => {
    const result = await sql`
        SELECT m.meal_id, m.name as meal_name, m.image, 
        CASE 
            WHEN r.restaurant_id IS NOT NULL THEN r.name 
            ELSE NULL 
        END as restaurant_name 
        FROM meals m
        LEFT JOIN restaurants r ON m.restaurant_id = r.restaurant_id
        WHERE m.restaurant_id = ${restaurantId};
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
    insertRestaurant,
    doesUsernameExist,
    getUser,
    doesEmailExist,
    // getRestaurantId,
    insertMeal,
    addMealImage,
    getMeals,
    isRestaurantUser
};
