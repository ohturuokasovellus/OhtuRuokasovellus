require('dotenv').config();
const postgres = require('postgres');
const { compareHashes } = require('./services/hash');
const { generatePurchaseCode } = require('./services/random');

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
            password, restaurant_id FROM users
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
 * Insert a new meal to the database.
 * @param {string} name Name of the meal.
 * @param {number} restaurantId Id of the restaurant who created the meal.
 * @param {string} mealDescription 
 * @param {number} co2Emissions CO2 emissions of the meal.
 * @param {string} mealAllergens Allergens of the meal.
 * @param {Dictionary} nutrientDictionary Nutrients of a meal in a dictionary
 * @param {string} ingredients ingredient list in json
 * @returns {Promise<number>} ID of the created meal.
 */
const insertMeal = async (name, restaurantId, mealDescription, 
    mealAllergens, nutrientDictionary, price, ingredients) => {
    const co2Emissions = nutrientDictionary['co2Emissions'];
    const carbohydrates = nutrientDictionary['carbohydrates'];
    const protein = nutrientDictionary['protein'];
    const fat = nutrientDictionary['fat'];
    const fiber = nutrientDictionary['fiber'];
    const sugar = nutrientDictionary['sugar'];
    const salt = nutrientDictionary['salt'];
    const saturatedFat = nutrientDictionary['saturatedFat'];
    const energy = nutrientDictionary['energy'];

    const vegetablePercent = Math.floor(nutrientDictionary['vegetablePercent']);

    const purchaseCode = generatePurchaseCode();

    const result = await sql`
        INSERT INTO meals (name, restaurant_id, purchase_code, meal_description,
            ingredients, co2_emissions, meal_allergens, carbohydrates, protein,
            fat, fiber, sugar, salt, saturated_fat, energy, vegetable_percent,
            price)
        VALUES (${name}, ${restaurantId}, ${purchaseCode}, ${mealDescription},
            ${ingredients}, ${co2Emissions}, ${mealAllergens}, ${carbohydrates},
            ${protein}, ${fat}, ${fiber}, ${sugar}, ${salt}, ${saturatedFat},
            ${energy}, ${vegetablePercent}, ${price})
            RETURNING meal_id;`;

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
 * Get the image data of a meal.
 * @param {number} mealId
 * @returns {Promise<string?>} Image data
 */
const getMealImage = async mealId => {
    const result = await sql`
        SELECT image FROM meals WHERE meal_id = ${mealId} AND is_active = TRUE;
    `;
    if (result.length !== 1 || result[0].image === null) {
        return null;
    }
    return result[0].image.toString();
};

/**
 * Fetch restaurant specific meals from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      meal_id: number, 
*      meal_name: string, 
*      image: string, 
*      restaurant_name: string,
*      meal_description: string,
*      co2_emissions: number,
*      meal_allergens: string,
*      carbohydrates: number,
*      protein: number,
*      fat: number,
*      fiber: number,
*      sugar: number,
*      salt: number,
*      saturated_fat: number,
*      energy: number,
*      vegetable_percent: number,
*      price: number,
*  }[]>}
*/
const getMeals = async (restaurantId) => {
    const result = await sql`
       SELECT m.meal_id, m.name as meal_name, m.meal_description, 
       m.co2_emissions, m.meal_allergens, m.carbohydrates, m.protein, m.fat,
       m.fiber, m.sugar, m.salt, m.saturated_fat, m.energy, m.vegetable_percent,
       m.price,
       CASE 
           WHEN r.restaurant_id IS NOT NULL THEN r.name 
           ELSE NULL 
       END as restaurant_name 
       FROM meals m
       LEFT JOIN restaurants r ON m.restaurant_id = r.restaurant_id
       WHERE m.restaurant_id = ${restaurantId} AND m.is_active = TRUE;
   `;
    return result;
};

/**
 * Fetch restaurant specific meals from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      meal_id: number, 
*      meal_name: string, 
*      purchase_code: string,
*  }[]>}
*/
const getMealIdsNamesPurchaseCodes = async (restaurantId) => {
    const result = await sql`
       SELECT meal_id, name as meal_name, purchase_code
       FROM meals
       WHERE restaurant_id = ${restaurantId} AND is_active = TRUE;
   `;
    return result;
};

/**
 * Fetch a single meal by its ID.
 * @param {number} mealId The ID of the meal.
 * @returns {Promise<{ name: string }?>} The meal information.
 */
const getMeal = async mealId => {
    const result = await sql`
        SELECT name FROM meals WHERE meal_id = ${mealId};
    `;
    if (result.length === 0) {
        return null;
    }
    return result.at(0);
};

/**
 * Fetch a single meal by its purchase code.
 * @param {number} purchaseCode The purchase code of the meal.
 * @returns {Promise<{ mealId: number, name: string }?>} The meal information.
 */
const getMealByPurchaseCode = async purchaseCode => {
    const result = await sql`
        SELECT meal_id, name, meal_description
        FROM meals WHERE purchase_code = ${purchaseCode} AND is_active = TRUE;
    `;
    if (result.length === 0) {
        return null;
    }
    return {
        mealId: result[0].meal_id,
        name: result[0].name,
        description: result[0].meal_description,
    };
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
 * @param {string} urlName
 * @returns {Promise<string>} url as a string
 */
const getSurveyUrl = async (urlName) => {
    const result = await sql`
        SELECT url FROM urls WHERE name = ${urlName};
    `;
    return result;
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
 * Get restaurantId of the meal.
 * @param {number} mealId
 * @returns {Promise<Number>} restaurant_id
 */
const getMealRestaurantId = async (mealId) => {
    const result = await sql`
        SELECT restaurant_id FROM meals where meal_id = ${mealId}
    `;
    return result.at(0);
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
 * Set meal to inactive.
 * @param {number} mealId
 * @returns {Promise<Boolean>} true if success
 */
const setMealInactive = async (mealId) => {
    const result = await sql`
        UPDATE meals SET is_active = FALSE WHERE meal_id = ${mealId}
    `;
    return result.count === 1;
};

/**
 * Get meal for editing
 * @param {number} mealId
 * @returns {Promise<{ mealId: number, name: string }
 * >} true if success
 */
const getMealForEdit = async (mealId) => {
    const result = await sql`
        SELECT name, meal_description, meal_allergens, price, ingredients
        FROM meals WHERE meal_id = ${mealId}
    `;
    return result.at(0);
};

/**
 * Query for updating existing meal.
 * @param {number} mealId
 * @param {string} name Name of the meal.
 * @param {number} restaurantId Id of the restaurant who created the meal.
 * @param {string} mealDescription 
 * @param {number} co2Emissions CO2 emissions of the meal.
 * @param {string} mealAllergens Allergens of the meal.
 * @param {Dictionary} nutrientDictionary Nutrients of a meal in a dictionary
 * @param {string} ingredients ingredient list in json
 * @returns {Promise<Boolean>} true if success
 */
const updateMeal = async (mealId, name, mealDescription, 
    mealAllergens, nutrientDictionary, price, ingredients) => {
    const co2Emissions = nutrientDictionary['co2Emissions'];
    const carbohydrates = nutrientDictionary['carbohydrates'];
    const protein = nutrientDictionary['protein'];
    const fat = nutrientDictionary['fat'];
    const fiber = nutrientDictionary['fiber'];
    const sugar = nutrientDictionary['sugar'];
    const salt = nutrientDictionary['salt'];
    const saturatedFat = nutrientDictionary['saturatedFat'];
    const energy = nutrientDictionary['energy'];

    const vegetablePercent = Math.floor(nutrientDictionary['vegetablePercent']);

    const result = await sql`
        UPDATE meals set name = ${name}, meal_description = ${mealDescription},
            ingredients = ${ingredients}, co2_emissions = ${co2Emissions},
            meal_allergens = ${mealAllergens}, carbohydrates = ${carbohydrates},
            protein = ${protein}, fat = ${fat}, fiber = ${fiber},
            sugar = ${sugar}, salt = ${salt}, saturated_fat =  ${saturatedFat},
            energy = ${energy}, vegetable_percent = ${vegetablePercent},
            price = ${price}
            WHERE meal_id = ${mealId}
        ;`;

    return result.count === 1;
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
    doesUsernameExist,
    getUser,
    checkPassword,
    getUserInfo,
    getUserIdByEmail,
    getRestaurantIdByUserId,
    doesEmailExist,
    deleteUser,
    doesRestaurantExist,
    insertMeal,
    addMealImage,
    getMealImage,
    getMeals,
    getMeal,
    getMealByPurchaseCode,
    isRestaurantUser,
    getSurveyUrl,
    updateUserRestaurantByEmail,
    addPurchase,
    getMealRestaurantId,
    getPurchases,
    setMealInactive,
    getMealForEdit,
    updateMeal,
    getMealIdsNamesPurchaseCodes,
    setEvaluationMetric,
    getEvaluations,
};
