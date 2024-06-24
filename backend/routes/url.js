const express = require('express');
const { getUrl } = require('../databaseUtils/url');
const router = express.Router();
router.use(express.json());

/**
 * Route for requesting urls.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 404 - Url not found.
 */
router.get('/api/url/:urlName', async (req, res) => {
    try {
        const result = await getUrl(req.params.urlName);
        if (result) {
            res.status(200).send(result[0].url);
        }
    } catch (err) {
        return res.sendStatus(404);
    }
});

module.exports = router;
