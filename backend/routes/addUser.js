const express = require('express');
const { isValidEmail } = require(
    '../../src/utils/validators.js'
);
const { doesEmailExist, updateUserRestaurantByEmail} = require(
    '../database.js'
);

const router = express.Router();

router.post('/api/add-users', async (req, res) => {
    const { emails, restaurantID } = req.body;
    for (const email of emails) {
        if (!isValidEmail(email)) {
            return res.status(400).json({ errorMessage: 'invalid email' });
        }

        try {
            if (!(await doesEmailExist(email))) {
                throw new Error(`email ${email} does not exist.`);
            }
        } catch (err) {
            console.error(err);
            return res.status(400).json({ errorMessage: err.message });
        }

        try {
            await updateUserRestaurantByEmail(email, restaurantID);
        } catch (err) {
            console.error(err);
            return res.status(500).json(
                { errorMessage: `failed to update user with email ${email}`
                });
        }
    }

    res.sendStatus(200);
});

module.exports = router;
