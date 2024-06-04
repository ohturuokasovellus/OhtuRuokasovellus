const express = require('express');
const { addPurchase } = require('../database');
const { verifyToken } = require('../services/authorization');

const router = express.Router();

/**
 * Route for inserting a new purchase to database.
 * User details are taken from the authorization header.
 * @param {Object} req - The request object.
 * @param {number} req.body.mealId - The ID of the meal being purhcased.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Invalid authorization header was given.
 * @returns {Object} 400 - No meal ID was given.
 * @returns {Object} 500 - User/meal ID invalid or internal server error.
 */
router.post('/api/purchases', express.json(), async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).send('unauthorized');
    }

    // get meal id from the request body
    const mealId = req.body.mealId;
    if (!mealId) {
        return res.status(400).send('invalid meal id');
    }

    // insert into database
    try {
        await addPurchase(userInfo.userId, mealId);
    } catch (err) {
        console.error(err);
        return res.status(500).send('purchase insertion failed');
    }

    res.sendStatus(200);
});

module.exports = router;
