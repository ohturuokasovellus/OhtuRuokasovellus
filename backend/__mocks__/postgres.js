
// The code of this file mocks `postgres` module.
// This allows us to run tests on API without having a real database running.

/**
 * Array of SQL commands that have been executed with postgres mock. First item was executed first.
 * @type {{ sql: string, values: any[] }[]}
 */
let runSqlCommands = []

/**
 * Array of results that postgres mock will return. First item is responded first.
 * @type {any[]}
 */
let sqlResults = []

/**
 * @param {any[]} newResults The values that postgres mock will return for queries.
 */
const setSqlResults = newResults => {
  sqlResults = newResults
}

/**
 * Resets the mock database to its initial state.
 */
const clearDatabase = () => {
  runSqlCommands = []
  sqlResults = []
}

/**
 * Mocks the default behavior of `postgres` module.
 * @param {string} connectionUrl The connection string that the app uses to connect to the database.
 * @returns {Function} Function that returns `sqlResult` when called.
 */
const connect = connectionUrl => {
  // we don't really use the connectionUrl here because we are not really connecting to a database

  /**
   * @param {string[]} sql The SQL command to be run
   * @param {any[]} values Parameters that are passed to the SQL command.
   */
  return (sql, ...values) => {
    runSqlCommands.push({ sql, values })
    return sqlResults.shift()
  }
}

module.exports = connect

module.exports.setSqlResults = setSqlResults

module.exports.runSqlCommands = () => runSqlCommands

module.exports.clearDatabase = clearDatabase
