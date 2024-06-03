const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

const token = jwt.sign({ username: 'moi', userId: 1 },
    process.env.SECRET_KEY);

describe('meal api', () => {
    const headers = {'Authorization':'Bearer '+token, 
        'Content-Type': 'application/json'};

    beforeEach(() => {
        return postgresMock.clearDatabase(); // why is this being returned?
    });

    test('new meal is saved to the database', async () => {
        postgresMock.setSqlResults([
            [{ restaurant_id: 2 }], // eslint-disable-line camelcase
            [{ meal_id: 1234 }], // eslint-disable-line camelcase
            { count: 1 },
        ]);
        
        const response = await request(app)
            .post('/api/meals')
            .send({ mealName: 'pasta' })
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
            [{ restaurant_id: 2 }], // eslint-disable-line camelcase
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

    // eslint-disable-next-line jest/expect-expect
    test('system gives error if no meals found', async () => {
        postgresMock.setSqlResults([[]]);

        await request(app)
            .get('/api/meals/2')
            .expect(404)
            .expect('"Page not found"');
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
});
