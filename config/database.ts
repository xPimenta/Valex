import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionsConfig: any = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/postgres',
});

if (process.env.MODE === 'PROD') {
  connectionsConfig.ssl = {
    rejectUnauthorized: false,
  }
}

const db = connectionsConfig;
export default db;