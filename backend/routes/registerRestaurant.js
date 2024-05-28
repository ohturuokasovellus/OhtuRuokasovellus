const express = require('express');
const { isValidUsername, isValidPassword, isValidEmail } = require(
    '../../src/utils/validators.js'
);
const { hash } = require('../services/hash.js');
const {
    insertUser,
    insertRestaurant,
    doesUsernameExist,
    doesEmailExist,
    doesRestaurantExist
} = require('../database.js');

const router = express.Router();

/**
 * Route for registering a new restaurant along with a user account.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 400 - Invalid input or user/restaurant already exists.
 * @returns {Object} 500 - Server error during user or restaurant creation.
 */

router.post('/api/register-restaurant', async (req, res) => {
    const { username, password, email, restaurantName } = req.body;

    if (!isValidUsername(username)
        || !isValidPassword(password)
        || !isValidEmail(email)
        || !restaurantName) {
        return res.status(400).json({
            errorMessage:
            'invalid username, password, email, or restaurant name'
        });
    }

    try {
        if (await doesRestaurantExist(restaurantName)) {
            return res.status(400).json(
                { errorMessage: 'restaurant already exists' }
            );
        }
        if (await doesUsernameExist(username)) {
            return res.status(400).json(
                { errorMessage: 'username already exists' }
            );
        }
        if (await doesEmailExist(email)) {
            return res.status(400).json(
                { errorMessage: 'email already exists' }
            );
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'user creation failed' });
    }

    const passwordHash = hash(password);   // TODO: salt hashes
    try {
        const restaurantId = await insertRestaurant(restaurantName);
        await insertUser(username, passwordHash, email, restaurantId);
    } catch (err) {
        console.error(err);
        return res.status(500).json(
            { errorMessage: 'restaurant creation failed' }
        );
    }

    res.sendStatus(200);
});

module.exports = router;
