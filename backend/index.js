// const app = require('./app');

require('dotenv').config();
const express = require('express');
const postgres = require('postgres');
const app = express();

const sql = postgres(process.env.BACKEND_POSTGRES_URL);
console.log('db connection', process.env.BACKEND_POSTGRES_URL);

app.get('/', async (req, res) => {
    let dbtest
    try {
        dbtest = (await sql`SELECT 1 AS value`).at(0).value;
    } catch (err) {
        console.error(err);
        dbtest = `failed: ${err.message}`;
    }

    res.send(`
    <h1>Ruokasovellus</h1>
    <a href="https://github.com/ohturuokasovellus/OhtuRuokasovellus">GitHub</a>
    <p>Database test: ${dbtest}</p>
    `);
});

app.listen(8080, () => {
    console.log('listening to 8080...');
});
