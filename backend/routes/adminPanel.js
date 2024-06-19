const express = require('express');
const {
    getRestaurants,
} = require('../database');
const { verifyToken } = require('../services/authorization');

const router = express.Router();

/**
 * Route for fetching restaurants to admin panel
 * @param {Object} req - The request object.
 * @param {number} req.params.purchaseCode - The purchase code of the meal.
 * @param {Object} res - The response object.
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

module.exports = router;
