const express = require('express')
const { isValidUsername, isValidPassword, isValidEmail } = require('../../src/utilities/validators.js')
const { hash } = require('../services/hash')
const { insertUser, doesUsernameExist, doesEmailExist } = require('../database')

const router = express.Router()

router.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body

  // validate inputs
  if (!isValidUsername(username) || !isValidPassword(password) || !isValidEmail(email)) {
    return res.status(400).json({ errorMessage: 'invalid username, password or email' })
  }

  // check duplicate username and email
  if (await doesUsernameExist(username)) {
    return res.status(400).json({ errorMessage: 'username already exists' })
  }
  if (await doesEmailExist(email)) {
    return res.status(400).json({ errorMessage: 'email already exists' })
  }

  // insert the user into database
  const passwordHash = hash(password)   // TODO: salt hashes
  try {
    await insertUser(username, passwordHash, email)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errorMessage: 'user creation failed' })
  }

  res.sendStatus(200)
})

module.exports = router
