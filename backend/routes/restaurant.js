const express = require('express');
const { getMealEmissionsWithId } = require('../databaseScripts/meal');
const router = express.Router();

/**
 * Route for fetching emissions of restaurant specific meals.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/meal-emissions-with-id/:restaurantId', async (req, res) => {
    try {
        const result = await getMealEmissionsWithId(req.params.restaurantId);
        res.json(result);
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
router.get('/api/all-meal-emissions/:restaurantId', async (req, res) => {
    try {
        const result = await getMealEmissionsWithId(req.params.restaurantId);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

});

module.exports = router;
