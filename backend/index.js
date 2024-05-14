require('dotenv').config()
const express = require('express')
const { sql } = require('./database')
const registerRouter = require('./routes/register')

const app = express()

app.use(express.json())

app.get('/api', (req, res) => {
  res.send('hello world')
})

app.use(registerRouter)

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
