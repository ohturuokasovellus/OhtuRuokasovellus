const express = require('express');
const { isValidUsername, isValidPassword, isValidEmail } = require(
    '../../src/utils/validators.js'
);
const { hash } = require('../services/hash.js');
const {
    insertUser, insertRestaurant, doesUsernameExist, doesEmailExist
} = require('../database.js');

const router = express.Router();

router.post('/api/RestaurantRegistration', async (req, res) => {
    const { username, password, email, restaurantName } = req.body;

    if (!isValidUsername(username)
        || !isValidPassword(password)
        || !isValidEmail(email)
        || !restaurantName) {
        return res.status(400).json({
            errorMessage:
            'Invalid username, password, email, or restaurant name'
        });
    }

    try {
        if (await doesUsernameExist(username)) {
            return res.status(400).json(
                { errorMessage: 'Username already exists' }
            );
        }
        if (await doesEmailExist(email)) {
            return res.status(400).json(
                { errorMessage: 'Email already exists' }
            );
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'User creation failed' });
    }

    const passwordHash = hash(password);   // TODO: salt hashes
    try {
        const restaurantId = await insertRestaurant(restaurantName);
        await insertUser(username, passwordHash, email, restaurantId);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'User creation failed' });
    }

    res.sendStatus(200);
});

module.exports = router;
