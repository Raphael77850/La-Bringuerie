import express from "express";
import adminActions from "./modules/adminModule/adminActions";
import authActions from "./modules/auth/authActions";
import eventActions from "./modules/eventModule/eventActions";
import itemActions from "./modules/item/itemActions";
import adminAuth from "./modules/middleware/adminAuth";
import newsletterActions from "./modules/newsletterModule/newsletterActions";

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
router.get("/admin/events/emails/:id?", adminAuth, adminActions.getEventEmails);
router.post("/admin/events", adminAuth, adminActions.addEvent);
router.put("/admin/events", adminAuth, adminActions.updateEvent);
router.delete("/admin/events/:id", adminAuth, adminActions.deleteEvent);

router.post("/login", authActions.login);

/* ************************************************************************* */

export default router;
