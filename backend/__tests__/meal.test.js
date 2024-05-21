const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('meal api', () => {
    beforeEach(() => {
        return postgresMock.clearDatabase();
    });

    test('new meal is saved to the database', async () => {
        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
        await request(app)
            .post('/api/meals')
            .send({ name: 'pasta', image: imageData })
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('meal creation fails with missing name', async () => {
        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
        await request(app)
            .post('/api/meals')
            .send({ image: imageData })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('invalid name or image');

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('meal creation fails with missing image', async () => {
        await request(app)
            .post('/api/meals')
            .send({ name: 'pasta' })
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('invalid name or image');

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('meals can be fetched', async () => {
        const imageData = 'data:image/jpeg;base64,CNsCSUbjG7PyKI0x1lRkKdONzHG';
        postgresMock.setSqlResults([
            [
                { name: 'pasta', image: imageData },
            ]
        ]);

        await request(app)
            .get('/api/meals')
            .expect(200)
            .expect([
                { name: 'pasta', image: imageData },
            ]);

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });
});
