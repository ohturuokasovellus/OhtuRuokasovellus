const express = require('express');
const {getIngredients}  = require('../services/getIngredients');

const router = express.Router();

router.get('/api/ingredients', express.json(), async (req, res) => {
    // TODO: only fetch this once instead of every time the create meal
    // form is opened
    const returnedIngredients = await getIngredients(
        'backend/csvFiles/raaka-ainetiedot.csv');

    const ingredients = returnedIngredients[0];
    const categorizedIngredients = returnedIngredients[1];

    res.json({ ingredients, categorizedIngredients });
});

module.exports = router;
