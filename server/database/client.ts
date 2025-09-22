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

// Create a connection pool to the database
import mysql from "mysql2/promise";

let client: mysql.Pool;

// Priorité 1: Utiliser DATABASE_URL ou MYSQL_URL si disponible
if (DATABASE_URL || MYSQL_URL) {
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

  // Emergency: Si les variables Railway ne sont pas configurées, utiliser les variables Railway Provider
  if (!MYSQLPASSWORD && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️ MYSQLPASSWORD not set, checking Railway Provider variables...",
    );
    finalConfig.password = process.env.MYSQL_ROOT_PASSWORD || DB_PASSWORD;
  }

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
