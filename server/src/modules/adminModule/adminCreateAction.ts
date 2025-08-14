import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import databaseClient from "../../../database/client";

const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Vérifier que l'utilisateur est bien admin
    if (!req.admin) {
      res.status(401).json({ message: "Non autorisé" });
      return;
    }
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis" });
      return;
    }
    // Vérifier si l'admin existe déjà
    const [rows] = await databaseClient.query(
      "SELECT id FROM admin WHERE email = ?",
      [email],
    );
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(409).json({ message: "Cet email existe déjà" });
      return;
    }
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insérer le nouvel admin
    await databaseClient.query(
      "INSERT INTO admin (email, password) VALUES (?, ?)",
      [email, hashedPassword],
    );
    res.status(201).json({ message: "Admin créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// TEMPORAIRE : Fonction bootstrap pour créer le premier admin (sans vérification d'auth)
const bootstrapAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.info("Bootstrap admin creation started");

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis" });
      return;
    }

    // Vérifier si un admin existe déjà
    const [existingAdmins] = await databaseClient.query(
      "SELECT COUNT(*) as count FROM admin",
    );

    if (Array.isArray(existingAdmins) && existingAdmins.length > 0) {
      const adminCount = (existingAdmins[0] as { count: number }).count;
      if (adminCount > 0) {
        res.status(409).json({
          message:
            "Un administrateur existe déjà. Supprimez la route bootstrap.",
        });
        return;
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le premier admin
    await databaseClient.query(
      "INSERT INTO admin (email, password) VALUES (?, ?)",
      [email, hashedPassword],
    );

    console.info("Bootstrap admin created successfully");
    res.status(201).json({
      message:
        "Premier administrateur créé avec succès! Supprimez maintenant la route bootstrap.",
      email: email,
    });
  } catch (error) {
    console.error("Bootstrap admin creation error:", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'admin",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default { createAdmin, bootstrapAdmin };
