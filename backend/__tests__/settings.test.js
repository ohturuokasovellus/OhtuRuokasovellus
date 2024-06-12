const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');
const { createToken } = require('../services/authorization');

describe('settings', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    test('user removal fails without password', async () => {
        await request(app)
            .post('/api/remove-account')
            .set('Authorization', 'Bearer ' + createToken('test', 1, null))
            .expect(401)
            .expect({ error: 'unauthorized' });

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('user removal fails without valid authorization', async () => {
        await request(app)
            .post('/api/remove-account')
            .send({ password: 'Test123!' })
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + createToken('test', 1, null).substring(1))
            .expect(401)
            .expect({ error: 'unauthorized' });

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('user removal fails with incorrect password', async () => {
        // hash of Test123!
        const password =
            '54de7f606f2523cba8efac173fab42fb7f59d56ceff974c8fdb7342cf2cfe345';
        postgresMock.setSqlResults([
            [{ password }],  // checkPassword
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
        // hash of Test123!
        const password =
            '54de7f606f2523cba8efac173fab42fb7f59d56ceff974c8fdb7342cf2cfe345';
        postgresMock.setSqlResults([
            [{ password }],  // checkPassword
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
        // hash of Test123!
        const password =
            '54de7f606f2523cba8efac173fab42fb7f59d56ceff974c8fdb7342cf2cfe345';
        postgresMock.setSqlResults([
            [{ password }],  // checkPassword
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
