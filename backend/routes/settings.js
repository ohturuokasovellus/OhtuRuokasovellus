const express = require('express');
const { verifyToken } = require('../services/authorization');
const {
    checkPassword, deleteUser, setEvaluationMetric, sql
} = require('../database');
const { hash } = require('../services/hash');

const router = express.Router();

router.get('/api/export-user-data', async (req, res) => {
    const decodedToken = verifyToken(req.header('Authorization'));
    if (!decodedToken) {
        return res.status(401).send('unauthorized');
    }

    let purchases, userInfo, evaluations;
    try {
        purchases = await sql`
            SELECT p.purchased_at, m.name AS meal_name
            FROM purchases AS p, meals AS m
            WHERE p.meal_id = m.meal_id AND p.user_id = ${decodedToken.userId};
        `;
        userInfo = await sql`
            SELECT
                pgp_sym_decrypt(username::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS username,
                pgp_sym_decrypt(email::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS email,
                pgp_sym_decrypt(birth_year::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS birth_year,
                pgp_sym_decrypt(gender::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS gender,
                pgp_sym_decrypt(education::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS education,
                pgp_sym_decrypt(income::bytea,
                ${process.env.DATABASE_ENCRYPTION_KEY}) AS income
            FROM users
            WHERE user_id = ${decodedToken.userId};
        `;
        evaluations = await sql`
            SELECT eval_key, eval_value
            FROM evaluations
            WHERE user_id = ${decodedToken.userId};
        `;
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }

    if (userInfo.length !== 1) {
        return res.status(400).send('user not found');
    }

    let humanReadableEvaluations = {}
    for (let row of evaluations) {
        if (row.eval_key == 1) {
            humanReadableEvaluations['climate'] = row.eval_value;
        } else if (row.eval_key == 2) {
            humanReadableEvaluations['nutrition'] = row.eval_value;
        }
    }

    res.json({
        userInfo: userInfo[0],
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
