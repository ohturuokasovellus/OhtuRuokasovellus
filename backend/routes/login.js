const sql = require('../database')
const express = require('express')
const { hash } = require('../services/hash')
const router = express.Router()
const { getUser } = require('../database')

router.post('/api/login', async (req, res) => {
  const user = await getUser(req.body.username, hash(req.body.password))
  console.log(user)
    if (user.length > 0) {
      res.status(200).json({ user: user[0].user_name, message: 'Login succesful' });
  
    } else {
      res.status(404).json({ message: 'Invalid username or password' });
    }
})

module.exports = router