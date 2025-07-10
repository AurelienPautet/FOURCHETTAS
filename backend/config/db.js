import { Client } from "pg";
import dotenv from "dotenv";

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
  });
}

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err.stack));

console.log("Database client initialized");

function initialQuery() {
  return `

        CREATE TABLE IF NOT EXISTS events (
          	id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            form_closing_date DATE NOT NULL,
            form_closing_time TIME NOT NULL,
            img_url VARCHAR(500) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS dishes (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            event_id INT NOT NULL,
            FOREIGN KEY (event_id) REFERENCES events(id) 
        );`;
}

client
  .query(initialQuery())
  .then(() => console.log("Initial query executed successfully"))
  .catch((err) => console.error("Error executing initial query", err.stack));

export default client;
