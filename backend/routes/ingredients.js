const express = require('express');
const {getIngredientCategory}  = require('../services/getIngredients');

const router = express.Router();


router.get('/api/ingredients', express.json(), async (req, res) => {
    const ingredientCategory = getIngredientCategory(
        'backend/csvFiles/raaka-ainetiedot.csv');

    res.json({ ingredientCategory });
});