import crypto from "node:crypto";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { FieldPacket, RowDataPacket } from "mysql2";
import databaseClient from "../../../database/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.info("Login attempt for:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis" });
      return;
    }

    // Chercher l'administrateur dans la base de données
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] =
      await databaseClient.query(
        "SELECT id, email, password FROM admin WHERE email = ?",
        [email],
      );

    console.info("Database query result:", {
      found: rows.length > 0,
      email: email,
    });

    // Vérifier si l'administrateur existe
    if (Array.isArray(rows) && rows.length > 0) {
      const admin = rows[0];

      // Comparer le mot de passe avec bcrypt
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      console.info("Password validation:", {
        isValid: isPasswordValid,
        hasStoredPassword: !!admin.password,
      });

      if (isPasswordValid) {
        // Créer un token JWT
        const token = jwt.sign(
          { id: admin.id, email: admin.email, role: "admin" },
          process.env.JWT_SECRET || "votre_clé_secrète",
          { expiresIn: "8h" },
        );

        console.info("Login successful for:", email);

        res.json({
          token,
          admin: { id: admin.id, email: admin.email },
        });
      } else {
        console.warn("Invalid password for:", email);
        res.status(401).json({ message: "Identifiants invalides" });
      }
    } else {
      console.warn("Admin not found for email:", email);
      res.status(401).json({ message: "Identifiants invalides" });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
    next(error);
  }
};

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token depuis l'en-tête d'autorisation
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_clé_secrète",
    ) as {
      id: number;
      email: string;
      role: string;
    };

    // Vérifier si l'utilisateur est un administrateur
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default { login, adminAuth };
