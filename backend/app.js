require('dotenv').config();
const express = require('express');
const cors = require('cors');
const registerRouter = require('./routes/register');
const LoginRouter = require('./routes/login');
const registerRestaurantRouter = require('./routes/registerRestaurant');
const mealRouter = require('./routes/meal');
const urlRouter = require('./routes/url');
const userAdditionRouter = require('./routes/addUser');
const purchaseRouter = require('./routes/purchase');
const path = require('path');
const filesystem = require('fs');

const app = express();

app.use(cors());

app.use(registerRouter);
app.use(LoginRouter);
app.use(registerRestaurantRouter);
app.use(mealRouter);
app.use(urlRouter);
app.use(userAdditionRouter);
app.use(purchaseRouter);

const webBuildPath = path.join(__dirname, '..', 'web-build');
if (filesystem.existsSync(webBuildPath)) {
    app.use(express.static(webBuildPath));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(webBuildPath, 'index.html'));
    });
}

module.exports = app;
