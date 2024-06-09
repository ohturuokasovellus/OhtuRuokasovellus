const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

const token = jwt.sign({ username: 'test', userId: 1, restaurantId: 1 },
    process.env.SECRET_KEY);

describe('meal management api', () => {
    const headers = {'Authorization':'Bearer '+token, 
        'Content-Type': 'application/json'};

    beforeEach(() => {
        return postgresMock.clearDatabase(); // why is this being returned?
    });

    test('gives error if unauthorized', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 1 }], // eslint-disable-line camelcase
        ]);
        
        const wrongTokenHeaders = {'Authorization':'Bearer 123', 
            'Content-Type': 'application/json'};
        await request(app)
            .put('/api/meals/delete/1')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');

    });

    test('gives error if user is not the owner of the meal',async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2 }], // eslint-disable-line camelcase
        ]);

        await request(app)
            .put('/api/meals/delete/2')
            .send({ mealName: 'pasta' })
            .set(headers)
            .expect(401)
            .expect('Unauthorized');
    });

    test('gives error if database did not update',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}], // eslint-disable-line camelcase
                { count: 0 }
            ]);

            await request(app)
                .put('/api/meals/delete/1')
                .set(headers)
                .expect(500)
                .expect({ errorMessage: 'Meal deletion failed'});
        });

    test('sets meal to inactive if authorized and user is meal owner',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}], // eslint-disable-line camelcase
                { count: 1 }
            ]);

            await request(app)
                .put('/api/meals/delete/1')
                .set(headers)
                .expect(200)
                .expect('"Meal deleted"');
        });
});