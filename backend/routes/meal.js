const express = require('express');
const { insertMeal, getMeals } = require('../database');

const router = express.Router();

router.post('/api/meals', async (req, res) => {
    // TODO: validate user login

    const { mealName, imageUri } = req.body;

    // TODO: properly validate name and image
    if (!mealName) {
        return res.status(400).send('invalid meal name');
    }
    if (!imageUri) {
        return res.status(400).send('invalid image');
    }

    try {
        await insertMeal(mealName, imageUri);
    } catch (err) {
        console.error(err);
        return res.status(500).send('meal insertion failed');
    }

    res.sendStatus(200);
});

router.get('/api/meals', async (req, res) => {
    // TODO: get restaurant id from the request and pass it to `getMeals`

    const meals = await getMeals();

    res.json(meals);
});

module.exports = router;
