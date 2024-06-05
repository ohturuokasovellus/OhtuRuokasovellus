const express = require('express');
const { insertMeal, addMealImage, getMeals, getRestaurantIdByUserId,
    sql } = require('../database');
const jwt = require('jsonwebtoken');
const {getNutrients}  = require('../services/calculateNutrients');

const router = express.Router();

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

/**
 * Route for adding meal.
 * @param {Object} req - The request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.mealName - Name of the meal.
 * @param {string} req.body.mealDescription
 * @param {string} req.body.mealAllergens
 * @param {Dictionary} req.body.ingredients - Ingredients in dictionary format,
 * where the id of the ingredient is the key and ingredients
 * mass in grams is the value
 * @param {Object} res - The response object.
 * @returns {Object} 400 - Invalid meal name
 * @returns {Object} 500 -  Meal insertion failed.
 */
router.post('/api/meals', express.json(), async (req, res) => {
    const { mealName, mealDescription, mealAllergens, ingredients } = req.body;

    // Token decoding from 
    // https://fullstackopen.com/en/part4/token_authentication
    const decodedToken = jwt.verify(getTokenFrom(req), 
        process.env.SECRET_KEY);

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

    const nutrients = getNutrients(ingredients, 
        'backend/csvFiles/raaka-ainetiedot.csv');

    let mealId;
    try {
        mealId = await insertMeal(mealName, loggedInUsersRestaurantId, 
            mealDescription, mealAllergens, nutrients);
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
    });

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

module.exports = router;
