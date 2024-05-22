const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('meal api', () => {
    beforeEach(() => {
        return postgresMock.clearDatabase();
    });

    test('new meal is saved to the database', async () => {
        postgresMock.setSqlResults([
            [{ meal_id: 3141 }],
        ]);

        const response = await request(app)
            .post('/api/meals')
            .send({ mealName: 'pasta' })
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body.mealId).toBe(3141);

        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
        await request(app)
            .post('/api/meals/images/3141')
            .send(imageData)
            .set('Content-Type', 'image/jpeg')
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(2);
    });

    test('meal creation fails with missing name', async () => {
        await request(app)
            .post('/api/meals')
            .send({ name: 'this key should actually be mealName' })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('invalid meal name');

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    // test('meal image creation fails with invalid meal id', async () => {
    //     // meal (with id 1234) was not created before trying to add the image
    //     const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
    //     await request(app)
    //         .post('/api/meals/images/1234')
    //         .send(imageData)
    //         .set('Content-Type', 'image/jpeg')
    //         .expect(404)
    //         .expect('meal not found');

    //     expect(postgresMock.runSqlCommands().length).toBe(1);
    // });

    /*test('meals can be fetched', async () => {
        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
        postgresMock.setSqlResults([
            [
                { name: 'pasta', image: Buffer.from(imageData) },
            ],
            [
                { image: Buffer.from(imageData) },
            ],
        ]);

        await request(app)
            .get('/api/meals')
            .expect(200)
            .expect([
                { name: 'pasta', image: imageData }},
            ]);

        expect(postgresMock.runSqlCommands().length).toBe(1);

        await request(app)
            .get('/api/meals/images/1')
            .expect(200)
            .expect(imageData);

        expect(postgresMock.runSqlCommands().length).toBe(2);
    });*/
});
