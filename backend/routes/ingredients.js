const express = require('express');
const {getIngredients}  = require('../services/getIngredients');

const router = express.Router();


router.get('/api/ingredients', express.json(), async (req, res) => {
    const nutrients = getIngredients('backend/csvFiles/raaka-ainetiedot.csv');

    res.json({ nutrients });
});