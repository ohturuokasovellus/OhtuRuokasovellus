const { sql } = require('../database');

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
 * Fetch all meal emissions from database.
 * @param {number} restaurantId
 * @returns {Promise<{ 
*      restaurant_id: number, 
*      co2_emissions: string
*  }[]>}
*/
const getAllMealEmissions = async () => {
    const result = await sql`
       SELECT restaurant_id, co2_emissions
       FROM meals
       WHERE is_active = TRUE;
   `;
    return result;
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
 * Get restaurantId of the meal.
 * @param {number} mealId
 * @returns {Promise<Number>} restaurant_id
 */
const getMealsRestaurantId = async (mealId) => {
    const result = await sql`
        SELECT restaurant_id FROM meals where meal_id = ${mealId}
    `;
    return result.at(0);
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

module.exports = {
    addMealImage,
    getAllMealEmissions,
    getMealByPurchaseCode,
    getMealForEdit,
    getMealIdsNamesPurchaseCodes,
    getMealImage,
    getMeals,
    getMealsRestaurantId,
    setMealInactive,
    updateMeal
};