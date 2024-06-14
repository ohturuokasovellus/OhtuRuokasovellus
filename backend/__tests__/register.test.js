/* eslint-disable jest/expect-expect */
const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('register api', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    test('register fails with missing username', async () => {
        await request(app)
            .post('/api/register')
            .send({ password: 'Testi-123', email: 'johndoe@example.com' })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({
                errorMessage: 'invalid username, password, email or birth year'
            });
    });

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

    test('registration fails if restaurant already exists', async () => {
        postgresMock.setSqlResults([
            [{ exists: false }],    // check if username already exists
            [{ exists: false }],    // check if email already exists
            [{ exists: true }],     // check if restaurant already exists
        ]);

        await request(app)
            .post('/api/register')
            .send({
                username: 'tester',
                password: 'Testi-123',
                email: 'johndoe@example.com',
                birthYear: '2000',
                gender: 'man',
                education: 'primary',
                income: 'over 5500',
                isRestaurant: true,
                restaurantName: 'testaurant',
            })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect({ errorMessage: 'restaurant testaurant already exists' });
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
                birthYear: '2000',
                gender: 'man',
                education: 'primary',
                income: 'over 5500',
                isRestaurant: false,
            })
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(3);
    });

    test('registered restaurant is saved to database', async () => {
        postgresMock.setSqlResults([
            [{ exists: false }],    // check if username already exists
            [{ exists: false }],    // check if email already exists
            [{ exists: false }],    // check if restaurant already exists
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 1 }], // create restaurant
            null,                   // user is inserted to db, no return
            [{ exists: true }],     // restaurant is associated with user
        ]);

        await request(app)
            .post('/api/register')
            .send({
                username: 'tester',
                password: 'Testi-123',
                email: 'johndoe@example.com',
                birthYear: '2000',
                gender: 'man',
                education: 'primary',
                income: 'over 5500',
                isRestaurant: true,
                restaurantName: 'testaurant',
            })
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(6);
    });
});
