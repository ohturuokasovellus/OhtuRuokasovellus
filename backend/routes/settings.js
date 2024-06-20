const express = require('express');
const { verifyToken } = require('../services/authorization');
const { checkPassword, deleteUser, setEvaluationMetric }
    = require('../database');
const { hash } = require('../services/hash');

const router = express.Router();

router.post('/api/remove-account', express.json(), async (req, res) => {
    const { password } = req.body;
    const decodedToken = verifyToken(req.header('Authorization'));

    if (!decodedToken || !password) {
        return res.status(401).json({ error: 'unauthorized' });
    }

    try {
        if (!(await checkPassword(decodedToken.userId, hash(password)))) {
            return res.status(401).json({ error: 'incorrect password' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: 'user creation failed' });
    }

    try {
        await deleteUser(decodedToken.userId);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal server error' });
    }

    res.sendStatus(200);
});

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
