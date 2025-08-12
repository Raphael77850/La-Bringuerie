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
router.post("/admin/bootstrap", async (req, res) => {
  try {
    console.info("Bootstrap route called with:", { email: req.body.email });

    // Test de connexion à la base de données d'abord
    await databaseClient.query("SELECT 1 as test");
    console.info("Database connection OK for bootstrap");

    // Appeler l'action de création
    await adminCreateAction.createAdmin(req, res);
  } catch (error) {
    console.error("Bootstrap error:", error);
    res.status(500).json({
      error: "Erreur lors de la création de l'admin",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Route pour créer un nouvel admin (protégée)
router.post("/admin/create", adminAuth, adminCreateAction.createAdmin);

// Route pour rafraîchir le token d'accès
router.post("/refresh-token", refreshTokenActions.refreshToken);

// Routes pour les événements avec gestion des images

/* ************************************************************************* */

export default router;
