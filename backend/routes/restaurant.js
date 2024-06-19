const express = require('express');
const router = express.Router();
const { getRestaurantName } = require('../utils/restaurant');
const { verifyToken } = require('../services/authorization');

/**
 * Route for fetching restaurant name.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/restaurant-name/', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).send('unauthorized');
    }
    try {
        const result = await getRestaurantName(userInfo.restaurantId);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

});

module.exports = router;
