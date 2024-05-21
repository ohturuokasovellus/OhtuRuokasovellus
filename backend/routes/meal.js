const express = require('express');
const { insertMeal, getMeals } = require('../database');

const router = express.Router();

router.post('/api/meals', async (req, res) => {
    // TODO: validate user login

    const { name, image } = req.body;

    // TODO: properly validate name and image
    if (!name || !image) {
        return res.status(400).send('invalid name or image');
    }

    try {
        await insertMeal(name, image);
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
