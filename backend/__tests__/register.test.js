const request = require('supertest')
const app = require('../app')
const postgresMock = require('../__mocks__/postgres')

describe('register api', () => {
  afterEach(() => {
    postgresMock.clearDatabase()
  })

  test('register fails with missing username', async () => {
    await request(app)
      .post('/api/register')
      .send({ password: 'Testi-123', email: 'johndoe@example.com' })
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect({ errorMessage: 'invalid username, password or email' })
  })

  test('register fails if username already exists', async () => {
    postgresMock.setSqlResults([
      [{ exists: true }],    // check if username already exists
      [{ exists: true }],    // check if email already exists
    ])

    await request(app)
      .post('/api/register')
      .send({ username: 'tester', password: 'Testi-123', email: 'johndoe@example.com' })
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect({ errorMessage: 'username already exists' })
  })

  test('registered user is saved to database', async () => {
    postgresMock.setSqlResults([
      [{ exists: false }],    // check if username already exists
      [{ exists: false }],    // check if email already exists
      null,                   // user is inserted to db, no return
    ])

    await request(app)
      .post('/api/register')
      .send({ username: 'tester', password: 'Testi-123', email: 'johndoe@example.com' })
      .set('Content-Type', 'application/json')
      .expect(200)

    expect(postgresMock.runSqlCommands().length).toBe(3)
  })
})
