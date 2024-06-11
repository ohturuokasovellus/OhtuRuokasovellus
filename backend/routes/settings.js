const express = require('express');
const { verifyToken } = require('../services/authorization');
const { checkPassword, deleteUser } = require('../database');

const router = express.Router();

router.post('/api/remove-account', async (req, res) => {
    const { password } = req.body;
    const decodedToken = verifyToken(req.header('Authorization'));

    if (!decodedToken || !password) {
        return res.status(401).json({ error: 'unauthorized' });
    }

    if (!(await checkPassword(decodedToken.userId, password))) {
        return res.status(401).json({ error: 'incorrect password' });
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
