const { isValidPassword, isValidEmail } = require('../../src/utils/validators');

describe('validator', () => {
    describe('password', () => {
        test('validation succeeds with a valid password', () => {
            expect(isValidPassword('thisISvalidpas$w0rd')).toBe(true);
        });

        test('another valid password', () => {
            expect(isValidPassword('h€Ll*-123')).toBe(true);
        });

        test('validation fails with too short password', () => {
            expect(isValidPassword('Sh0rt!!')).toBe(false);
        });

        test('validation fails with too long password', () => {
            const password = 'L0ng!l0ng!l0ng!l0ng!l0ng!l0ng!l0n';
            expect(isValidPassword(password)).toBe(false);
        });

        test('validation fails with no digits', () => {
            expect(isValidPassword('no-Digits-h€re')).toBe(false);
        });

        test('validation fails with no special character', () => {
            expect(isValidPassword('no-Special-here')).toBe(false);
        });

        test('validation fails with no lowercase character', () => {
            expect(isValidPassword('N0-LOWERCASE-HERE')).toBe(false);
        });

        test('validation fails with no uppercase character', () => {
            expect(isValidPassword('n0-uppercase-here')).toBe(false);
        });
    });

    describe('email', () => {
        // https://en.wikipedia.org/wiki/Email_address#Local-part

        test('validation succeeds with a valid address', () => {
            const email = 'aB12!#^~+*_hello.world@sub.example-domain123.com';
            expect(isValidEmail(email)).toBe(true);
        });

        test('validation fails with leading at', () => {
            expect(isValidEmail('@example.com')).toBe(false);
        });

        test('validation fails with multiple at', () => {
            expect(isValidEmail('hello@test@example.com')).toBe(false);
        });

        test('validation fails with whitespace', () => {
            expect(isValidEmail('hello world@example.com')).toBe(false);
        });
    });
});
