const express = require('express');
const router = express.Router();
const {
    setEvaluationMetric
} = require('../database.js');
const { verifyToken } = require('../services/authorization');

/**
 * Route for setting self evaluation
 * @param {Object} req - The request object.
 * @param {Object} req.body - object consisting of evaluation values.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Unauthorized.
 * @returns {Object} 500 - Database error.
 * @returns {Object} 200 - Success status.
 */
router.post('/api/evaluation/', express.json(), async (req, res) => {
    // ---- EVALUATION KEYS ----
    // importance of:
    // 1 - climate friendliness
    // 2 - nutritional value
    // SCALE 1-5
    const evaluationMetrics = [
        { key: 1, value: req.body.climateValue },
        { key: 2, value: req.body.nutritionValue }
    ];

    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).json('Unauthorized');
    }

    for (const { key, value } of evaluationMetrics) {
        const success = await setEvaluationMetric(userInfo.userId, key, value);
        if (!success) {
            return res.status(500).send('evaluation setting failed');
        }
    }
    res.sendStatus(200);
});

module.exports = router;