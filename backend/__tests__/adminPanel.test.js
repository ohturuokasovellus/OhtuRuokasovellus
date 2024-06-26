/* eslint-disable camelcase */
/* eslint-disable jest/no-mocks-import*/
/* eslint-disable jest/expect-expect */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const postgresMock = require('../__mocks__/postgres');

const token = jwt.sign({
    username: 'admin', userId: 1, restaurantId: 1, isAdmin: true
}, process.env.SECRET_KEY);

describe('admin panel api', () => {
    const headers = {'Authorization':'Bearer '+token, 
        'Content-Type': 'application/json'};

    beforeEach(() => {
        postgresMock.clearDatabase();
    });

    test('checks admin status correctly', async () => {
        postgresMock.setSqlResults([
        ]);

        const nonAdminHeaders = {'Authorization': 'Bearer '+jwt.sign({
            username: 'notAdmin', userId: 2, restaurantId: 2, isAdmin: false
        }, process.env.SECRET_KEY),
        'Content-Type': 'application/json'};

        await request(app)
            .get('/api/verify-admin-status')
            .set(headers)
            .expect(200)
            .expect({ isAdmin: true });

        await request(app)
            .get('/api/verify-admin-status')
            .set(nonAdminHeaders)
            .expect(200)
            .expect({ isAdmin: false });

    });

    test('gives error if not admin', async () => {
        postgresMock.setSqlResults([]);
        
        const wrongTokenHeaders = {'Authorization': 'Bearer '+jwt.sign({
            username: 'notAdmin', userId: 2, restaurantId: 2, isAdmin: false
        }, process.env.SECRET_KEY),
        'Content-Type': 'application/json'};

        await request(app)
            .get('/api/restaurants')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');
        
        await request(app)
            .get('/api/restaurant/1/users')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');

        await request(app)
            .delete('/api/delete/restaurant/1')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');

        await request(app)
            .post('/api/restaurant/1/add-user')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');
    
        await request(app)
            .post('/api/url/change/survey')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');
    });

    test('fetches restaurants if authorized', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 1, name: 'testaurant' }, 
                { restaurant_id: 2, name: 'testaurantti' }]
        ]);

        await request(app)
            .get('/api/restaurants')
            .set(headers)
            .expect(200)
            .expect([{ restaurantId: 1, name: 'testaurant' }, 
                {restaurantId: 2, name: 'testaurantti' }]
            );
    });

    test('fetches restaurant users if authorized', async () => {
        postgresMock.setSqlResults([
            [{ username: 'user1' }, 
                { username: 'user2' }]
        ]);

        await request(app)
            .get('/api/restaurant/1/users')
            .set(headers)
            .expect(200)
            .expect([{ username: 'user1' }, 
                { username: 'user2' }]
            );
    });

    test('deletes restaurant if authorized', async () => {
        postgresMock.setSqlResults([
        ]);

        await request(app)
            .delete('/api/delete/restaurant/1')
            .set(headers)
            .expect(200)
            .expect('restaurant deleted');
    });

    test('adds user to restaurant if authorized', async () => {
        postgresMock.setSqlResults([
            { count: 1 }
        ]);

        const body = {
            userToAdd: 'user1'
        };

        await request(app)
            .post('/api/restaurant/1/add-user')
            .send(body)
            .set(headers)
            .expect(200)
            .expect('user added to restaurant');
    });

    test('gives error if username does not exist', async () => {
        postgresMock.setSqlResults([
            { count: 0 }
        ]);

        const body = {
            userToAdd: 'nonExistingUser'
        };

        await request(app)
            .post('/api/restaurant/1/add-user')
            .send(body)
            .set(headers)
            .expect(404)
            .expect('invalid username');
    });

    test('updates url with correct url name', async () => {
        postgresMock.setSqlResults([
            { count: 1 }
        ]);

        const body = {
            newUrl: 'https://test.fi'
        };

        await request(app)
            .post('/api/url/change/survey')
            .send(body)
            .set(headers)
            .expect(200)
            .expect('Survey url changed');
    });
});