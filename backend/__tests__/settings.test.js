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
});
