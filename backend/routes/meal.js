const express = require('express');
const { insertMeal, addMealImage, getMeals, getRestaurantIdByUserId,
    getMealRestaurantId, setMealInactive, getMealImage,
    getMealIdsNamesPurchaseCodes, getMealForEdit }
    = require('../database');
const { updateMeal } = require('../databaseUtils/meal.js');
const { verifyToken } = require('../services/authorization');
const { getNutrients } = require('../services/calculateNutrients');
const { getAllMealEmissions } = require('../databaseUtils/meal');

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
    
    let loggedInUsersRestaurantId = null;
    try{
        loggedInUsersRestaurantId = await getRestaurantIdByUserId(
            decodedToken.userId);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }

    // TODO: properly validate name
    if (!mealName) {
        return res.status(400).send('invalid meal name');
    }

    if (ingredients.length > 20) {
        return res.status(400).send('too many ingredients');
    }

    if (!loggedInUsersRestaurantId) {
        return res.status(400).send('You do not have permissions to add meals');
    }

    let mealIngredients = {};
    
    ingredients.forEach(element => {
        mealIngredients[element.ingredientId] = element.weight;
    });
    
    let mealId;
    try {
        const nutrients = await getNutrients(mealIngredients, 
            'backend/csvFiles/raaka-ainetiedot.csv');
        if (!nutrients){
            return res.status(500).send('unexpected internal server error');
        }
        const stringifiedIngredients = JSON.stringify(ingredients);

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

    try{
        const imageData = await getMealImage(mealId);
        if (!imageData) {
            return res.status(404).send('no image found');
        }
        res.type('image/jpeg').send(imageData);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
});

/**
 * Route for fetching restaurant specific meals.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/meals/:restaurantId', async (req, res) => {
    try {
        const result = await getMeals(req.params.restaurantId);
        res.json(result);
    } catch (error){
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
});

/**
 * Route for fetching restaurant specific meals.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/less-info-meals/:restaurantId', async (req, res) => {
    try {
        const result = await getMealIdsNamesPurchaseCodes(
            req.params.restaurantId);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
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

    try {
        const result = await getMealRestaurantId(mealId);
        const userInfo = verifyToken(req.header('Authorization'));

        if (!userInfo || userInfo.restaurantId !== result.restaurant_id) {
            return res.status(401).send('Unauthorized');
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

    try {
        const setToInactive = await setMealInactive(mealId);
        if (!setToInactive) {
            return res.status(500).json(
                { errorMessage: 'Meal deletion failed' });
        }
        res.status(200).json('Meal deleted');
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
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

    try {
        const result = await getMealRestaurantId(mealId);
        if (!userInfo || userInfo.restaurantId !== result.restaurant_id) {
            return res.status(401).json('Unauthorized');
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

    try {
        let meal = await getMealForEdit(mealId);
        const parsedIngredients = JSON.parse(meal.ingredients);
        meal = {
            ...meal,
            ingredients: parsedIngredients
        };
        res.status(200).json(meal);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
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

    try {
        const mealRestId = await getMealRestaurantId(mealId);
        if (!userInfo || userInfo.restaurantId !== mealRestId.restaurant_id) {
            return res.status(401).json('Unauthorized');
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

    let mealIngredients = {};
    
    ingredients.forEach(element => {
        mealIngredients[element.ingredientId] = element.weight;
    });

    try {
        const nutrients = await getNutrients(mealIngredients, 
            'backend/csvFiles/raaka-ainetiedot.csv');
        if (!nutrients){
            return res.status(500).send('unexpected internal server error');
        }

        const stringifiedIngredients = JSON.stringify(ingredients);
        const success = await updateMeal(mealId, mealName, mealDescription,
            mealAllergenString, nutrients, formattedPrice, 
            stringifiedIngredients);
        if (!success) {
            return res.status(500).send('meal update failed');
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
});

/**
 * Route for fetching emissions of all meals.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/all-meal-emissions/', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).send('unauthorized');
    }

    try {
        const result = await getAllMealEmissions();
        res.json({emissions: result, restaurantId: userInfo.restaurantId});
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

});

module.exports = router;
