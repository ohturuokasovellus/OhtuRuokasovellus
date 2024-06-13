const express = require('express');
const { insertMeal, addMealImage, getMeals, getRestaurantIdByUserId,
    getMealRestaurantId, setMealInactive, getMealForEdit,
    updateMeal, sql }
    = require('../database');
const { verifyToken } = require('../services/authorization');
const { getNutrients }  = require('../services/calculateNutrients');

const router = express.Router();

/**
 * Route for adding meal.
 * @param {Object} req - The request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.mealName - Name of the meal.
 * @param {string} req.body.mealDescription
 * @param {string} req.body.mealAllergens
 * @param {Array<Dictionary>} req.body.ingredients - Ingredients in 
 * array format. The array contains dictionaries, the keys of which
 * are the id of the ingredient and ingredients mass in grams is the value
 * @param {Object} res - The response object.
 * @returns {Object} 400 - Invalid meal name
 * @returns {Object} 500 -  Meal insertion failed.
 */
router.post('/api/meals', express.json(), async (req, res) => {
    const {
        mealName, mealDescription, mealAllergenString,
        ingredients, formattedPrice
    } = req.body;
    // Token decoding from 
    // https://fullstackopen.com/en/part4/token_authentication
    const decodedToken = verifyToken(req.header('Authorization'));
        
    if (!decodedToken.userId) {
        return res.status(401).json({ error: 'token invalid' });
    }
    
    const loggedInUsersRestaurantId = await getRestaurantIdByUserId(
        decodedToken.userId);

    // TODO: properly validate name
    if (!mealName) {
        return res.status(400).send('invalid meal name');
    }
    
    else if (!loggedInUsersRestaurantId) {
        return res.status(400).send('You do not have permissions to add meals');
    }
    
    let mealIngredients = {};
    
    ingredients.forEach(element => {
        mealIngredients[element.ingredientId] = element.weight;
    });
    const nutrients = await getNutrients(mealIngredients, 
        'backend/csvFiles/raaka-ainetiedot.csv');

    let mealId;
    const stringifiedIngredients = JSON.stringify(ingredients);
    try {
        mealId = await insertMeal(mealName, loggedInUsersRestaurantId, 
            mealDescription, mealAllergenString, nutrients, formattedPrice,
            stringifiedIngredients);
    } catch (err) {
        console.error(err);
        return res.status(500).send('meal insertion failed');
    }
    res.json({ mealId });
});

/**
 * Route for adding meal image.
 * @param {Object} req - The request object.
 * @param {string} req.body - Image data.
 * @param {number} req.params.id - meal id.
 * @param {Object} res - The response object.
 * @returns {Object} 400 - Missing image.
 * @returns {Object} 404 - Meal not found.
 * @returns {Object} 500 -  Unexpected internal server error.
 * @returns {Object} 200 - Success status.
 */
router.post('/api/meals/images/:id',
    express.raw({ type: '*/*', limit: 1e7 }),
    async (req, res) => {
        const imageData = req.body;
        const mealId = req.params.id;

        // TODO: validate
        if (!imageData) {
            return res.status(400).send('missing image');
        }
        try {
            const success = await addMealImage(mealId, imageData);
            if (!success) {
                return res.status(404).send('meal not found');
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('unexpected internal server error');
        }

        res.sendStatus(200);
    }
);

/**
 * Route for fetching meal image uri.
 * @param {Object} req - The request object.
 * @param {number} req.params.id - meal id.
 * @param {Object} res - The response object.
 * @returns {Object} 404 - No image found.
 */
router.get('/api/meals/images/:id', async (req, res) => {
    const mealId = req.params.id;

    const result = await sql`
        SELECT image FROM meals WHERE meal_id = ${mealId};
    `;

    if (result.length === 0 || !result.at(0).image) {
        return res.status(404).send('no image found');
    }
    const imageData = result.at(0).image.toString();
    res.type('image/jpeg').send(imageData);
});

/**
 * Route for fetching restaurant specific meals.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 * @returns {Object} 404 - No meals/restaurant found.
 */
router.get('/api/meals/:restaurantId', async (req, res) => {
    const result = await getMeals(req.params.restaurantId);
    if (result.length === 0) {
        return res.status(404).json('Page not found');
    }
    res.json(result);
});

/**
 * Route for setting a meal to inactive.
 * @param {Object} req - The request object.
 * @param {number} req.params.mealId - meal id.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Unauthorized.
 * @returns {Object} 200 - Success status.
 */
router.put('/api/meals/delete/:mealId', express.json(), async (req, res) => {
    const mealId = req.params.mealId;
    const result = await getMealRestaurantId(mealId);
    const userInfo = verifyToken(req.header('Authorization'));

    if (!userInfo || userInfo.restaurantId !== result.restaurant_id) {
        return res.status(401).send('Unauthorized');
    }
    
    const setToInactive = await setMealInactive(mealId);
    if (!setToInactive) {
        return res.status(500).json({ errorMessage: 'Meal deletion failed' });
    }

    res.status(200).json('Meal deleted');
});

/**
 * Route for fetching a meal for editing
 * Used POST to add authorization token
 * @param {Object} req - The request object.
 * @param {number} req.params.mealId - meal id.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Unauthorized.
 * @returns {Object} 200 - Success status.
 */
router.post('/api/meals/meal/:mealId', express.json(), async (req, res) => {
    const mealId = req.params.mealId;
    const userInfo = verifyToken(req.header('Authorization'));
    const result = await getMealRestaurantId(mealId);
    
    if (!userInfo || userInfo.restaurantId !== result.restaurant_id) {
        return res.status(401).json('Unauthorized');
    }

    let meal = await getMealForEdit(mealId);
    const parsedIngredients = JSON.parse(meal.ingredients);
    meal = {
        ...meal,
        ingredients: parsedIngredients
    };
    res.status(200).json(meal);
});

/**
 * Route for updating a meal
 * @param {Object} req - The request object.
 * @param {number} req.params.mealId - meal id.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Unauthorized.
 * @returns {Object} 200 - Success status.
 */
router.put('/api/meals/update/:mealId', express.json(), async (req, res) => {
    const {
        mealName, mealDescription, mealAllergenString,
        ingredients, formattedPrice
    } = req.body;
    const mealId = req.params.mealId;
    const userInfo = verifyToken(req.header('Authorization'));
    const mealRestId = await getMealRestaurantId(mealId);

    if (!userInfo || userInfo.restaurantId !== mealRestId.restaurant_id) {
        return res.status(401).json('Unauthorized');
    }
    
    let mealIngredients = {};
    
    ingredients.forEach(element => {
        mealIngredients[element.ingredientId] = element.weight;
    });

    const nutrients = await getNutrients(mealIngredients, 
        'backend/csvFiles/raaka-ainetiedot.csv');

    const stringifiedIngredients = JSON.stringify(ingredients);
    const success = await updateMeal(mealId, mealName, mealDescription,
        mealAllergenString, nutrients, formattedPrice, stringifiedIngredients);
    
    if (!success) {
        return res.status(500).send('meal update failed');
    }
    res.sendStatus(200);
});

module.exports = router;
