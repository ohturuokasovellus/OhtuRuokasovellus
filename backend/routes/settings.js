const express = require('express');
const { verifyToken } = require('../services/authorization');
const { checkPassword, deleteUser, sql } = require('../database');
const { hash } = require('../services/hash');

const router = express.Router();

router.get('/api/export-user-data', async (req, res) => {
    const decodedToken = verifyToken(req.header('Authorization'));
    if (!decodedToken) {
        return res.status(401).send('unauthorized');
    }

    let purchases, userInfo;
    try {
        purchases = await sql`
            SELECT p.purchased_at, m.name AS meal_name
            FROM purchases AS p, meals AS m
            WHERE p.meal_id = m.meal_id AND p.user_id = ${decodedToken.userId};
        `;
        userInfo = await sql`
            SELECT username, email, birth_year, gender, education, income
            FROM users
            WHERE user_id = ${decodedToken.userId};
        `;
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }

    if (userInfo.length !== 1) {
        return res.status(400).send('user not found');
    }

    res.json({
        userInfo: userInfo[0],
        purchases,
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

module.exports = router;
