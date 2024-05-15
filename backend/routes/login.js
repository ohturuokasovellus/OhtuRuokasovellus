const sql = require('../database')
const express = require('express')

const router = express.Router()

router.post('/api/login', async (req, res) => {
    const user = await sql`
      SELECT * FROM users WHERE user_name = ${req.body.username} and password_hash = ${req.body.password};
    `
    if (user.length > 0) {
      res.status(200).json({ user: user[0].user_name, message: 'Login succesful' });
  
    } else {
      res.status(404).json({ message: 'Invalid username or password' });
    }
})

module.exports = router