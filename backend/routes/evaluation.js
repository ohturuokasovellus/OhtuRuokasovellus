const express = require('express');
const router = express.Router();
const {
    setEvaluationMetric
} = require('../database.js');
const { verifyToken } = require('../services/authorization');

/**
 * Route for setting self evaluation
 * @param {Object} req - The request object.
 * @param {number} req.body - object consisting of climate value
 * and nutrition value.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Unauthorized.
 * @returns {Object} 500 - Database error.
 * @returns {Object} 200 - Success status.
 */
router.post('/api/evaluation/', express.json(), async (req, res) => {
    const {
        climateValue, nutritionValue
    } = req.body;
    console.log(climateValue, nutritionValue);

    const userInfo = verifyToken(req.header('Authorization'));

    if (!userInfo) {
        return res.status(401).json('Unauthorized');
    }

    // ---- EVALUATION KEYS ----
    // importance of:
    // 1 - climate friendliness
    // 2 - nutritional value
    // SCALE 1-5
    const success = await setEvaluationMetric();
    if (!success) {
        return res.status(500).send('evaluation setting failed');
    }
    res.sendStatus(200);
});

module.exports = router;