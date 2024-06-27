const express = require('express');
const { getMealByPurchaseCode } = require('../databaseUtils/meal.js');
const { addPurchase, getPurchases } = require('../databaseUtils/purchase.js');
const { verifyToken } = require('../services/authorization');

const router = express.Router();

/**
 * Route for fetching the information of a single meal by its ID.
 * @param {Object} req - The request object.
 * @param {number} req.params.purchaseCode - The purchase code of the meal.
 * @param {Object} res - The response object.
 * @returns {Object} 404 - The meal was not found.
 */
router.get('/api/purchases/meal/:purchaseCode', async (req, res) => {
    try{
        const meal = await getMealByPurchaseCode(req.params.purchaseCode);
        if (meal === null) {
            return res.status(404).send('meal not found');
        }
        res.json(meal);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

});

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
    const purchaseCode = req.body.purchaseCode;
    if (!purchaseCode) {
        return res.status(400).send('invalid meal id');
    }

    // insert into database
    try {
        await addPurchase(userInfo.userId, purchaseCode);
    } catch (err) {
        console.error(err);
        return res.status(500).send('purchase insertion failed');
    }

    res.sendStatus(200);
});

/**
 * Route to get the purchases of a single user.
 * User identity is taken from the authorization header.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} 401 - Invalid authorization header was given.
 * @returns {Object} 500 - Unexpected internal server error.
 */
router.get('/api/purchases', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).send('unauthorized');
    }

    let purchases;
    try {
        purchases = await getPurchases(userInfo.userId);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }

    res.json(purchases);
});

module.exports = router;
