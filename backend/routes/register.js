const express = require('express');
const {
    isValidUsername, isValidPassword, isValidEmail, isValidBirthYear
} = require(
    '../services/validators'
);
const { hash } = require('../services/hash');
const {
    insertUser, doesUsernameExist, doesEmailExist,
    doesRestaurantExist, insertRestaurant,
    updateUserRestaurantByEmail
} = require('../database');

const router = express.Router();

router.use(express.json());

router.post('/api/register', async (req, res) => {
    const {
        username, password, email,
        birthYear, gender, education,
        income, isRestaurant, restaurantName
    } = req.body;
    const currentYear = new Date().getFullYear();

    // validate inputs
    if (!isValidUsername(username)
        || !isValidPassword(password)
        || !isValidEmail(email)
        || !isValidBirthYear(Number(birthYear), currentYear)) {
        return res.status(400).json(
            { errorMessage: 'invalid username, password or email' }
        );
    }

    // check duplicate username and email
    try {
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

    // insert the user into database
    const passwordHash = hash(password);   // TODO: salt hashes
    try {
        await insertUser(
            username, passwordHash, email, birthYear,
            gender, education, income
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'user creation failed' });
    }

    if (isRestaurant && restaurantName) {
        try {
            if (await doesRestaurantExist(restaurantName)) {
                return res.status(400).json({
                    errorMessage: `restaurant ${restaurantName} already exists`
                });
            }
            const restaurantId = await insertRestaurant(restaurantName);
            await updateUserRestaurantByEmail(email, restaurantId);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                errorMessage: 'restaurant creation failed'
            });
        }
    }

    res.sendStatus(200);
});

module.exports = router;
