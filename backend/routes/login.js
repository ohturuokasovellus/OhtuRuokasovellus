const express = require('express');
const { hash } = require('../services/hash');
const router = express.Router();
const { getUser } = require('../databaseUtils/user');
const { createToken } = require('../services/authorization');

router.use(express.json());

/**
 * Route for logging user in.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 404 - Invalid credentials.
 */
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    let user = null;
    try{
        user = await getUser(username, hash(password));
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
    if (user) {
        res
            .status(200)
            .send(
                {
                    token: createToken(
                        user.username, user.userId, user.restaurantId,
                        user.isAdmin
                    ),
                    username: user.username,
                    restaurantId: user.restaurantId,
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
