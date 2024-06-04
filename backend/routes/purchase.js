const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

router.post('/api/purchases', async (req, res) => {
    // authorize user
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET_KEY);
    if (!decodedToken.userId) {
        return res.status(401).send('unauthorized');
    }

    // TODO: get meal id from body

    // TODO: insert to database

    res.sendStatus(200);
});

module.exports = router;
