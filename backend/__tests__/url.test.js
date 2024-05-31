const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');

describe('url api', () => {
    beforeEach(() => {
        return postgresMock.clearDatabase();
    });

    test('url can be fetched with correct parameter', async () => {
        postgresMock.setSqlResults([[
            { url: 'http://test' }
        ]]);

        await request(app)
            .get('/api/url/test')
            .expect(200)
            .expect('http://test');
    });
});