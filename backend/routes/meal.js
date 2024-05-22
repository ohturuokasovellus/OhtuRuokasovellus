const express = require('express');
const { insertMeal, addMealImage, getMeals } = require('../database');

const router = express.Router();

router.post('/api/meals', express.json(), async (req, res) => {
    // TODO: validate user login

    const { mealName } = req.body;

    // TODO: properly validate name
    if (!mealName) {
        return res.status(400).send('invalid meal name');
    }

    let mealId;
    try {
        mealId = await insertMeal(mealName);
    } catch (err) {
        console.error(err);
        return res.status(500).send('meal insertion failed');
    }

    res.json({ mealId });
});

router.post('/api/meals/images/:id', express.raw({ type: '*/*', limit: 1e7 }), async (req, res) => {
    const imageData = req.body;
    const mealId = req.params.id;

    if (!Buffer.isBuffer(imageData)) {
        return res.status(400).send('missing image');
    }

    await addMealImage(mealId, imageData);

    res.sendStatus(200);
});

router.get('/api/meals', async (req, res) => {
    // TODO: get restaurant id from the request and pass it to `getMeals`

    const meals = await getMeals();

    res.json(meals);
});

module.exports = router;
