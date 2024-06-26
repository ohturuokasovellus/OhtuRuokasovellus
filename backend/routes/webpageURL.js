const express = require('express');
const router = express.Router();
router.use(express.json());

/**
 * Route for requesting urls.
 * @param {Object} res - The response object.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 404 - Url not found.
 */
router.get('/api/webpageURL', (req, res) => {
    res.status(200).send(process.env.WEBPAGE_URL);
});

module.exports = router;