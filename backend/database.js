require('dotenv').config();
const postgres = require('postgres');

//const sql = postgres('postgres://username:password@host:port/database', {
//  host: process.env.POSTGRES_IP, // Postgres ip address[s] or domain name[s]
//  port: 5432,                                // Postgres server port[s]
//  database: process.env.POSTGRES_DB_NAME,    // Name of database to connect to
//  username: process.env.POSTGRES_USERNAME,   // Username of database user
//  password: process.env.POSTGRES_PASSWORD,   // Password of database user
//})

const sql = postgres(process.env.E2ETEST == '1' ?
    process.env.E2ETEST_POSTGRES_URL :
    process.env.BACKEND_POSTGRES_URL);

const insertUser = async (username, password, email) => {
    await sql`
        INSERT INTO users (username, password, email)
        VALUES (${username}, ${password}, ${email})
    `;
};

const getUser = async (username, password) => {
    const result = await sql`
        SELECT * FROM users
        WHERE username = ${username} and password = ${password};
    `;
    return result[0];
};

/**
 * @param {string} username 
 * @returns {Promise<boolean>} Whether the given 
 * username already exists in the database.
 */
const doesUsernameExist = async username => {
    // https://stackoverflow.com/q/8149596
    const result = await sql`
        SELECT exists
        (SELECT 1 FROM users WHERE username = ${username} LIMIT 1);
    `;
    return result.at(0).exists;
};

/**
 * @param {string} email 
 * @returns {Promise<boolean>} Whether the given email
 *  already exists in the database.
 */
const doesEmailExist = async email => {
    const result = await sql`
        SELECT exists (SELECT 1 FROM users WHERE email = ${email} LIMIT 1);
    `;
    return result.at(0).exists;
};

/**
 * Insert a new meal to the database.
 * @param {string} name Name of the meal.
 * @param {string} image Data of the image of the meal.
 */
const insertMeal = async (name, image) => {
    // TODO: add another parameter for the restaurant id
    await sql`
        INSERT INTO meals (name, image, restaurant)
        VALUES (${name}, ${image}, 1);
    `;
};

/**
 * Fetch all meals from the database.
 * @returns {Promise<{ name: string, image: string }[]>}
 */
const getMeals = async () => {
    // TODO: add parameter for the restaurant id
    //       and filter the results with that
    const result = await sql`
        SELECT name, image FROM meals WHERE restaurant = 1;
    `;
    return result;
};

module.exports = {
    sql,
    insertUser,
    doesUsernameExist,
    getUser,
    doesEmailExist,
    insertMeal,
    getMeals,
};
