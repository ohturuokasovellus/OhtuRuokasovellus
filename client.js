/*const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

const table = ' -U postgres -d postgres -a -f schema.sql'

pgclient.query(table, (err, res) => {
    if (err) throw err
});
*/

require('dotenv').config();
const postgres = require('postgres');
var filesystem = require('fs');

const sqlCommand = filesystem.readFileSync('schema.sql').toString();
const sql = postgres(process.env.E2ETEST_POSTGRES_URL);

const executeSchema = async () => {
    await sql`${sqlCommand}`;
};

executeSchema();
