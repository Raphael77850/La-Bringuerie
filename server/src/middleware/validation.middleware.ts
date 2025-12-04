/**
 * Middlewares de validation
 * Responsabilité unique : Valider les entrées utilisateur
 * Principe SRP (Single Responsibility Principle)
 */

import type { NextFunction, Request, Response } from "express";
import { ErrorCodes, HTTP_STATUS } from "../config";

/**
 * Middleware de validation pour les événements
 */
export const validateEventInput = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const {
    title,
    description,
    date,
    endTime,
    maxParticipants,
    max_participants,
  } = req.body;
  const errors: string[] = [];

  // Validation du titre
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    errors.push("Le titre doit contenir au moins 3 caractères");
  }

  // Validation de la description
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    errors.push("La description doit contenir au moins 10 caractères");
  }

  // Validation des dates
  if (!date || !endTime) {
    errors.push("Les dates de début et fin sont requises");
  } else {
    const startDate = new Date(date);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      errors.push("Format de date invalide");
    } else if (endDate <= startDate) {
      errors.push("La date de fin doit être postérieure à la date de début");
    }
  }

  // Validation du nombre de participants (accepte les deux formats)
  const participants = maxParticipants || max_participants;
  if (
    participants !== undefined &&
    participants !== null &&
    participants !== ""
  ) {
    const maxPart = Number(participants);
    if (Number.isNaN(maxPart) || maxPart < 1 || maxPart > 10000) {
      errors.push(
        "Le nombre maximum de participants doit être entre 1 et 10000",
      );
    }
  }

  // Si erreurs, retourner une réponse 400
  if (errors.length > 0) {
    console.warn(`⚠️ Validation failed from ${req.ip}:`, errors);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Données de validation invalides",
        details: errors,
      },
    });
    return;
  }

  // Nettoyer les données
  req.body.title = title.trim();
  req.body.description = description.trim();

  console.info(`✅ Event validation passed for: ${req.body.title}`);
  next();
};

/**
 * Middleware pour bloquer certaines routes dangereuses
 */
export const blockTemporaryRoutes = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const blockedPaths = ["/init-db", "/check-admin", "/check-tables"];

  if (blockedPaths.includes(req.path)) {
    console.warn(
      `🚫 Blocked dangerous route access: ${req.path} from ${req.ip}`,
    );
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: {
        code: ErrorCodes.AUTHORIZATION_FAILED,
        message: "Route non autorisée",
      },
    });
    return;
  }

  next();
};
