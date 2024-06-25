/* eslint-disable camelcase */
require('dotenv').config();
const { sql } = require('../database');

/**
 * @param {string} urlName
 * @returns {Promise<string>} url as a string
 */
const getUrl = async (urlName) => {
    const result = await sql`
        SELECT url FROM urls WHERE name = ${urlName};
    `;
    return result;
};

/**
 * @param {string} urlName
 * @param {string} newUrl
 * @returns {Promise<Boolean>} true if success
 */
const changeUrl = async (urlName, newUrl) => {
    const result = await sql`
        UPDATE urls SET url = ${newUrl} WHERE name = ${urlName};
    `;
    return result.count === 1;
};

module.exports = {
    sql,
    getUrl,
    changeUrl
};