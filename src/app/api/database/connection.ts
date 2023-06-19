import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({ connectionString });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      console.log("Connected to database!");
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async closeConnection(): Promise<void> {
    await this.pool.end();
  }
}

export default Database;




// require('dotenv').config();
// const { Pool } = require('pg');
// const connectionString = process.env.DATABASE_URL;

// // Creating a connection
// const pool = new Pool({ connectionString });
// pool.connect((error: string) => {
//   if (error) {
//     return error;
//   }
//   console.log("Connected to database!")
// })

// module.exports = pool;