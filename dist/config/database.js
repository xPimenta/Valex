import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
var Pool = pg.Pool;
var devConfig = { connectionString: process.env.DEV_DATABASE_URL };
var prodConfig = { connectionString: process.env.DATABASE_URL, ssl: {} };
if (process.env.MODE === "PROD") {
    prodConfig.ssl = {
        rejectUnauthorized: false
    };
}
var db = new Pool(process.env.MODE === "PROD" ? prodConfig : devConfig);
export default db;
