const express = require('express');
const router = express.Router();
const { getResearchData } = require('../databaseUtils/researchData');
//const { verifyToken } = require('../services/authorization');

/**
 * Route for fetching all research related data.
 * @param {Object} req - The request object.
 * @param {number} req.params.restaurantId - Restaurant id.
 * @param {Object} res - The response object.
 */
router.get('/api/research-data/', async (req, res) => {
    //const verifiedToken = verifyToken(req.header('Authorization'));
    //if (!verifiedToken || !verifiedToken.isAdmin) {
    //    return res.status(401).send('unauthorized');
    //}

    try {
        const researchData = await getResearchData();
        res.json(researchData);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('unexpected internal server error');
    }

});

module.exports = router;
