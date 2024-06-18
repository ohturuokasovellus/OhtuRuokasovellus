const express = require('express');
const { verifyToken } = require('../services/authorization');
const { checkPassword, deleteUser } = require('../database');
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

module.exports = router;
