import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";
router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

import newsletterActions from "./modules/newsletterModule/newsletterActions";
router.post("/api/newsletter", newsletterActions.add);

import eventActions from "./modules/eventModule/eventActions";
router.post("/api/user_event", eventActions.add);

import adminActions from "./modules/adminModule/adminActions";
import adminAuth from "./modules/middleware/adminAuth";
router.get(
  "/api/admin/newsletter/emails",
  adminAuth,
  adminActions.getNewsletterEmails,
);
router.get(
  "/api/admin/events/emails/:id?",
  adminAuth,
  adminActions.getEventEmails,
);
router.post("/api/admin/events", adminAuth, adminActions.addEvent);
router.put("/api/admin/events", adminAuth, adminActions.updateEvent);

import eventAdminActions from "./modules/adminModule/eventAdminAction";
router.post("/api/admin/events", adminAuth, eventAdminActions.addEvent);
router.put("/api/admin/events", adminAuth, eventAdminActions.updateEvent);

import newsletterAdminActions from "./modules/adminModule/newsletterAdminActions";
router.get(
  "/api/admin/newsletter",
  adminAuth,
  newsletterAdminActions.getAllSubscriptions,
);
router.delete(
  "/api/admin/newsletter/:id",
  adminAuth,
  newsletterAdminActions.deleteSubscription,
);

/* ************************************************************************* */

export default router;
