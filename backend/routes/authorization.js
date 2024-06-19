const express = require('express');
const router = express.Router();
router.use(express.json());
const { verifyToken } = require('../services/authorization');

/**
 * Route for requesting restaurantId.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 404 - Url not found.
 */
router.get('/api/getRestaurantId', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).send('unauthorized');
    }

    res.json({ restaurantId: userInfo.restaurantId });
});

module.exports = router;