/* eslint-disable jest/expect-expect */
const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('POST /api/add-users', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    test('fails with invalid password', async () => {
        postgresMock.setSqlResults([[]]); // getUser

        await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test1@example.com'],
                restaurantId: 123,
                username: 'testuser',
                password: 'wrongpassword'
            })
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect({ error: 'invalid password' });
    });

    test('handles non-existing emails', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{
                // eslint-disable-next-line camelcase
                user_id: 1,
                username: 'testuser',
                password,
                // eslint-disable-next-line camelcase
                restaurant_id: 123
            }], // mock getUser
            [{ exists: false }], // doesEmailExist
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['nonexistent@example.com'],
                restaurantId: 123,
                username: 'testuser',
                password: 'password'
            })
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
            [{
                // eslint-disable-next-line camelcase
                user_id: 1,
                username: 'testuser',
                password,
                // eslint-disable-next-line camelcase
                restaurant_id: 123
            }], // getUser
            [{ exists: true }], // doesEmailExist
            // eslint-disable-next-line camelcase
            [{ user_id: 2 }], // getUserIdByEmail
            [{ exists: true }], // isRestaurantUser
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['existing@example.com'],
                restaurantId: 123,
                username: 'testuser',
                password: 'password'
            })
            .set('Content-Type', 'application/json')
            .expect(207);

        expect(response.body.results).toEqual([
            {
                email: 'existing@example.com',
                status: 'user is already associated with a restaurant'
            }
        ]);
    });

    /*test('handles error during email existence check', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{
                // eslint-disable-next-line camelcase
                user_id: 1,
                username: 'testuser',
                password,
                // eslint-disable-next-line camelcase
                restaurant_id: 123
            }], // getUser
            new Error('db error'), // doesEmailExist
        ]);

        const response = await request(app)
            .post('/api/add-users')
            .send({
                emails: ['test@example.com'],
                restaurantId: 123,
                username: 'testuser',
                password: 'password'
            })
            .set('Content-Type', 'application/json')
            .expect(207);

        expect(response.body.results).toEqual([
            {
                email: 'test@example.com',
                status: 'error checking email existence'
            }
        ]);
    });*/

    /*test('handles error during updating user', async () => {
        postgresMock.setSqlResults([
            [{
                // eslint-disable-next-line camelcase
                user_id: 1,
                username: 'testuser',
                password: 'password',
                // eslint-disable-next-line camelcase
                restaurant_id: 123
            }], // getUser
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
                restaurantId: 123,
                username: 'testuser',
                password: 'password'
            })
            .set('Content-Type', 'application/json')
            .expect(207);

        expect(response.body.results).toEqual([
            {
                email: 'error@example.com',
                status: 'failed to update user with email error@example.com'
            }
        ]);
    });*/

    test('adds users successfully', async () => {
        // hash of "password"
        const password =
            '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
        postgresMock.setSqlResults([
            [{
                // eslint-disable-next-line camelcase
                user_id: 1,
                username: 'testuser',
                password,
                // eslint-disable-next-line camelcase
                restaurant_id: 123
            }], // getUser
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
                restaurantId: 123,
                username: 'testuser',
                password: 'password'
            })
            .set('Content-Type', 'application/json')
            .expect(207);

        expect(response.body.results).toEqual([
            { email: 'test1@example.com', status: 'user added successfully' },
            { email: 'test2@example.com', status: 'user added successfully' }
        ]);
    });
});
