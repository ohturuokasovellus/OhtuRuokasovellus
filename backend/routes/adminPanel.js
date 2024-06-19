const express = require('express');
const {
    getRestaurants, getRestaurantUsers
} = require('../database');
const { verifyToken } = require('../services/authorization');

const router = express.Router();

/**
 * Route for fetching restaurants to admin panel
 * @param {Object} req - The request object.
 * @param {number} req.params.purchaseCode - The purchase code of the meal.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - unauthorized.
 * @returns {Object} 200 - success status.
 */
router.get('/api/restaurants', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo || !userInfo.isAdmin) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await getRestaurants();
        res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
});

/**
 * Route for fetching users of restaurant
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId
 * @param {Object} res - The response object.
 * @returns {Object} 401 - unauthorized.
 * @returns {Object} 200 - success status.
 */
router.get('/api/restaurant/:restaurantId/users', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo || !userInfo.isAdmin) {
        return res.status(401).send('Unauthorized');
    }
    const restaurantId = req.params.restaurantId;

    if (restaurantId) {
        try {
            const result = await getRestaurantUsers(restaurantId);
            res.json(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('unexpected internal server error');
        }
    } else {
        return res.status(400).send('invalid restaurant id');
    }
});

module.exports = router;
