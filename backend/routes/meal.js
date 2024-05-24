const express = require('express');
const { insertMeal, addMealImage, getMeals, sql } = require('../database');

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

router.post('/api/meals/images/:id',
    express.raw({ type: '*/*', limit: 1e7 }),
    async (req, res) => {
        const imageData = req.body;
        const mealId = req.params.id;

        // TODO: validate
        if (!imageData) {
            return res.status(400).send('missing image');
        }
        try {
            const success = await addMealImage(mealId, imageData);
            if (!success) {
                return res.status(404).send('meal not found');
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('unexpected internal server error');
        }

        res.sendStatus(200);
    });

router.get('/api/meals/images/:id', async (req, res) => {
    const mealId = req.params.id;

    const result = await sql`
        SELECT image FROM meals WHERE meal_id = ${mealId};
    `;

    if (result.length === 0 || !result.at(0).image) {
        return res.status(404).send('no image found');
    }
    const imageData = result.at(0).image.toString();
    res.type('image/jpeg').send(imageData);
});

router.get('/api/meals/:restaurantId', async (req, res) => {
    const result = await getMeals(req.params.restaurantId);
    if (result.length === 0) {
        return res.status(404).json('Page not found');
    }
    res.json(result);
});

module.exports = router;
