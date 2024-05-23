const jwt = require('jsonwebtoken');
const express = require('express');
const { hash } = require('../services/hash');
const router = express.Router();
const { getUser } = require('../database');

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUser(username, hash(password));
    if (user) {
        const token = jwt.sign(
            { username: user.username, userId: user.user_id },
            process.env.SECRET_KEY
        );
        res
            .status(200)
            .send(
                {
                    token,
                    username: user.username,
                    restaurantId: user.restaurant_id,
                    message: 'Login succesful'
                }
            );
    } else {
        res
            .status(404)
            .json({ error: 'Invalid username or password' });
    }
});

module.exports = router;
