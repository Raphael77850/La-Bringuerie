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

import adminAuth from "../public/assets/images/middleware/adminAuth/adminAuth";
import adminActions from "./modules/adminsModule/adminsActions";
router.get("/api/admin/newsletter/emails", adminActions.getNewsletterEmails);
router.get("/api/admin/events/emails/:id?", adminActions.getEventEmails);
router.get(
  "/api/admin/events/emails/:id?",
  adminAuth,
  adminActions.getEventEmails,
);
router.get(
  "/api/admin/newsletter/emails/:id",
  adminAuth,
  adminActions.getNewsletterEmails,
);

/* ************************************************************************* */

export default router;
