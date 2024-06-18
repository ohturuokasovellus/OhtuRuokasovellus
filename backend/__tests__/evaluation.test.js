/* eslint-disable camelcase */
/* eslint-disable jest/no-mocks-import*/
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

const token = jwt.sign({ username: 'test', userId: 1, restaurantId: 1 },
    process.env.SECRET_KEY);

describe('evaluation api', () => {
    const headers = {'Authorization':'Bearer '+token, 
        'Content-Type': 'application/json'};

    beforeEach(() => {
        postgresMock.clearDatabase();
    });

    test('gives error if unauthorized', async () => {
        postgresMock.setSqlResults([]);
        
        const wrongTokenHeaders = {'Authorization':'Bearer 123', 
            'Content-Type': 'application/json'};
        await request(app)
            .post('/api/evaluation')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('"Unauthorized"');
    });

    test('gives error if database did not update',
        async () => {
            postgresMock.setSqlResults([
                { count: 0 },
                { count: 1 }
            ]);

            const body = { climateValue: 1, nutritionValue: 3 };

            await request(app)
                .post('/api/evaluation')
                .send(body)
                .set(headers)
                .expect(500)
                .expect('evaluation setting failed');
        });

    test('returns success status when authorized and updated database',
        async () => {
            postgresMock.setSqlResults([
                { count: 1 },
                { count: 1 }
            ]);

            const body = { climateValue: 1, nutritionValue: 3 };

            await request(app)
                .post('/api/evaluation')
                .send(body)
                .set(headers)
                .expect(200);
        });
});