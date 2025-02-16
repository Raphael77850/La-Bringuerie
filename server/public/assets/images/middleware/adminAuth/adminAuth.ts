import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

const adminAuth: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Token manquant" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_clé_secrète",
    ) as { id: number; email: string; role: string };

    req.admin = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide" });
    return;
  }
};

export default adminAuth;
