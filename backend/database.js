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

/**
 * Insert a new user into the database.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {number} restaurantId
 */
const insertUser = async (username, password, email, restaurantId) => {
    if(restaurantId){
        await sql`
            INSERT INTO users (username, password, email, restaurant_id)
            VALUES (pgp_sym_encrypt(${username},
                ${process.env.DATABASE_ENCRYPTION_KEY}), 
                ${password}, 
                pgp_sym_encrypt(
                    ${email},${process.env.DATABASE_ENCRYPTION_KEY}), 
                ${restaurantId})
        `;
    }
    else{
        await sql`
            INSERT INTO users (username, password, email)
            VALUES (pgp_sym_encrypt(${username},
                ${process.env.DATABASE_ENCRYPTION_KEY}), 
                ${password}, 
                pgp_sym_encrypt(
                    ${email},${process.env.DATABASE_ENCRYPTION_KEY}))
        `;
    } 
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
 * @returns {Promise<{ user_id: number, username: string, password: string
 * restaurant_id: number}n>} Whether there exists user with given credentials
 */
const getUser = async (username, password) => {
    const result = await sql`
        SELECT user_id, pgp_sym_decrypt(username::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) AS username, 
            password, restaurant_id FROM users
        WHERE pgp_sym_decrypt(username::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) 
            = ${username} and password = ${password};
    `;
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
        RETURNING restaurant_id
    `;
    return result.length > 0;
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
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${username} LIMIT 1);
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
        SELECT exists (SELECT 1 FROM users 
        WHERE 
            pgp_sym_decrypt(email::bytea, 
            ${process.env.DATABASE_ENCRYPTION_KEY}) = ${email} LIMIT 1);
    `;
    return result.at(0).exists;
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
 * Insert a new meal to the database.
 * @param {string} name Name of the meal.
 * @param {number} restaurantId Id of the restaurant who created the meal.
 * @param {string} mealDescription 
 * @param {number} co2Emissions CO2 emissions of the meal.
 * @param {string} mealAllergens Allergens of the meal.
 * @param {Dictionary} nutrientDictionary Nutrients of a meal in a dictionary
 * @returns {Promise<number>} ID of the created meal.
 */
const insertMeal = async (name, restaurantId, mealDescription,
    co2Emissions, mealAllergens, nutrientDictionary) => {
    const carbohydrates = nutrientDictionary['carbohydrates'];
    const protein = nutrientDictionary['protein'];
    const fat = nutrientDictionary['fat'];
    const fiber = nutrientDictionary['fiber'];
    const sugar = nutrientDictionary['sugar'];
    const sodium = nutrientDictionary['sodium'];
    const saturatedFat = nutrientDictionary['saturatedFat'];
    const unsaturatedFat = nutrientDictionary['unsaturatedFat'];

    const result = await sql`
        INSERT INTO meals (name, restaurant_id, meal_description,
            co2_emissions, meal_allergens, carbohydrates, protein,
            fat, fiber, sugar, sodium, saturated_fat, unsaturated_fat)
        VALUES (${name}, ${restaurantId}, ${mealDescription}, ${co2Emissions}, 
            ${mealAllergens}, ${carbohydrates}, ${protein}, ${fat}, 
            ${fiber}, ${sugar}, ${sodium}, ${saturatedFat}, ${unsaturatedFat})
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

/**
 * Check if a user is associated with a restaurant.
 * @param {number} userId
 * @returns {Promise<boolean>} true if user is a restaurant user
 */
const isRestaurantUser = async userId => {
    const result = await sql`
        SELECT exists
        (SELECT restaurant_id FROM users WHERE user_id = ${userId}
        AND restaurant_id IS NOT NULL LIMIT 1);
    `;
    return result.at(0).exists;
};

/**
 * @param {string} urlName
 * @returns {Promise<string>} url as a string
 */
const getSurveyUrl = async (urlName) => {
    // const result = 'http://localhost:19006/restaurant/1';
    const result = await sql`
        SELECT url FROM urls WHERE name = ${urlName};
    `;
    return result;
};

module.exports = {
    sql,
    insertUser,
    insertRestaurant,
    doesUsernameExist,
    getUser,
    getUserIdByEmail,
    getRestaurantIdByUserId,
    doesEmailExist,
    doesRestaurantExist,
    insertMeal,
    addMealImage,
    getMeals,
    isRestaurantUser,
    // doesRestaurantNameExist,
    getSurveyUrl,
    updateUserRestaurantByEmail
};
