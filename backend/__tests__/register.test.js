const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('register api', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    // eslint-disable-next-line jest/expect-expect
    test('register fails with missing username', async () => {
        await request(app)
            .post('/api/register')
            .send({ password: 'Testi-123', email: 'johndoe@example.com' })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({ errorMessage: 'invalid username, password or email' });
    });

    // eslint-disable-next-line jest/expect-expect
    test('register fails if username already exists', async () => {
        postgresMock.setSqlResults([
            [{ exists: true }],    // check if username already exists
            [{ exists: false }],    // check if email already exists
        ]);

        await request(app)
            .post('/api/register')
            .send({
                username: 'tester',
                password: 'Testi-123',
                email: 'johndoe@example.com',
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({ errorMessage: 'username already exists' });
    });

    // eslint-disable-next-line jest/expect-expect
    test('register fails if email already exists', async () => {
        postgresMock.setSqlResults([
            [{ exists: false }],    // check if username already exists
            [{ exists: true }],     // check if email already exists
        ]);

        await request(app)
            .post('/api/register')
            .send({
                username: 'tester',
                password: 'Testi-123',
                email: 'johndoe@example.com',
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({ errorMessage: 'email already exists' });
    });

    test('registered user is saved to database', async () => {
        postgresMock.setSqlResults([
            [{ exists: false }],    // check if username already exists
            [{ exists: false }],    // check if email already exists
            null,                   // user is inserted to db, no return
        ]);

        await request(app)
            .post('/api/register')
            .send({
                username: 'tester',
                password: 'Testi-123',
                email: 'johndoe@example.com',
            })
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(3);
    });
});
