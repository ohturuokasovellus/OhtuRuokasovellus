const { hash } = require('../services/hash');

describe('hash', () => {
    test('hashing outputs expected digest', () => {
        // the correct result computed with an online tool
        const expected =
            'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
        expect(hash('hello world')).toBe(expected);
    });
});
