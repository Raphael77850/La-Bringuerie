import express from "express";
import eventActions from "./modules/EventModule/eventActions";
import newsletterActions from "./modules/NewsletterModule/newsletterActions";
import adminActions from "./modules/adminModule/adminActions";
import eventAdminAction from "./modules/adminModule/eventAdminAction";
import authActions from "./modules/auth/authActions";
import itemActions from "./modules/item/itemActions";
import adminAuth from "./modules/middleware/adminAuth";
import upload from "./modules/middleware/upload";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

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

router.post("/login", authActions.login);

// Routes pour les événements avec gestion des images

/* ************************************************************************* */

export default router;
