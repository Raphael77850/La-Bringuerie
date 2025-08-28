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
    const { email, password } = req.body;

    // SÉCURITÉ: Validation des entrées
    if (!email || !password) {
      console.warn(`⚠️ Login attempt with missing credentials from ${req.ip}`);
      res.status(400).json({ message: "Email et mot de passe requis" });
      return;
    }

    // SÉCURITÉ: Log sécurisé (sans mot de passe)
    console.info(`🔐 Login attempt`, {
      email: email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    // Chercher l'administrateur dans la base de données
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] =
      await databaseClient.query(
        "SELECT id, email, password FROM admin WHERE email = ?",
        [email],
      );

    // Vérifier si l'administrateur existe
    if (Array.isArray(rows) && rows.length > 0) {
      const admin = rows[0];

      // SÉCURITÉ: Comparer le mot de passe avec bcrypt
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (isPasswordValid) {
        // SÉCURITÉ: Créer des tokens JWT sécurisés
        const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_in_production';
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production';
        
        const accessToken = jwt.sign(
          { id: admin.id, email: admin.email, role: "admin" },
          jwtSecret,
          { expiresIn: "15m" } // SÉCURITÉ: Token courte durée
        );

        const refreshToken = jwt.sign(
          { id: admin.id, email: admin.email, role: "admin" },
          refreshSecret,
          { expiresIn: "7d" }
        );

        console.info(`✅ Login successful`, {
          adminId: admin.id,
          email: email,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });

        res.json({
          token: accessToken,
          admin: { id: admin.id, email: admin.email }
        });
      } else {
        console.warn(`⚠️ Invalid password attempt`, {
          email: email,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });
      res.status(401).json({ message: "Identifiants invalides" });
      }
    } else {
      console.warn(`⚠️ Admin not found`, {
        email: email,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
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
