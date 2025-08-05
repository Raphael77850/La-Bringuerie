// Get variables from .env file for database connection
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

// Create a connection pool to the database
import mysql from "mysql2/promise";

const client = mysql.createPool({
  // Priorité aux variables Railway, fallback sur variables custom
  host: MYSQLHOST || DB_HOST,
  port: Number.parseInt((MYSQLPORT || DB_PORT) as string),
  user: MYSQLUSER || DB_USER,
  password: MYSQLPASSWORD || DB_PASSWORD,
  database: MYSQLDATABASE || DB_NAME,
});

// Ready to export
export default client;

// Types export
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type DatabaseClient = Pool;
type Result = ResultSetHeader;
type Rows = RowDataPacket[];

export type { DatabaseClient, Result, Rows };
