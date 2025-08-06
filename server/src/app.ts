import path from "node:path";
import bodyParser from "body-parser";
import express from "express";
import eventRepository from "./modules/EventModule/eventRepository";
import adminActions from "./modules/adminModule/adminActions";
import adminRepository from "./modules/adminModule/adminRepository";
import newsletterAdminActions from "./modules/adminModule/newsletterAdminActions";
import adminAuth from "./modules/middleware/adminAuth";

const app = express();

/* ************************************************************************* */

// CORS Handling: Why is the current code present and do I need to define specific allowed origins for my project?

// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers that blocks requests from a different domain than the server.
// You may find the following magic line in forums:

// app.use(cors());

// You should NOT do that: such code uses the `cors` module to allow all origins, which can pose security issues.
// For this pedagogical template, the CORS code allows CLIENT_URL in development mode (when process.env.CLIENT_URL is defined).
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3310",
  "http://127.0.0.1:3310",
  // Vercel auto-generated URLs
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  // Your custom domain (add when you have one)
  // "https://votre-domaine.com"
].filter(Boolean);

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3000",
    ].filter(Boolean),
    credentials: true,
  }),
);

// If you need to allow extra origins, you can add something like this:

/*
app.use(
  cors({
    origin: ["http://mysite.com", "http://another-domain.com"],
  }),
);
*/

// With ["http://mysite.com", "http://another-domain.com"]
// to be replaced with an array of your trusted origins

/* ************************************************************************* */

// Request Parsing: Understanding the purpose of this part

// Request parsing is necessary to extract data sent by the client in an HTTP request.
// For example to access the body of a POST request.
// The current code contains different parsing options as comments to demonstrate different ways of extracting data.

// 1. `express.json()`: Parses requests with JSON data.
// 2. `express.urlencoded()`: Parses requests with URL-encoded data.
// 3. `express.text()`: Parses requests with raw text data.
// 4. `express.raw()`: Parses requests with raw binary data.

// Uncomment one or more of these options depending on the format of the data sent by your client:

app.use(express.json());
app.use(bodyParser.json());
// app.use(express.urlencoded());
// app.use(express.text());
// app.use(express.raw());

/* ************************************************************************* */

// Import the API router
import router from "./router";

// Import multer for file uploads
import fs from "node:fs";
import multer from "multer";
import eventAdminAction from "./modules/adminModule/eventAdminAction";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../public/uploads/events");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for event image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Route API pour les événements admin
const apiRouter = express.Router();
apiRouter.get("/admin/events", adminAuth, adminActions.getAllEvents);
apiRouter.post(
  "/admin/events",
  adminAuth,
  upload.single("image"),
  eventAdminAction.addEvent,
);
apiRouter.put(
  "/admin/events",
  adminAuth,
  upload.single("image"),
  eventAdminAction.updateEvent,
);
apiRouter.delete("/admin/events/:id", adminAuth, adminActions.deleteEvent);
apiRouter.get(
  "/admin/newsletter",
  adminAuth,
  newsletterAdminActions.getAllSubscriptions,
);
apiRouter.delete(
  "/admin/newsletter/:id",
  adminAuth,
  newsletterAdminActions.deleteSubscription,
);
apiRouter.get("/admin/event-users", adminAuth, async (req, res) => {
  try {
    const users = await adminRepository.getEventEmails();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error:
        "Erreur serveur lors de la récupération des inscrits aux événements",
    });
  }
});

// Mount the API router under the "/api" endpoint
app.use("/api", apiRouter);
app.use("/api", router);

// Route de base pour éviter "Cannot GET /"
app.get("/", (req, res) => {
  // Si CLIENT_URL est défini (production), rediriger vers le frontend externe
  if (process.env.CLIENT_URL && process.env.NODE_ENV === "production") {
    console.info(`Redirecting to external frontend: ${process.env.CLIENT_URL}`);
    return res.redirect(process.env.CLIENT_URL);
  }
  
  // Sinon, essayer de servir le frontend local
  const clientBuildPath = path.join(__dirname, "../../client/dist");
  const indexPath = path.join(clientBuildPath, "index.html");
  
  console.info(`Client build path: ${clientBuildPath}`);
  console.info(`Index.html exists: ${fs.existsSync(indexPath)}`);
  console.info(`CLIENT_URL: ${process.env.CLIENT_URL}`);
  console.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  
  if (fs.existsSync(indexPath)) {
    console.info("Serving index.html from frontend");
    return res.sendFile(indexPath);
  }
  
  // Fallback API info seulement si le frontend n'existe pas
  console.warn("Frontend not found, serving API info");
  res.json({
    message: "🍺 API La Bringuerie is running!",
    status: "OK",
    endpoints: {
      health: "/api/health",
      events: "/api/events",
      newsletter: "/api/newsletter",
    },
    debug: {
      clientBuildPath: clientBuildPath,
      indexExists: fs.existsSync(indexPath),
      __dirname: __dirname,
      CLIENT_URL: process.env.CLIENT_URL,
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

/* ************************************************************************* */

// Production-ready setup: What is it for?

// The code includes sections to set up a production environment where the client and server are executed from the same processus.

// What it"s for:
// - Serving client static files from the server, which is useful when building a single-page application with React.
// - Redirecting unhandled requests (e.g., all requests not matching a defined API route) to the client's index.html. This allows the client to handle client-side routing.

// Serve server resources

const publicFolderPath = path.join(__dirname, "../public");

if (fs.existsSync(publicFolderPath)) {
  app.use("/uploads", express.static(path.join(publicFolderPath, "uploads")));
}

// Serve client resources

const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  console.info(`Serving client from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  // Redirect unhandled requests to the client index file
  app.get("*", (req, res) => {
    // Don't redirect API routes
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile("index.html", { root: clientBuildPath });
  });
} else {
  console.warn(`Client build path not found: ${clientBuildPath}`);
}

/* ************************************************************************* */

// Middleware for Error Logging
// Important: Error-handling middleware should be defined last, after other app.use() and routes calls.

import type { ErrorRequestHandler } from "express";

// Define a middleware function to log errors
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  // Log the error to the console for debugging purposes
  console.error(err);
  console.error("on req:", req.method, req.path);

  // Pass the error to the next middleware in the stack
  next(err);
};

// Mount the logErrors middleware globally
app.use(logErrors);

/* ************************************************************************* */

export default app;
