
/**
 * Generate a random integer in the given range.
 * @param {number} min Smallest possible returned value. Must be an integer.
 * @param {number} max One greather than the largest possible return value.
 *  Must be an integer.
 * @returns {number} Such integer `p` that `min <= p < max`.
 */
const randomInt = (min, max) => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
    return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Generate a random purchase code.
 * @returns {string} String with length of 8 characters consisting of lowercase
 *  letters a-z and numbers 0-9.
 */
const generatePurchaseCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const resultLength = 8;
    let result = '';
    for (let i=0; i<resultLength; i++) {
        result += chars[randomInt(0, chars.length)];
    }
    return result;
};

module.exports = {
    generatePurchaseCode,
};
