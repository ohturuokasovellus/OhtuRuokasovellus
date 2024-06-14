const express = require('express');
const { sql } = require('../database');
const filesystem = require('node:fs');
const path = require('node:path');

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

router.get('/devops/version', (req, res) => {
    const versionFilePath = path.join(__dirname, '..', '..', 'version.txt');
    let version;
    try {
        version = filesystem.readFileSync(
            versionFilePath,
            { encoding: 'utf-8' }
        );
    } catch {
        return res.sendStatus(500).send('version not available');
    }

    res.send(version);
});

module.exports = router;
