/* eslint-disable camelcase */
require('dotenv').config();
const postgres = require('postgres');

//const sql = postgres('postgres://username:password@host:port/database', {
//  host: process.env.POSTGRES_IP, // Postgres ip address[s] or domain name[s]
//  port: 5432,                                // Postgres server port[s]
//  database: process.env.POSTGRES_DB_NAME,    // Name of database to connect to
//  username: process.env.POSTGRES_USERNAME,   // Username of database user
//  password: process.env.POSTGRES_PASSWORD,   // Password of database user
//})

const databaseURL = process.env.E2ETEST == '1' ?
    process.env.E2ETEST_POSTGRES_URL : process.env.BACKEND_POSTGRES_URL;

// Our databases for workflows do not support many connectios
// so we have to limit them here
const sql = postgres(databaseURL, 
    { max: process.env.E2ETEST == '1' ? 1 : 10 }
);

module.exports = { sql };
