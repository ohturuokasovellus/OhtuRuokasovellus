/* eslint-disable jest/expect-expect */
const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');
const { createToken } = require('../services/authorization');

describe('POST /api/add-users', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    test('fails if not logged in', async () => {
        // no authorization header set
        await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test1@example.com'],
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect({ error: 'unauthorized' });

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('fails with invalid password', async () => {
        // hash of "rightpassword"
        const password =
            '314eee236177a721d0e58d3ca4ff01795cdcad1e8478ba8183a2e58d69c648c0';
        postgresMock.setSqlResults([
            [{ password }],  // checkPassword
        ]);

        await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test1@example.com'],
                password: 'wrongpassword',
            })
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect({ error: 'invalid password' });
    });

    test('fails if user is not restaurant user', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }],  // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: null }],  // getRestaurantIdByUserId
        ]);

        await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test1@example.com'],
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .expect(403)
            .expect({ error: 'user does not belong to any restaurant' });
    });

    test('fails if more than 10 email addresses are provided', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }], // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 123 }] // getRestaurantIdByUserId
        ]);
    
        const emails = [];
        // eslint-disable-next-line id-length
        for (let i = 0; i < 11; i++) {
            emails.push(`test${i}@example.com`);
        }
    
        await request(app)
            .post('/api/add-users')
            .send({
                emails,
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .expect(400)
            .expect({
                error: 'cannot add more than 10 email addresses at once'
            });
    });

    test('handles non-existing emails', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }], // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 123 }], // getRestaurantIdByUserId
            [{ exists: false }], // doesEmailExist
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['nonexistent@example.com'],
                password: 'password',
            })
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .set('Content-Type', 'application/json')
            .expect(207);

        expect(response.body.results).toEqual([
            { email: 'nonexistent@example.com', status: 'email does not exist' }
        ]);
    });

    test('handles emails already associated with a restaurant', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }], // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 123 }],  // getRestaurantIdByUserId
            [{ exists: true }], // doesEmailExist
            // eslint-disable-next-line camelcase
            [{ user_id: 2 }], // getUserIdByEmail
            [{ exists: true }], // isRestaurantUser
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['existing@example.com'],
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .expect(207);

        expect(response.body.results).toEqual([
            {
                email: 'existing@example.com',
                status: 'user is already associated with a restaurant'
            }
        ]);
    });

    test('handles error during email existence check', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }], // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 123 }], // getRestaurantIdByUserId
            new Error('db error'), // doesEmailExist
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test@example.com'],
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .expect(207);

        expect(response.body.results).toEqual([
            {
                email: 'test@example.com',
                status: 'error checking email existence'
            }
        ]);
    });

    test('handles error during updating user', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }], // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 123 }], // getRestaurantIdByUserId
            [{ exists: true }], // doesEmailExist
            // eslint-disable-next-line camelcase
            [{ user_id: 2 }], // getUserIdByEmail
            [{ exists: false }], // isRestaurantUser
            new Error('update error') // updateUserRestaurantByEmail
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['error@example.com'],
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .expect(207);

        expect(response.body.results).toEqual([
            {
                email: 'error@example.com',
                status: 'failed to update user with email error@example.com'
            }
        ]);
    });

    test('adds users successfully', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{ password }], // checkPassword
            // eslint-disable-next-line camelcase
            [{ restaurant_id: 123 }], // getRestaurantIdByUserId
            [{ exists: true }], // doesEmailExist
            // eslint-disable-next-line camelcase
            [{ user_id: 2 }], // getUserIdByEmail
            [{ exists: false }], // isRestaurantUser
            [{ exists: true }], //updateUserRestaurantByEmail
            [{ exists: true }], // doesEmailExist
            // eslint-disable-next-line camelcase
            [{ user_id: 3 }], // getUserIdByEmail
            [{ exists: false }], // isRestaurantUser
            [{ exists: true }] //updateUserRestaurantByEmail
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test1@example.com', 'test2@example.com'],
                password: 'password',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${createToken('testuser', 42)}`)
            .expect(207);

        expect(response.body.results).toEqual([
            { email: 'test1@example.com', status: 'user added successfully' },
            { email: 'test2@example.com', status: 'user added successfully' }
        ]);
    });
});
