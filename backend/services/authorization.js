const jwt = require('jsonwebtoken');

/**
 * Create a JSON web token with given information.
 * @param {string} username Username of the user being logged in.
 * @param {number} userId User ID of the user being logged in.
 * @param {number} restaurantId restaurantId of the logged user.
 * @returns {string} Encrypted JWT token ready to be sent to frontend.
 */
const createToken = (username, userId, restaurantId) => {
    const tokenContent = {
        username: username, userId: userId, restaurantId: restaurantId 
    };
    return jwt.sign(tokenContent, process.env.SECRET_KEY);
};

/**
 * Verify the user session with authorization header of the given request.
 * @param {string | undefined} authorizationHeader The `Authorization` header
 *  of the incoming request.
 * @returns {{ username: string, userId: number, restaurantId: number }?}
 *  The information of the user if available.
 */
const verifyToken = authorizationHeader => {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authorizationHeader.substring('Bearer '.length);
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch {
        // jwt throws JsonWebTokenError if the token is invalid
        return null;
    }
};

module.exports = {
    createToken,
    verifyToken,
};
