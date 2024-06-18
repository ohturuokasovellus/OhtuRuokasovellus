const express = require('express');
const router = express.Router();
const { getRestaurantName } = require('../databaseScripts/restaurant');

/**
 * Route for fetching restaurant name.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/restaurant-name/:restaurantId', async (req, res) => {
    try {
        const result = await getRestaurantName(req.params.restaurantId);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

});

module.exports = router;
