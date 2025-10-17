import { Client } from "pg";
import dotenv from "dotenv";
import initialQuery from "./initialQuery.js";
import { migrateDatabase } from "./migrate.js";

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

let client;
//console.log(process.env.DATABASE_URL, "DATABASE_URL");
if (process.env.DATABASE_URL == undefined) {
  console.log("Using local db");
  client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
} else {
  console.log("Using heroku db");
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
}

export default client;

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err.stack));

console.log("Database client initialized");

/*
client
  .query(initialQuery())
  .then(() => console.log("Initial query executed successfully"))
  .catch((err) => console.error("Error executing initial query", err.stack));
*/
