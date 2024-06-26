const express = require('express');
const router = express.Router();
const { getRestaurantIdByUserId, getUserIdByEmail, 
    doesEmailExist, isRestaurantUser, 
    updateUserRestaurantByEmail } = require('../databaseUtils/user.js');
const { checkPassword } = require('../database.js');
const { hash } = require('../services/hash');
const { verifyToken } = require('../services/authorization');

router.use(express.json());

/**
 * Handles the addition of users to a restaurant.
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} - JSON object containing results for each email
 */

router.post('/api/add-users', async (req, res) => {
    const { emails, password } = req.body;

    const user = verifyToken(req.header('Authorization'));
    if (!user) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    try {
        if (!(await checkPassword(user.userId, hash(password)))) {
            return res.status(401).json({ error: 'invalid password' });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
    
    let restaurantId = null;
    try {
        restaurantId = await getRestaurantIdByUserId(user.userId);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }

    if (!restaurantId) {
        return res.status(403).json({
            error: 'user does not belong to any restaurant',
        });
    }

    if (emails.length > 10) {
        return res.status(400).json({
            error: 'cannot add more than 10 email addresses at once'
        });
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

        try {
            const userId = await getUserIdByEmail(email);
            if (await isRestaurantUser(userId)) {
                result.status = 'user is already associated with a restaurant';
                continue;
            }
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
