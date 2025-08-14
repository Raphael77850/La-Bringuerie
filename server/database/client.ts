// Get variables from .env file for database connection
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  // Railway variables (priority)
  MYSQLHOST,
  MYSQLPORT,
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLDATABASE,
} = process.env;

// Debug: Log database configuration (masking sensitive data)
console.info("=== DATABASE CONFIGURATION DEBUG ===");
console.info("Railway variables:");
console.info("MYSQLHOST:", MYSQLHOST || "NOT_SET");
console.info("MYSQLPORT:", MYSQLPORT || "NOT_SET");
console.info("MYSQLUSER:", MYSQLUSER || "NOT_SET");
console.info("MYSQLPASSWORD:", MYSQLPASSWORD ? "***SET***" : "NOT_SET");
console.info("MYSQLDATABASE:", MYSQLDATABASE || "NOT_SET");

console.info("\nLocal variables:");
console.info("DB_HOST:", DB_HOST || "NOT_SET");
console.info("DB_PORT:", DB_PORT || "NOT_SET");
console.info("DB_USER:", DB_USER || "NOT_SET");
console.info("DB_PASSWORD:", DB_PASSWORD ? "***SET***" : "NOT_SET");
console.info("DB_NAME:", DB_NAME || "NOT_SET");

console.info("\nUsing configuration:");
const finalConfig = {
  host: MYSQLHOST || DB_HOST,
  port: Number.parseInt((MYSQLPORT || DB_PORT) as string),
  user: MYSQLUSER || DB_USER,
  password: MYSQLPASSWORD || DB_PASSWORD,
  database: MYSQLDATABASE || DB_NAME,
};

console.info("Final host:", finalConfig.host);
console.info("Final port:", finalConfig.port);
console.info("Final user:", finalConfig.user);
console.info("Final password:", finalConfig.password ? "***SET***" : "NOT_SET");
console.info("Final database:", finalConfig.database);
console.info("=====================================");

// Create a connection pool to the database
import mysql from "mysql2/promise";

const client = mysql.createPool({
  ...finalConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ready to export
export default client;

// Types export
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type DatabaseClient = Pool;
type Result = ResultSetHeader;
type Rows = RowDataPacket[];

export type { DatabaseClient, Result, Rows };
