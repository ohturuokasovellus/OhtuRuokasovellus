require('dotenv').config();
const express = require('express');
const cors = require('cors');
const registerRouter = require('./routes/register');
const LoginRouter = require('./routes/login');
const path = require('path');
const filesystem = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

app.use(registerRouter);
app.use(LoginRouter);

const webBuildPath = path.join(__dirname, '..', 'web-build');
if (filesystem.existsSync(webBuildPath)) {
    app.use(express.static(webBuildPath));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(webBuildPath, 'index.html'));
    });
}

module.exports = app;
