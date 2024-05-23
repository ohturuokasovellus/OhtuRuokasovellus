const express = require('express');
const { isValidEmail } = require(
    '../../src/utils/validators.js'
);
const { hash } = require('../services/hash');
const { doesEmailExist, updateUserRestaurantByEmail} = require(
    '../database'
);

const router = express.Router();

router.post('/api/add-users', async (req, res) => {
    const { emails, restaurantID } = req.body;

    // validate inputs
    if (!isValidEmail(emails)) {
        return res.status(400).json({ errorMessage: 'Invalid email' });
    }

    // check duplicate username and email
    try {
        if (!(await doesEmailExist(emails))) {
            throw new Error("Email does not exist."); // Throw an error if email does not exist
        }
        // Proceed with user creation
    } catch (err) {
        console.error(err);
        return res.status(400).json({ errorMessage: err.message });
    }

    // insert the user into database
    try {
        await Promise.all(emails.map(email => updateUserRestaurantByEmail(email, restaurantID)))
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'add user failed' });
    }

    res.sendStatus(200);
});

module.exports = router;
