require('dotenv').config()
const express = require('express')
const { hash } = require('./services/hash')
const { sql, insertUser } = require('./database')

const app = express()

app.use(express.json())

app.get('/api', (req, res) => {
  res.send('hello world')
})

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body

  // TODO: validate inputs
  if (!username || !password) {
    return res.status(400).send('username or password missing')
  }

  // TODO: check duplicate username

  // insert the user into database
  const passwordHash = hash(password)   // TODO: salt hashes
  try {
    await insertUser(username, passwordHash)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }

  res.sendStatus(200)
})

app.get('/api/users', async (req, res) => {
  // FIXME: remove this route later during the development
  const users = await sql`
    SELECT user_name FROM users;
  `
  res.json(users)
})

app.listen(8080, () => {
  console.log('listening to 8080...')
})
