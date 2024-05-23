// const app = require('./app');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Ruokasovellus</h1>');
});

app.listen(8080, () => {
    console.log('listening to 8080...');
});
