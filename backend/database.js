const postgres = require('postgres')

const sql = postgres({
  host: process.env.POSTGRES_IP,             // Postgres ip address[s] or domain name[s]
  port: 5432,                                // Postgres server port[s]
  database: process.env.POSTGRES_DB_NAME,    // Name of database to connect to
  username: process.env.POSTGRES_USERNAME,   // Username of database user
  password: process.env.POSTGRES_PASSWORD,   // Password of database user
})

const insertUser = async (username, passwordHash) => {
  await sql`
    INSERT INTO users (user_name, password_hash)
    VALUES (${username}, ${passwordHash})
  `
}

module.exports = {
  sql,
  insertUser,
}
