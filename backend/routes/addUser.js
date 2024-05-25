const express = require('express');
const router = express.Router();
const { isValidEmail } = require(
    '../../src/utils/validators.js'
);
const {
    doesEmailExist,
    updateUserRestaurantByEmail,
    getUser
} = require('../database.js');
const { hash } = require('../services/hash');

router.use(express.json());

router.post('/api/add-users', async (req, res) => {
    const { emails, restaurantId, username, password } = req.body;
    const user = await getUser(username, hash(password));
    if (!user) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    for (const email of emails) {
        if (!isValidEmail(email)) {
            return res.status(400).json({ errorMessage: 'Invalid email' });
        }

        try {
            if (!(await doesEmailExist(email))) {
                throw new Error(`Email ${email} does not exist.`);
            }
        } catch (err) {
            console.error(err);
            return res.status(400).json({ errorMessage: err.message });
        }

        try {
            await updateUserRestaurantByEmail(email, restaurantId);
        } catch (err) {
            console.error(err);
            return res.status(500)
                .json({
                    errorMessage: `Failed to update user with email ${email}`
                });
        }
    }

    res.sendStatus(200);
});

module.exports = router;
