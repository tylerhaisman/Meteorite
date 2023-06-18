require('dotenv').config();
const { Pool } = require('pg');

// Creating a connection
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString});
  pool.connect((error: string) => {
    if(error){
        return error;
    }
  })
module.exports = pool;