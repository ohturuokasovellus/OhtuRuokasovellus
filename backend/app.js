require('dotenv').config()
const express = require('express')
const { sql } = require('./database')
const cors = require('cors')
const registerRouter = require('./routes/register')
const LoginRouter = require('./routes/login')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
  res.send('hello world')
})

app.use(registerRouter)
app.use(LoginRouter)

app.get('/api/users', async (req, res) => {
  // FIXME: remove this route later during the development
  const users = await sql`
    SELECT user_name FROM users;
  `
  res.json(users)
})

module.exports = app
