const express = require('express');
const router = express.Router();
router.use(express.json());

const { verifyToken } = require('../services/authorization');
const { getAgeGroup } = require('../services/ageGroup');
const { getBirthYear, getGender } = require('../databaseUtils/user');
const {
    getAvgCo2Emissions,
    getAvgCo2EmissionsByUser,
    getAvgCo2EmissionsByGender,
    getAvgCo2EmissionsByAgeGroup,
    getAvgMacronutrients,
    getAvgMacronutrientsByUser,
    getAvgMacronutrientsByGender,
    getAvgMacronutrientsByAgeGroup
} = require('../databaseUtils/averages');

// /**
//  * Route for requesting data for dashboard.
//  * User identity is taken from the authorization header.
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  * @returns {Object} 401 - Invalid authorization header was given.
//  * @returns {Object} 500 - Unexpected internal server error.
//  */
router.get('/api/user/dashboard', async (req, res) => {
    const userInfo = verifyToken(req.header('Authorization'));
    if (!userInfo) {
        return res.status(401).send('unauthorized');
    }

    const averages = {
        all: { co2: 0, carbs: 0, fat: 0, protein: 0 },
        user: { co2: 0, carbs: 0, fat: 0, protein: 0 },
        gender: { co2: 0, carbs: 0, fat: 0, protein: 0 },
        age: { co2: 0, carbs: 0, fat: 0, protein: 0 },
    };

    let birthYear;
    let gender;
    try {
        birthYear = await getBirthYear(userInfo.userId);
        gender = await getGender(userInfo.userId);
    } catch (err) {
        return res.status(500).send(
            'error fetching birthyear/gender'
        );
    }

    const age = getAgeGroup(birthYear);
    const ageGroup = Object.keys(age)[0];
    const years = age[ageGroup];

    try {
        averages.all.co2 = await getAvgCo2Emissions();
    } catch (err) {
        return res.status(500).send(
            'error fetching avg co2 emissions'
        );
    }

    try {
        averages.user.co2 = await getAvgCo2EmissionsByUser(userInfo.userId);
    } catch (err) {
        return res.status(500).send(
            'error fetching avg co2 emissions by user'
        );
    }

    try {
        averages.gender.co2 = await getAvgCo2EmissionsByGender(gender);
    } catch (err) {
        return res.status(500).send(
            'error fetching avg co2 emissions by gender'
        );
    }

    try {
        averages.age.co2 = await getAvgCo2EmissionsByAgeGroup(years);
    } catch (err) {
        return res.status(500).send(
            'error fetching avg co2 emissions by age group'
        );
    }

    try {
        const macros = await getAvgMacronutrients();
        averages.all.carbs = macros.avgCarbohydrates;
        averages.all.fat = macros.avgFat;
        averages.all.protein = macros.avgProtein;
    } catch (err) {
        return res.status(500).send(
            'error fetching avg macros'
        );
    }

    try {
        const macros = await getAvgMacronutrientsByUser(userInfo.userId);
        averages.user.carbs = macros.avgCarbohydrates;
        averages.user.fat = macros.avgFat;
        averages.user.protein = macros.avgProtein;
    } catch (err) {
        return res.status(500).send(
            'error fetching avg macros by user'
        );
    }

    try {
        const macros = await getAvgMacronutrientsByGender(gender);
        averages.gender.carbs = macros.avgCarbohydrates;
        averages.gender.fat = macros.avgFat;
        averages.gender.protein = macros.avgProtein;
    } catch (err) {
        return res.status(500).send(
            'error fetching avg macros by gender'
        );
    }

    try {
        const macros = await getAvgMacronutrientsByAgeGroup(years);
        averages.age.carbs = macros.avgCarbohydrates;
        averages.age.fat = macros.avgFat;
        averages.age.protein = macros.avgProtein;
    } catch (err) {
        return res.status(500).send(
            'error fetching avg macros by age group'
        );
    }

    res.json({
        ageGroup: ageGroup,
        gender: gender,
        averages: averages
    });
});

module.exports = router;
