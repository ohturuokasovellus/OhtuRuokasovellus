const { hash, compareHashes } = require('../services/hash');

// hash of "hello world" computed with an online tool
const digest =
    'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';

describe('hash', () => {
    test('hashing outputs expected digest', () => {
        expect(hash('hello world')).toBe(digest);
    });

    test('identical hashes equal', () => {
        expect(compareHashes(digest, digest)).toBe(true);
    });

    test('hashes with different lengths do not equal', () => {
        // remove the first character
        const digest2 = digest.substring(1);
        expect(compareHashes(digest, digest2)).toBe(false);
    });

    test('differing hashes do not equal', () => {
        // change the first character
        const digest2 = 'a' + digest.substring(1);
        expect(compareHashes(digest, digest2)).toBe(false);
    });
});
