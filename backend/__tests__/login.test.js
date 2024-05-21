const request = require('supertest')
const app = require('../app')
const postgresMock = require('../__mocks__/postgres')

describe('login api', () => {
  afterEach(() => {
      postgresMock.clearDatabase()
  })

  test('login fails with incorrect username and correct password', async () => {
    postgresMock.setSqlResults([
      [undefined],
    ])

    await request(app)
      .post('/api/login')
      .send({ username: 'Testi', password: 'Testi123@' })
      .set('Content-Type', 'application/json')
      .expect(404)
      .expect({ error: 'Invalid username or password' })
    
    expect(postgresMock.runSqlCommands().length).toBe(1)
  })

  test('login fails with correct username and incorrect password', async () => {
    postgresMock.setSqlResults([
      [undefined],
    ])

    await request(app)
      .post('/api/login')
      .send({ username: 'testi', password: 'testi123@' })
      .set('Content-Type', 'application/json')
      .expect(404)
      .expect({ error: 'Invalid username or password' })
    
    expect(postgresMock.runSqlCommands().length).toBe(1)
  })

  test('login fails with incorrent username password', async () => {
    postgresMock.setSqlResults([
      [undefined],
    ])

    await request(app)
      .post('/api/login')
      .send({ username: 'Testi', password: 'testi123@' })
      .set('Content-Type', 'application/json')
      .expect(404)
      .expect({ error: 'Invalid username or password' })
    
    expect(postgresMock.runSqlCommands().length).toBe(1)
  })

  test('login works with correct username and password', async () => {
    postgresMock.setSqlResults([
      [{
        id: 7,
        username: 'testi',
        password: '7b9961d78d9c99ddf6ff0eabded3ebcad6a3c29e5dccdb140423beea82c6593f',
        email: 'testi@gmail.com'
      }],
    ])

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testi', password: 'Testi123@' })
      .set('Content-Type', 'application/json')
      .expect(200)
    
    const message = res.body.message
    expect(message).toBe('Login succesful')
    expect(postgresMock.runSqlCommands().length).toBe(1)
  })
})