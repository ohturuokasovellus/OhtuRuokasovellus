require('dotenv').config();
const express = require('express');
const cors = require('cors');
const registerRouter = require('./routes/register');
const LoginRouter = require('./routes/login');
const mealRouter = require('./routes/meal');
const urlRouter = require('./routes/url');
const userAdditionRouter = require('./routes/addUser');
const ingredientsRouter = require('./routes/ingredients');
const purchaseRouter = require('./routes/purchase');
const pageURLRouter = require('./routes/webpageURL');
const settingsRouter = require('./routes/settings');
const devopsRouter = require('./routes/devops');
const dashboardRouter = require('./routes/dashboard');
const restaurantRouter = require('./routes/restaurant');
const researchRouter = require('./routes/researchData');
const adminPanelRouter = require('./routes/adminPanel');
const path = require('path');
const filesystem = require('fs');

const app = express();

app.use(cors());

app.use(registerRouter);
app.use(LoginRouter);
app.use(mealRouter);
app.use(urlRouter);
app.use(userAdditionRouter);
app.use(ingredientsRouter);
app.use(purchaseRouter);
app.use(pageURLRouter);
app.use(settingsRouter);
app.use(devopsRouter);
app.use(dashboardRouter);
app.use(restaurantRouter);
app.use(researchRouter);
app.use(adminPanelRouter);

const assetsPath = path.join(__dirname, 'assets');
app.use(express.static(assetsPath, { index: false }));

const webBuildPath = path.join(__dirname, '..', 'web-build');
if (filesystem.existsSync(webBuildPath)) {
    app.use(express.static(webBuildPath));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(webBuildPath, 'index.html'));
    });
}

module.exports = app;
