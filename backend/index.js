// const app = require('./app');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const url = 'https://github.com/ohturuokasovellus/OhtuRuokasovellus';
    res.send(`<h1>Ruokasovellus</h1><a href="${url}">GitHub</a>`);
});

app.listen(8080, () => {
    console.log('listening to 8080...');
});
