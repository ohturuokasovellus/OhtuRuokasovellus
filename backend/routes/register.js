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
            { errorMessage: 'invalid username, password, email or birth year' }
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

    const passwordHash = hash(password);   // TODO: salt hashes
    let restaurantId;

    // took try call from here
    if (isRestaurant && restaurantName) {
        try {
            if (await doesRestaurantExist(restaurantName)) {
                return res.status(400).json({
                    errorMessage:
                    `restaurant ${restaurantName} already exists`
                });
            }
            restaurantId = await insertRestaurant(restaurantName);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                errorMessage: 'restaurant creation failed'
            });
        }
    }
    try { // placed the try call here, I can revert this if there was a
        // reason to have the try call earlier, but I think its cleaner here
        await insertUser(
            username, passwordHash, email, birthYear,
            gender, education, income
        );

        if (restaurantId) {
            try {
                await updateUserRestaurantByEmail(email, restaurantId);
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    errorMessage: 'restaurant association failed'
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'user creation failed' });
    }

    res.sendStatus(200);
});

module.exports = router;
