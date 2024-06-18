/* eslint-disable camelcase */
/* eslint-disable jest/no-mocks-import*/
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const postgresMock = require('../__mocks__/postgres');

const token = jwt.sign({ username: 'test', userId: 1, restaurantId: 1 },
    process.env.SECRET_KEY);

describe('meal management api', () => {
    const headers = {'Authorization':'Bearer '+token, 
        'Content-Type': 'application/json'};

    beforeEach(() => {
        return postgresMock.clearDatabase(); // why is this being returned?
    });

    // eslint-disable-next-line jest/expect-expect
    test('gives error if unauthorized', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 1 }],
        ]);
        
        const wrongTokenHeaders = {'Authorization':'Bearer 123', 
            'Content-Type': 'application/json'};
        await request(app)
            .put('/api/meals/delete/1')
            .set(wrongTokenHeaders)
            .expect(401)
            .expect('Unauthorized');

    });

    // eslint-disable-next-line jest/expect-expect
    test('gives error if user is not the owner of the meal',async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2 }],
        ]);

        await request(app)
            .put('/api/meals/delete/2')
            .send({ mealName: 'pasta' })
            .set(headers)
            .expect(401)
            .expect('Unauthorized');
    });

    // eslint-disable-next-line jest/expect-expect
    test('gives error if database did not update',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}],
                { count: 0 }
            ]);

            await request(app)
                .put('/api/meals/delete/1')
                .set(headers)
                .expect(500)
                .expect({ errorMessage: 'Meal deletion failed'});
        });

    // eslint-disable-next-line jest/expect-expect
    test('sets meal to inactive if authorized and user is meal owner',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}],
                { count: 1 }
            ]);

            await request(app)
                .put('/api/meals/delete/1')
                .set(headers)
                .expect(200)
                .expect('"Meal deleted"');
        });
    
    // eslint-disable-next-line jest/expect-expect
    test('fetches meal information correctly to update meal page',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}],
                [{
                    name: 'test',
                    meal_description: 'test',
                    meal_allergens: 'gluten, lactose',
                    price: 100,
                    ingredients:
                    '[{"ingredientId":"11049","category":"",\
                    "ingredient":"Banaani kuorittu","weight":"1"}]'
                }],
            ]);

            await request(app)
                .post('/api/meals/meal/1')
                .set(headers)
                .expect(200)
                .expect({
                    name: 'test',
                    meal_description: 'test',
                    meal_allergens: 'gluten, lactose',
                    price: 100,
                    ingredients: [{
                        ingredientId: '11049', category: '',
                        ingredient: 'Banaani kuorittu', weight: '1' 
                    }]
                });
        });
    
    // eslint-disable-next-line jest/expect-expect
    test('gives error when trying to edit meal if \
        restaurant user is not meal owner',
    async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2}],
        ]);

        await request(app)
            .post('/api/meals/meal/1')
            .set(headers)
            .expect(401)
            .expect('"Unauthorized"');
    });

    // eslint-disable-next-line jest/expect-expect
    test('gives error when trying to edit meal if wrong user token',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}],
            ]);

            const wrongTokenHeaders = {'Authorization':'Bearer 123', 
                'Content-Type': 'application/json'};
            await request(app)
                .post('/api/meals/meal/1')
                .set(wrongTokenHeaders)
                .expect(401)
                .expect('"Unauthorized"');
        });

    // eslint-disable-next-line jest/expect-expect
    test('updates meal if authorized and restaurant user is owner of the meal',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}],
                { count: 1 }
            ]);

            await request(app)
                .put('/api/meals/update/1')
                .send({ mealName: 'banana', mealDescription: 'good banana',
                    mealAllergenString: 'gluten, dairy', ingredients: [{
                        mealId: '1', category: 'starches',
                        ingredient: 'Banaani kuorittu', weight: '150'
                    }], formattedPrice: '12,30'
                })
                .set(headers)
                .expect(200);
        });
    
    // eslint-disable-next-line jest/expect-expect
    test('gives error after submitting edited meal if not authorized',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 2}],
                { count: 1 }
            ]);

            const wrongTokenHeaders = {'Authorization':'Bearer 123', 
                'Content-Type': 'application/json'};

            await request(app)
                .put('/api/meals/update/1')
                .send({ mealName: 'banana', mealDescription: 'good banana',
                    mealAllergenString: 'gluten, dairy', ingredients: [{
                        mealId: '1', category: 'starches',
                        ingredient: 'Banaani kuorittu', weight: '150'
                    }], formattedPrice: '12,30'
                })
                .set(wrongTokenHeaders)
                .expect(401)
                .expect('"Unauthorized"');
        });
    
    // eslint-disable-next-line jest/expect-expect
    test('gives error if error occured while updating meal in database',
        async () => {
            postgresMock.setSqlResults([
                [{ restaurant_id: 1}],
                { count: 0 }
            ]);

            await request(app)
                .put('/api/meals/update/1')
                .send({ mealName: 'banana', mealDescription: 'good banana',
                    mealAllergenString: 'gluten, dairy', ingredients: [{
                        mealId: '1', category: 'starches',
                        ingredient: 'Banaani kuorittu', weight: '150'
                    }], formattedPrice: '12,30'
                })
                .set(headers)
                .expect(500)
                .expect('meal update failed');
        });
});