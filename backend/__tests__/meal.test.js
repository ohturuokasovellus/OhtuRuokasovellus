/* eslint-disable camelcase */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

const token = jwt.sign({ username: 'moi', userId: 1, restaurantId: 2 },
    process.env.SECRET_KEY);

describe('meal api', () => {
    const headers = {'Authorization':'Bearer '+token, 
        'Content-Type': 'application/json'};

    beforeEach(() => {
        return postgresMock.clearDatabase(); // why is this being returned?
    });

    test('new meal is saved to the database', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2 }],
            [{ meal_id: 1234 }],
            { count: 1 },
        ]);
        
        const response = await request(app)
            .post('/api/meals')
            .send({ mealName: 'pasta', mealDescription: 'good pasta',
                mealAllergenString: 'Gluten, Dairy', ingredients: [{
                    ingredientId: '1', category: 'starches', 
                    ingredient: 'wheat', weight: '150'
                }], formattedPrice: '12,30'
            })
            .set(headers)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body.mealId).toBe(1234);

        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
        await request(app)
            .post('/api/meals/images/1234')
            .send(imageData)
            .set('Content-Type', 'image/jpeg')
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(3);
    });

    test('meal creation fails with missing name', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2 }], // eslint-disable-line 
        ]);

        await request(app)
            .post('/api/meals')
            .send({ name: 'this key should actually be mealName' })
            .set(headers)
            .expect(400)
            .expect('invalid meal name');

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('meal image creation fails with invalid meal id', async () => {
        postgresMock.setSqlResults([
            { count: 0 },
        ]);

        // meal (with id 1234) was not created before trying to add the image
        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdG';
        await request(app)
            .post('/api/meals/images/1234')
            .send(imageData)
            .set('Content-Type', 'image/jpeg')
            .expect(404)
            .expect('meal not found');

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    // eslint-disable-next-line jest/expect-expect
    test('restaurant meals can be fetched', async () => {
        postgresMock.setSqlResults([
            [
                { name: 'pasta' },
            ],
        ]);

        await request(app)
            .get('/api/meals/1')
            .expect(200)
            .expect([
                { name: 'pasta' },
            ]);
    });

    test('meal image can be fetched in correct format', async () => {
        postgresMock.setSqlResults([[{
            image: {
                type: 'Buffer',
                data: [1, 2, 3, 4, 5, 6]
            }
        }]]);

        const res = await request(app).get('/api/meals/images/1');
        expect(res.header['content-type']).toMatch(/^image\/jpeg/);
    });

    test('meal image fetching fails if no image data', async () => {
        postgresMock.setSqlResults([[]]);

        const res = await request(app).get('/api/meals/images/2');
        expect(res.status).toBe(404);
    });

    test('emissions are fetched correctly', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2, co2_emissions: 123714308 }],
        ]);

        await request(app)
            .get('/api/all-meal-emissions/')
            .set(headers)
            .expect(200)
            .expect(
                {'emissions': [{ restaurant_id: 2, co2_emissions: 123714308 }],
                    'restaurantId': 2});

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });
});
