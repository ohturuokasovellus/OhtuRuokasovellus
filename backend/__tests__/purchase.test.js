const request = require('supertest');
const app = require('../app');
const { createToken } = require('../services/authorization');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('purchase', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    test('meal can be fetched with the purchase code', async () => {
        postgresMock.setSqlResults([
            // eslint-disable-next-line camelcase
            [{ meal_id: 42, name: 'Meatballs' }],
        ]);

        await request(app)
            .get('/api/purchases/meal/testabc1')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect({ mealId: 42, name: 'Meatballs' });

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('invalid purchase code returns 404', async () => {
        postgresMock.setSqlResults([
            [],
        ]);

        await request(app)
            .get('/api/purchases/meal/n07f0und')
            .expect(404);

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('purchase is saved to database with valid request', async () => {
        postgresMock.setSqlResults([
            null,   // insertion to database, no return
        ]);

        await request(app)
            .post('/api/purchases')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .send({ purchaseCode: 'testabc1' })
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('purchase cannot be made without purchase code', async () => {
        // no purchase code is sent in the body
        await request(app)
            .post('/api/purchases')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(400);

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('unauthorized user cannot make a purchase', async () => {
        // no authorization header set
        await request(app)
            .post('/api/purchases')
            .expect(401);

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('authorized user can fetch meal history', async () => {
        postgresMock.setSqlResults([
            [{
                // eslint-disable-next-line camelcase
                purchased_at: '2024-06-06T11:39:40.601Z',
                name: 'Meatballs',
                // eslint-disable-next-line camelcase
                meal_id: 42,
            }],
        ]);

        await request(app)
            .get('/api/purchases')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(200)
            .expect([
                {
                    mealId: 42,
                    mealName: 'Meatballs',
                    date: '2024-06-06T11:39:40.601Z',
                },
            ]);

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('unauthorized user cannot fetch meal history', async () => {
        // no authorization header set
        await request(app)
            .get('/api/purchases')
            .expect(401);
        expect(postgresMock.runSqlCommands().length).toBe(0);
    });
});
