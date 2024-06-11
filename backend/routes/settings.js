const express = require('express');

const router = express.Router();

router.post('/api/remove-account', (req, res) => {
    res.send('poistetaan...');
});

module.exports = router;
