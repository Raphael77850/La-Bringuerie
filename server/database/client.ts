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
  // Railway auto-generated variables
  DATABASE_URL,
  MYSQL_URL,
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

console.info("\nAuto-generated URLs:");
console.info("DATABASE_URL:", DATABASE_URL ? "***SET***" : "NOT_SET");
console.info("MYSQL_URL:", MYSQL_URL ? "***SET***" : "NOT_SET");

console.info("\nUsing configuration:");

// Create a connection pool to the database
import mysql from "mysql2/promise";

let client: mysql.Pool;

// Priorité 1: Utiliser DATABASE_URL ou MYSQL_URL si disponible
if (DATABASE_URL || MYSQL_URL) {
  console.info("Using Railway auto-generated URL connection");

  client = mysql.createPool({
    uri: DATABASE_URL || MYSQL_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  // Priorité 2: Configuration manuelle
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
  console.info(
    "Final password:",
    finalConfig.password ? "***SET***" : "NOT_SET",
  );
  console.info("Final database:", finalConfig.database);

  // Emergency: Si les variables Railway ne sont pas configurées, utiliser les variables Railway Provider
  if (!MYSQLPASSWORD && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️ MYSQLPASSWORD not set, checking Railway Provider variables...",
    );
    finalConfig.password = process.env.MYSQL_ROOT_PASSWORD || DB_PASSWORD;
    console.info(
      "Using MYSQL_ROOT_PASSWORD:",
      finalConfig.password ? "***SET***" : "NOT_SET",
    );
  }

  console.info("=====================================");

  client = mysql.createPool({
    ...finalConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

// Export unique
export default client;

// Types export
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type DatabaseClient = Pool;
type Result = ResultSetHeader;
type Rows = RowDataPacket[];

export type { DatabaseClient, Result, Rows };
