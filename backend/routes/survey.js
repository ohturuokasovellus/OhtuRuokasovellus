const express = require('express');
const { getSurveyUrl } = require('../database');
const router = express.Router();
router.use(express.json());

/**
 * Route for requesting survey url.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 404 - Url not found.
 */
router.get('/api/survey-url', async (req, res) => {
    const surveyUrl = await getSurveyUrl();
    console.log(surveyUrl);
    if (surveyUrl) {
        res.status(200).send({ url: surveyUrl });
    } else {
        res.status(404);
    }
});

module.exports = router;
