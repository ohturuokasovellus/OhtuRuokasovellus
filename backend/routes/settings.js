const express = require('express');
const { verifyToken } = require('../services/authorization');
const { getEvaluations,
    setEvaluationMetric } = require('../databaseUtils/evaluations.js');
const { getPurchases } = require('../databaseUtils/purchase.js');
const { checkPassword, getUserInfo, 
    deleteUser } = require('../databaseUtils/user');
const { hash } = require('../services/hash');

const router = express.Router();

router.get('/api/export-user-data', async (req, res) => {
    const decodedToken = verifyToken(req.header('Authorization'));
    if (!decodedToken) {
        return res.status(401).send('unauthorized');
    }

    let purchases, userInfo, evaluations;
    try {
        userInfo = await getUserInfo(decodedToken.userId);
        purchases = await getPurchases(decodedToken.userId);
        evaluations = await getEvaluations(decodedToken.userId);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }

    if (!userInfo) {
        return res.status(400).send('user not found');
    }

    purchases = purchases.map(purchase => ({
        date: purchase.date,
        meal: purchase.mealName,
    }));

    let humanReadableEvaluations = {};
    for (let row of evaluations) {
        if (row.eval_key == 1) {
            humanReadableEvaluations['climate'] = row.eval_value;
        } else if (row.eval_key == 2) {
            humanReadableEvaluations['nutrition'] = row.eval_value;
        }
    }

    res.json({
        userInfo,
        purchases,
        selfEvaluations: humanReadableEvaluations,
    });
});

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
