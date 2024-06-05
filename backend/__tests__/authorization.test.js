const { createToken, verifyToken } = require('../services/authorization');

describe('authorization token', () => {
    beforeEach(() => {
        process.env.SECRET_KEY = 'randomsecret';
    });

    test('created token is valid', () => {
        const token = createToken('johndoe', 42);
        const userInfo = verifyToken(`Bearer ${token}`);
        expect(userInfo).not.toBe(null);
        expect(userInfo.username).toBe('johndoe');
        expect(userInfo.userId).toBe(42);
    });

    test('modified token is invalid', () => {
        // remove the first character from the token
        const token = createToken('johndoe', 42).substring(1);
        const userInfo = verifyToken(`Bearer ${token}`);
        expect(userInfo).toBe(null);
    });

    test('valid token becomes invalid if secret key changes', () => {
        const token = createToken('johndoe', 42);
        process.env.SECRET_KEY = 'somethingelse';
        const userInfo = verifyToken(`Bearer ${token}`);
        expect(userInfo).toBe(null);
    });
});
