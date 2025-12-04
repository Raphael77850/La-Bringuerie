/**
 * Middleware d'authentification JWT
 * Responsabilité unique : Vérifier et décoder les tokens JWT
 * Principe SRP (Single Responsibility Principle)
 */

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorCodes, HTTP_STATUS } from "../config";

/**
 * Middleware pour vérifier le token JWT
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.warn(`⚠️ Authentication attempt without token from ${req.ip}`);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ErrorCodes.MISSING_TOKEN,
        message: "Token d'accès requis",
      },
    });
    return;
  }

  try {
    const jwtSecret =
      process.env.JWT_SECRET || "dev_secret_change_in_production";

    const decoded = jwt.verify(token, jwtSecret) as {
      id: number;
      email: string;
      role: string;
    };

    if (!decoded.id || !decoded.email || !decoded.role) {
      throw new Error("Token payload invalide");
    }

    req.admin = decoded;
    console.info(`✅ User authenticated: ${decoded.email} (ID: ${decoded.id})`);
    next();
  } catch (error) {
    console.warn(
      `⚠️ Token validation failed from ${req.ip}:`,
      error instanceof Error ? error.message : "Unknown error",
    );
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: {
        code:
          error instanceof jwt.TokenExpiredError
            ? ErrorCodes.TOKEN_EXPIRED
            : ErrorCodes.INVALID_TOKEN,
        message:
          error instanceof jwt.TokenExpiredError
            ? "Token expiré"
            : "Token invalide",
      },
    });
    return;
  }
};

/**
 * Middleware pour vérifier le rôle admin
 * À utiliser APRÈS authenticateToken
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.admin || req.admin.role !== "admin") {
    console.warn(`⚠️ Unauthorized admin access attempt from ${req.ip}`);
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: {
        code: ErrorCodes.AUTHORIZATION_FAILED,
        message: "Accès réservé aux administrateurs",
      },
    });
    return;
  }

  console.info(`✅ Admin access granted: ${req.admin.email}`);
  next();
};
