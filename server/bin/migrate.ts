// Load environment variables from .env file
import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

// Build the path to the schema SQL file
const schema = path.join(__dirname, "../../server/database/schema.sql");

// Get database connection details from .env file (Railway compatible)
const { 
  DB_HOST, 
  DB_PORT, 
  DB_USER, 
  DB_PASSWORD, 
  DB_NAME,
  // Railway variables
  MYSQLHOST,
  MYSQLPORT, 
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLDATABASE
} = process.env;

// Use Railway variables if available, fallback to custom
const host = MYSQLHOST || DB_HOST;
const port = MYSQLPORT || DB_PORT;
const user = MYSQLUSER || DB_USER;
const password = MYSQLPASSWORD || DB_PASSWORD;
const database = MYSQLDATABASE || DB_NAME;

// Update the database schema
import mysql from "mysql2/promise";

const migrate = async () => {
  try {
    // Read the SQL statements from the schema file
    const sql = fs.readFileSync(schema, "utf8");

    // Create a specific connection to the database
    const connection = await mysql.createConnection({
      host,
      port: Number(port),
      user,
      password,
      multipleStatements: true, // Allow multiple SQL statements
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);

    // Switch to the database
    await connection.query(`USE \`${database}\``);

    // Execute the SQL statements to update the database schema
    await connection.query(sql);

    // Close the database connection
    await connection.end();

    console.info(`✅ Database ${database} updated from schema.sql`);
  } catch (err) {
    const { message, stack } = err as Error;
    console.error("Error updating the database:", message, stack);
  }
};

// Run the migration function
migrate();
