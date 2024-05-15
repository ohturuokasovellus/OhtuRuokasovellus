const postgres = require('postgres')

//const sql = postgres('postgres://username:password@host:port/database', {
//  host: process.env.POSTGRES_IP,             // Postgres ip address[s] or domain name[s]
//  port: 5432,                                // Postgres server port[s]
//  database: process.env.POSTGRES_DB_NAME,    // Name of database to connect to
//  username: process.env.POSTGRES_USERNAME,   // Username of database user
//  password: process.env.POSTGRES_PASSWORD,   // Password of database user
//})

const sql = postgres(process.env.BACKEND_POSTGRES_URL)

const insertUser = async (username, passwordHash) => {
  await sql`
    INSERT INTO users (user_name, password_hash)
    VALUES (${username}, ${passwordHash})
  `
}

/**
 * @param {string} username 
 * @returns {boolean} Whether the given username already exists in the database.
 */
const doesUsernameExist = async username => {
  // https://stackoverflow.com/q/8149596
  const result = await sql`
    SELECT exists (SELECT 1 FROM users WHERE user_name = ${username} LIMIT 1);
  `
  console.log(result.at(0).exists)
  return result.at(0).exists
}

module.exports = {
  sql,
  insertUser,
  doesUsernameExist,
}
