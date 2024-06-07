const { createHash, timingSafeEqual } = require('node:crypto');

/**
 * @param {string} content UTF-8 text to be hashed.
 * @returns Hex digest of the SHA-256 hash of the content.
 */
const hash = content => {
    // https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
    return createHash('sha256').update(content).digest('hex');
};

/**
 * Securely compares the two hashes.
 * @param {string} hash1 The first hash hex digest to compare.
 * @param {string} hash2 The second hash hex digest to compare.
 * @returns {boolean} Whether the two hashes equal.
 */
const compareHashes = (hash1, hash2) => {
    const buffer1 = Buffer.from(hash1);
    const buffer2 = Buffer.from(hash2);
    try {
        return timingSafeEqual(buffer1, buffer2);
    } catch {
        // if hashes do not have the same length,
        // timingSafeEqual throws an error
        return false;
    }
};

module.exports = {
    hash,
    compareHashes,
};
