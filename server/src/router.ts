import express from "express";
import databaseClient from "../database/client";
import eventActions from "./modules/EventModule/eventActions";
import newsletterActions from "./modules/NewsletterModule/newsletterActions";
import adminActions from "./modules/adminModule/adminActions";
import adminCreateAction from "./modules/adminModule/adminCreateAction";
import eventAdminAction from "./modules/adminModule/eventAdminAction";
import authActions from "./modules/auth/authActions";
import refreshTokenActions from "./modules/auth/refreshTokenActions";
import itemActions from "./modules/item/itemActions";
import adminAuth from "./modules/middleware/adminAuth";
import upload from "./modules/middleware/upload";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Health check route
router.get("/health", async (req, res) => {
  try {
    // Test de connexion à la base de données
    const [rows] = await databaseClient.query("SELECT 1 as test");

    res.json({
      status: "OK",
      message: "Server is running",
      database: "Connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  }
});

// TEMPORAIRE : Route pour initialiser la base de données
router.get("/init-db", async (req, res) => {
  try {
    console.info("Initializing database...");

    // Test de connexion d'abord
    await databaseClient.query("SELECT 1 as test");
    console.info("Database connection OK for init-db");

    // Créer la table admin si elle n'existe pas
    console.info("Creating admin table...");
    await databaseClient.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.info("Admin table created successfully");

    // Créer d'autres tables essentielles
    console.info("Creating newsletter table...");
    await databaseClient.query(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.info("Creating event table...");
    await databaseClient.query(`
      CREATE TABLE IF NOT EXISTS event (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        date DATETIME NOT NULL,
        endTime DATETIME NOT NULL,
        location VARCHAR(255),
        max_participants INT DEFAULT NULL,
        image_url VARCHAR(500),
        status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.info("Creating user_event table...");
    await databaseClient.query(`
      CREATE TABLE IF NOT EXISTS user_event (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        event_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
        UNIQUE (email, event_id)
      )
    `);

    // Vérifier que la table admin existe vraiment
    const [tables] = await databaseClient.query("SHOW TABLES LIKE 'admin'");
    const adminTableExists = Array.isArray(tables) && tables.length > 0;

    console.info("Database initialization completed");
    res.json({
      status: "SUCCESS",
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
      tables: {
        admin: adminTableExists ? "Created" : "Failed to create",
        newsletter: "Created",
        event: "Created",
        user_event: "Created",
      },
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Database initialization failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Define item-related routes
router.get("/items", itemActions.browse);
router.get("/items/:id", itemActions.read);
router.post("/items", itemActions.add);

router.post("/newsletter", newsletterActions.add);

router.post("/user_event", eventActions.add);
router.get("/events", eventActions.getEvents);
router.get("/events/:id", eventActions.getEventById);

router.get(
  "/admin/newsletter/emails",
  adminAuth,
  adminActions.getNewsletterEmails,
);

router.post(
  "/admin/events",
  adminAuth,
  upload.single("image"),
  eventAdminAction.addEvent,
);

router.put(
  "/admin/events",
  adminAuth,
  upload.single("image"),
  eventAdminAction.updateEvent,
);
router.get("/admin/events/emails/:id?", adminAuth, adminActions.getEventEmails);
router.delete("/admin/events/:id", adminAuth, adminActions.deleteEvent);
router.delete(
  "/admin/event-users/:id",
  adminAuth,
  adminActions.deleteEventUser,
);

router.post("/login", authActions.login);

// Route pour l'interface admin (serve the admin page)
router.get("/admin", (req, res) => {
  // Si c'est une SPA, on redirige vers la page principale pour laisser React Router gérer
  res.redirect("/");
});

// TEMPORAIRE : Route pour créer le premier admin (SANS authentification)
// ⚠️ À SUPPRIMER après création du premier admin
router.post("/admin/bootstrap", adminCreateAction.bootstrapAdmin);

// Route pour créer un nouvel admin (protégée)
router.post("/admin/create", adminAuth, adminCreateAction.createAdmin);

// Route pour rafraîchir le token d'accès
router.post("/refresh-token", refreshTokenActions.refreshToken);

// Routes pour les événements avec gestion des images

/* ************************************************************************* */

export default router;
