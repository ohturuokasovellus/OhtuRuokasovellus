const express = require('express');
const router = express.Router();
const {
    doesEmailExist,
    updateUserRestaurantByEmail,
    getUser,
    getUserIdByEmail,
    isRestaurantUser
} = require('../database.js');
const { hash } = require('../services/hash');

router.use(express.json());

/**
 * Handles the addition of users to a restaurant.
 * @param {Object} req
 * @param {Object} req.body
 * @param {string[]} req.body.emails - array of emails to be added
 * @param {number} req.body.restaurantId - restaurant to which users are added
 * @param {string} req.body.username - the username of current user
 * @param {string} req.body.password - the password of current user
 * @param {Object} res - the response object
 * @returns {Object} - JSON object containing results for each email
 */

router.post('/api/add-users', async (req, res) => {
    const { emails, restaurantId, username, password } = req.body;
    const user = await getUser(username, hash(password));
    if (!user) {
        return res.status(401).json({ error: 'invalid password' });
    }

    const results = emails.map(email => ({ email, status: 'pending' }));

    for (const result of results) {
        const { email } = result;
        try {
            if (!(await doesEmailExist(email))) {
                result.status = 'email does not exist';
                continue;
            }
        } catch (err) {
            console.error(err);
            result.status = 'error checking email existence';
            continue;
        }

        const userId = await getUserIdByEmail(email);
        if (await isRestaurantUser(userId)) {
            result.status = 'user is already associated with a restaurant';
            continue;
        }

        try {
            if (await updateUserRestaurantByEmail(email, restaurantId)) {
                result.status = 'user added successfully';
            } else {
                result.status = `failed to update user with email ${email}`;
            }
            continue;
        } catch (err) {
            console.error(err);
            result.status = `failed to update user with email ${email}`;
            continue;
        }
    }

    res.status(207).json({ results });

});

module.exports = router;
