# Postgres Mock

Normally we use the `postgres` module as follows:

```javascript
const postgres = require('postgres')
const sql = postgres('connection_string_here')
const username = 'username_here'
const hash = 'hash_here'
await sql`
  SELECT * FROM users WHERE user_name = ${username} AND password_hash = ${hash} LIMIT 1;
`
```

In here the `postgres` is a function that takes connection string as argument and returns a function.
This `sql` function is a [tagged template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
that allows us to execute SQL commands.
The first parameter that it receives is an array of the hard-coded SQL command parts,
and the following parameters are the values passed with `${...}` notation.
For example, the code above would pass the following three parameters:

```
[
  "SELECT * FROM users WHERE user_name = ",
  " AND password_hash = ",
  " LIMIT 1;"
],
"username_here",
"hash_here"
```

With this info, we can mock the behavior of `postgres` module in [`backend/__mocks__/postgres.js`](../backend/__mocks__/postgres.js).
In tests, after importing the file as

```javascript
const postgresMock = require('./path/to/__mocks__/postgres')
```

you can get the commands that the API ran with

```javascript
postgresMock.runSqlCommands()
```

This returns an array where each item represents one database query.

Before the test, you can also set the values that database queries should return.
This can be done with

```javascript
postgresMock.setSqlResults([
  { user_name: 'example', email: 'a@example.com' }
])
```

The only argument contains an array of returns values.
The first item will be returned during the first database query, etc.

If multiple tests use database, the initial state of the database can be restored before each test with

```javascript
postgresMock.clearDatabase()
```
