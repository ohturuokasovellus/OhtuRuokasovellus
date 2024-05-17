require('dotenv').config()
const express = require('express')
const { sql } = require('./database')
const cors = require('cors')
const registerRouter = require('./routes/register')
const LoginRouter = require('./routes/login')
const path = require('path')
const fs = require('fs')

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

const webBuildPath = path.join(__dirname, '..', 'web-build')
if (fs.existsSync(webBuildPath)) {
  app.use(express.static(webBuildPath))

  app.get('/*', (req, res) => {
    res.sendFile(path.join(webBuildPath, 'index.html'))
  })
}

module.exports = app
