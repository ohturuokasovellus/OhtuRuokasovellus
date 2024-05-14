require('dotenv').config()
const express = require('express')
const sql = require('./database')
const cors = require('cors');

const app = express()
app.use(cors());
app.use(express.json())

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

app.post('/api/login', async (req, res) => {
  const user = await sql`
    SELECT * FROM users WHERE user_name = ${req.body.username} and password_hash = ${req.body.password};
  `
  if (user.length > 0) {
    res.status(200).json({ user: user[0].user_name, message: 'Login succesful' });

  } else {
    res.status(404).json({ message: 'Invalid username or password' });
  }
})

app.listen(8080, () => {
  console.log('listening to 8080...')
})
