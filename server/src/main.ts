// Load environment variables from .env file
import "dotenv/config";

// Check database connection
// Note: This is optional and can be removed if the database connection
// is not required when starting the application
import "../database/checkConnection";

// Import the Express application from ./app
import app from "./app";

// Export for Vercel serverless (production)
export default app;

// Railway/Production server (utilise PORT de Railway)
const port = process.env.PORT || process.env.APP_PORT || 3310;

console.info("=== SERVER STARTUP DEBUG ===");
console.info("NODE_ENV:", process.env.NODE_ENV || "NOT_SET");
console.info("PORT:", process.env.PORT || "NOT_SET");
console.info("APP_PORT:", process.env.APP_PORT || "NOT_SET");
console.info("Final port:", port);
console.info("==============================");

// Start the server and listen on the specified port
app
  .listen(port, () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Error:", err.message);
  });
