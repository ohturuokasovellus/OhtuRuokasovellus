const express = require('express');
const { sql } = require('../database');

const router = express.Router();

router.get('/devops/health', async (req, res) => {
    // check that database is healthy
    try {
        const result = await sql`SELECT 1+1 AS result`;
        if (result.length !== 1 || result[0].result !== 2) {
            throw new Error('incorrect result');
        }
    } catch {
        return res.status(500).send('database failed');
    }

    res.send('ok');
});

module.exports = router;
