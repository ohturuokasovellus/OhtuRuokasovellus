const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

const table = 'psql -U postgres -d postgres -a -f schema.sql'

pgclient.query(table, (err, res) => {
    if (err) throw err
});
