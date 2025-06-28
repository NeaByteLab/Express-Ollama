require('dotenv').config()

const db = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 1,
    max: 10,
    acquireTimeoutMillis: 10000,
    createTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    propagateCreateError: false
  }
})

/**
 * Export Module
 */
module.exports = db