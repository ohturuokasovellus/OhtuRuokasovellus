const express = require('express')

const app = express()

app.get('/api', (req, res) => {
  res.send('hello world')
})

app.listen(8080, () => {
  console.log('listening to 8080...')
})
