const { createHash } = require('node:crypto');

/**
 * @param {string} content UTF-8 text to be hashed.
 * @returns Hex digest of the SHA-256 hash of the content.
 */
const hash = content => {
    // https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
    return createHash('sha256').update(content).digest('hex');
};

module.exports = {
    hash,
};
