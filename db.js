const { Pool } = require('pg')

const client = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CSC',
  password: '1234',
  port: 5433
})


module.exports = client;
