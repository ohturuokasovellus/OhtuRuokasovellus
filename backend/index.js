require('dotenv').config()
const express = require('express')
const sql = require('./database')

const app = express()

app.get('/api', (req, res) => {
  res.send('hello world')
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
