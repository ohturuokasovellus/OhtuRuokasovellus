const express = require('express')
const { validatePassword } = require('../services/validator')
const { hash } = require('../services/hash')
const { insertUser } = require('../database')

const router = express.Router()

router.post('/api/register', async (req, res) => {
  const { username, password } = req.body

  // TODO: validate inputs
  if (!username || !validatePassword(password)) {
    return res.status(400).json({ errorMessage: 'invalid username or password' })
  }

  // TODO: check duplicate username

  // insert the user into database
  const passwordHash = hash(password)   // TODO: salt hashes
  try {
    await insertUser(username, passwordHash)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMessage: 'user creation failed' })
  }

  res.sendStatus(200)
})

module.exports = router
