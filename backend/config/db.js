import { Pool } from "pg";
import dotenv from "dotenv";
import initialQuery from "./initialQuery.js";
import { migrateDatabase } from "./migrate.js";

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

let pool;

if (process.env.DATABASE_URL == undefined) {
  console.log("Using local db");
  pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} else {
  console.log("Using production db");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  });
  pool.query(initialQuery());
}

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err.stack));

// Run initial query to set up tables if they don't exist

console.log("Database pool initialized");

export default pool;
