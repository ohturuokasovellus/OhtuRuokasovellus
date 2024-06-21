const express = require('express');
const {
    getRestaurants, getRestaurantUsers, setRestaurantToInactive,
    setRestaurantMealsToInactive, deattachUsersFromRestaurant,
    addUserToRestaurant
} = require('../databaseUtils/adminPanel');
const { verifyToken } = require('../services/authorization');

const router = express.Router();

/**
 * Route for verifying admin status
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - success status.
 */
router.get('/api/verify-admin-status', express.json(), async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    return res.status(200).send({ isAdmin: userInfo.isAdmin });
});

/**
 * Route for fetching restaurants to admin panel
 * @param {Object} req - The request object.
 * @param {number} req.params.purchaseCode - The purchase code of the meal.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - unauthorized.
 * @returns {Object} 200 - success status.
 */
router.get('/api/restaurants', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo || !userInfo.isAdmin) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const result = await getRestaurants();
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }
});

/**
 * Route for fetching users of restaurant
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId
 * @param {Object} res - The response object.
 * @returns {Object} 401 - unauthorized.
 * @returns {Object} 200 - success status.
 */
router.get('/api/restaurant/:restaurantId/users', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo || !userInfo.isAdmin) {
        return res.status(401).send('Unauthorized');
    }
    const restaurantId = req.params.restaurantId;

    if (restaurantId) {
        try {
            const result = await getRestaurantUsers(restaurantId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('unexpected internal server error');
        }
    } else {
        return res.status(400).send('invalid restaurant id');
    }
});

/**
 * Route for deactivating restaurants
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId
 * @param {Object} res - The response object.
 * @returns {Object} 401 - unauthorized.
 * @returns {Object} 200 - success status.
 */
router.delete('/api/delete/restaurant/:restaurantId', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo || !userInfo.isAdmin) {
        return res.status(401).send('Unauthorized');
    }
    const restaurantId = req.params.restaurantId;

    if (restaurantId) {
        try {
            await setRestaurantToInactive(restaurantId);
            await setRestaurantMealsToInactive(restaurantId);
            await deattachUsersFromRestaurant(restaurantId);
            return res.status(200).send('restaurant deleted');
        } catch (error) {
            console.error(error);
            return res.status(500).send('unexpected internal server error');
        }
    } else {
        return res.status(400).send('invalid restaurant id');
    }
});

/**
 * Route for adding existing users to restaurant
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - id of the target restaurant.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - unauthorized.
 * @returns {Object} 200 - success status.
 */
router.post('/api/restaurant/:restaurantId/add-user', express.json(),
    async (req, res) => {
        const userInfo = verifyToken(req.header('Authorization'));
        if (!userInfo || !userInfo.isAdmin) {
            return res.status(401).send('Unauthorized');
        }

        const username = req.body.userToAdd;
        const restaurantId = req.params.restaurantId;

        try {
            const success = await addUserToRestaurant(restaurantId, username);
            if (success) {
                return res.status(200).send('user added to restaurant');
            } else {
                return res.status(404).send('invalid username');
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('unexpected internal server error');
        }
    });

module.exports = router;
