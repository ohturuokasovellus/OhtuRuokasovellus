const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');
const { createToken } = require('../services/authorization');

/** Hash of `Test-123!` */
const passwordHash =
    '54de7f606f2523cba8efac173fab42fb7f59d56ceff974c8fdb7342cf2cfe345';

describe('settings', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    describe('user removal', () => {
        test('fails without password', async () => {
            await request(app)
                .post('/api/remove-account')
                .set('Authorization', 'Bearer ' + createToken('test', 1, null))
                .expect(401)
                .expect({ error: 'unauthorized' });

            expect(postgresMock.runSqlCommands().length).toBe(0);
        });

        test('fails without valid authorization', async () => {
            await request(app)
                .post('/api/remove-account')
                .send({ password: 'Test123!' })
                .set('Content-Type', 'application/json')
                .set(
                    'Authorization',
                    'Bearer ' + createToken('test', 1, null).substring(1)
                )
                .expect(401)
                .expect({ error: 'unauthorized' });

            expect(postgresMock.runSqlCommands().length).toBe(0);
        });

        test('fails with incorrect password', async () => {
            postgresMock.setSqlResults([
                [{ password: passwordHash }],  // checkPassword
            ]);

            await request(app)
                .post('/api/remove-account')
                .send({ password: 'Test123?' })
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + createToken('test', 1, null))
                .expect(401)
                .expect({ error: 'incorrect password' });

            expect(postgresMock.runSqlCommands().length).toBe(1);
        });

        test('user is deleted with correct request', async () => {
            postgresMock.setSqlResults([
                [{ password: passwordHash }],  // checkPassword
                null,  // deleteUser, no return value
            ]);

            await request(app)
                .post('/api/remove-account')
                .send({ password: 'Test123!' })
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + createToken('test', 1, null))
                .expect(200);

            expect(postgresMock.runSqlCommands().length).toBe(2);
        });

        test('database error is handled properly', async () => {
            postgresMock.setSqlResults([
                [{ password: passwordHash }],  // checkPassword
                new Error('db error'),  // deleteUser
            ]);

            await request(app)
                .post('/api/remove-account')
                .send({ password: 'Test123!' })
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + createToken('test', 1, null))
                .expect(500)
                .expect({ error: 'internal server error' });

            expect(postgresMock.runSqlCommands().length).toBe(2);
        });
    });

    describe('user data export', () => {
        test('fails with invalid authorization', async () => {
            await request(app)
                .get('/api/export-user-data')
                .set(
                    'Authorization',
                    'Bearer ' + createToken('test', 1, null).substring(1)
                )
                .expect(401)
                .expect('unauthorized');

            expect(postgresMock.runSqlCommands().length).toBe(0);
        });

        test('fails with unexistant user', async () => {
            postgresMock.setSqlResults([
                [],  // get user info, user not found
                [],  // get purchases
                [],  // get evaluations
            ]);

            await request(app)
                .get('/api/export-user-data')
                .set('Authorization', 'Bearer ' + createToken('test', 1, null))
                .expect(400)
                .expect('user not found');

            expect(postgresMock.runSqlCommands().length).toBe(3);
        });

        test('responses user data correctly', async () => {
            postgresMock.setSqlResults([
                // get user info
                [{
                    username: 'test',
                    email: 'test@example.com',
                    // eslint-disable-next-line camelcase
                    birth_year: '1994',
                    gender: 'other',
                    education: 'secondary',
                    income: '3500-4500',
                }],
                // get purchases
                [{
                    // eslint-disable-next-line camelcase
                    purchased_at: '2024-06-20T12:06:41.581Z',
                    name: 'pasta',
                    // eslint-disable-next-line camelcase
                    meal_id: 42,
                }],
                // get self evaluation
                [
                    // eslint-disable-next-line camelcase
                    { eval_key: 1, eval_value: 5 },
                    // eslint-disable-next-line camelcase
                    { eval_key: 2, eval_value: 1 },
                ],
            ]);

            await request(app)
                .get('/api/export-user-data')
                .set('Authorization', 'Bearer ' + createToken('test', 1, null))
                .expect(200)
                .expect({
                    userInfo: {
                        username: 'test',
                        email: 'test@example.com',
                        // eslint-disable-next-line camelcase
                        birth_year: '1994',
                        gender: 'other',
                        education: 'secondary',
                        income: '3500-4500',
                    },
                    purchases: [{
                        // eslint-disable-next-line camelcase
                        date: '2024-06-20T12:06:41.581Z',
                        // eslint-disable-next-line camelcase
                        meal: 'pasta',
                    }],
                    selfEvaluations: {
                        climate: 5,
                        nutrition: 1,
                    },
                });

            expect(postgresMock.runSqlCommands().length).toBe(3);
        });
    });
});
