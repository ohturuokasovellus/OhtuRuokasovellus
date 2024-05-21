
// The code of this file mocks `postgres` module.
// This allows us to run tests on API without having a real database running.
// See documentation/databaseMock.md for more information.

/**
 * Array of SQL commands that have been executed with postgres mock.
 * First item was executed first.
 * @type {{ sql: string, values: any[] }[]}
 */
let runSqlCommands = [];

/**
 * Array of results that postgres mock will return.
 * First item is responded first.
 * @type {any[]}
 */
let sqlResults = [];

/**
 * @param {any[]} newResults The values that postgres mock
 * will return for queries.
 */
const setSqlResults = newResults => {
    sqlResults = newResults;
};

/**
 * Resets the mock database to its initial state.
 */
const clearDatabase = () => {
    runSqlCommands = [];
    sqlResults = [];
};

/**
 * Mocks the default behavior of `postgres` module.
 * @returns {(sql: string[], values: any[]) => any}
 *  Function that mocks a database query.
 *  This function should be used as a tagged template string.
 */
const connect = () => {
    // this `connect` function could take the connection url as an argument
    // but we don't need the connectionUrl here
    // because we are not really connecting to a database

    /**
     * Execute a database query. Use this function as a tagged template string.
     * @param {string[]} sql The SQL command to be run.
     * @param {any[]} values Parameters that are passed to the SQL command.
     * @returns {any} The result of the mock database query.
     */
    return (sql, ...values) => {
        runSqlCommands.push({ sql, values });
        return sqlResults.shift();
    };
};

module.exports = connect;

module.exports.setSqlResults = setSqlResults;

/**
 * @returns {{ sql: string, values: any[] }[]} Array of commands
 *  that have been executed by the mock.
 */
module.exports.runSqlCommands = () => runSqlCommands;

module.exports.clearDatabase = clearDatabase;
