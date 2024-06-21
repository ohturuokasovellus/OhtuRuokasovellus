/* eslint-disable camelcase */
/* eslint-disable jest/expect-expect */
const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line jest/no-mocks-import
const postgresMock = require('../__mocks__/postgres');
const { createToken } = require('../services/authorization');

describe('user dashboard api', () => {
    afterEach(() => {
        postgresMock.clearDatabase();
    });

    test('returns 401 if not authorised', async () => {
        await request(app)
            .get('/api/user/dashboard')
            .expect(401)
            .expect('unauthorized');

        expect(postgresMock.runSqlCommands().length).toBe(0);
    });

    test('returns 500 if failed to fetch year of birth', async () => {
        postgresMock.setSqlResults([
            null,
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(500)
            .expect('error fetching birthyear/gender');

        expect(postgresMock.runSqlCommands().length).toBe(1);
    });

    test('returns 500 if failed to fetch gender', async () => {
        postgresMock.setSqlResults([
            [{decrypted_birth_year: '2000'}],
            null,
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(500)
            .expect('error fetching birthyear/gender');

        expect(postgresMock.runSqlCommands().length).toBe(2);
    });

    test('returns 500 if failed to fetch avg co2 by all users', async () => {
        postgresMock.setSqlResults([
            [{decrypted_birth_year: '2000'}],
            [{gender: 'man'}],
            new Error('db error'),
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(500)
            .expect('error fetching avg co2 emissions');

        expect(postgresMock.runSqlCommands().length).toBe(3);
    });

    test('returns 500 if failed to fetch avg co2 by singular user',
        async () => {
            postgresMock.setSqlResults([
                [{decrypted_birth_year: '2000'}],
                [{gender: 'man'}],
                [{avg_co2_emissions: 100}],
                new Error('db error')
            ]);
            await request(app)
                .get('/api/user/dashboard')
                .set('Authorization', `Bearer ${createToken('test', 1)}`)
                .expect(500)
                .expect('error fetching avg co2 emissions by user');
    
            expect(postgresMock.runSqlCommands().length).toBe(4);
        });

    test('returns 500 if failed to fetch avg co2 by gender', async () => {
        postgresMock.setSqlResults([
            [{decrypted_birth_year: '2000'}],
            [{gender: 'man'}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            new Error('db error')
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(500)
            .expect('error fetching avg co2 emissions by gender');

        expect(postgresMock.runSqlCommands().length).toBe(5);
    });

    test('returns 500 if failed to fetch avg co2 by age group', async () => {
        postgresMock.setSqlResults([
            [{decrypted_birth_year: '2000'}],
            [{gender: 'man'}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            new Error('db error')
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(500)
            .expect('error fetching avg co2 emissions by age group');

        expect(postgresMock.runSqlCommands().length).toBe(6);
    });

    test('returns 500 if failed to fetch avg macros',
        async () => {
            postgresMock.setSqlResults([
                [{decrypted_birth_year: '2000'}],
                [{gender: 'man'}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                new Error('db error')
            ]);
            await request(app)
                .get('/api/user/dashboard')
                .set('Authorization', `Bearer ${createToken('test', 1)}`)
                .expect(500)
                .expect('error fetching avg macros');

            expect(postgresMock.runSqlCommands().length).toBe(7);
        });

    test('returns 500 if failed to fetch avg macros by singular user',
        async () => {
            postgresMock.setSqlResults([
                [{decrypted_birth_year: '2000'}],
                [{gender: 'man'}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{
                    avg_carbohydrates: 100,
                    avg_fat: 100,
                    avg_protein: 100
                }],
                new Error('db error'),
            ]);
            await request(app)
                .get('/api/user/dashboard')
                .set('Authorization', `Bearer ${createToken('test', 1)}`)
                .expect(500)
                .expect('error fetching avg macros by user');

            expect(postgresMock.runSqlCommands().length).toBe(8);
        });

    test('returns 500 if failed to fetch avg macros by gender',
        async () => {
            postgresMock.setSqlResults([
                [{decrypted_birth_year: '2000'}],
                [{gender: 'man'}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{avg_co2_emissions: 100}],
                [{
                    avg_carbohydrates: 100,
                    avg_fat: 100,
                    avg_protein: 100
                }],
                [{
                    avg_carbohydrates: 100,
                    avg_fat: 100,
                    avg_protein: 100
                }],
                new Error('db error'),
            ]);
            await request(app)
                .get('/api/user/dashboard')
                .set('Authorization', `Bearer ${createToken('test', 1)}`)
                .expect(500)
                .expect('error fetching avg macros by gender');

            expect(postgresMock.runSqlCommands().length).toBe(9);
        });

    test('returns 500 if failed to fetch avg macros by age group', async () => {
        postgresMock.setSqlResults([
            [{decrypted_birth_year: '2000'}],
            [{gender: 'man'}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
            new Error('db error'),
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(500)
            .expect('error fetching avg macros by age group');

        expect(postgresMock.runSqlCommands().length).toBe(10);
    });

    test('returns correct data', async () => {
        postgresMock.setSqlResults([
            [{decrypted_birth_year: '1958'}],
            [{decrypted_gender: 'man'}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{avg_co2_emissions: 100}],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
            [{
                avg_carbohydrates: 100,
                avg_fat: 100,
                avg_protein: 100
            }],
        ]);
        await request(app)
            .get('/api/user/dashboard')
            .set('Authorization', `Bearer ${createToken('test', 1)}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            .expect({
                ageGroup: '65+',
                gender: 'man',
                averages: {
                    all: {co2: 100, carbs: 100, fat: 100, protein: 100},
                    user: {co2: 100, carbs: 100, fat: 100, protein: 100},
                    gender: {co2: 100, carbs: 100, fat: 100, protein: 100},
                    age: {co2: 100, carbs: 100, fat: 100, protein: 100},
                }
            });

        expect(postgresMock.runSqlCommands().length).toBe(10);
    });

});
