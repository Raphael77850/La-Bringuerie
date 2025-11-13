/**
 * Middlewares de rate limiting
 * Responsabilité unique : Limiter les requêtes par IP
 * Principe SRP (Single Responsibility Principle)
 */

import rateLimit from "express-rate-limit";
import { ErrorCodes, HTTP_STATUS } from "../config";

/**
 * Rate limiting général pour l'API
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requêtes par IP par fenêtre
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: "Trop de requêtes, veuillez réessayer plus tard",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️ API rate limit exceeded from ${req.ip}`);
    res.status(HTTP_STATUS.RATE_LIMITED).json({
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message: "Trop de requêtes, veuillez réessayer plus tard",
      },
    });
  },
});

/**
 * Rate limiting pour les tentatives de connexion
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives de connexion par IP
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: "Trop de tentatives de connexion, veuillez réessayer plus tard",
    },
  },
  skipSuccessfulRequests: true, // Ne compte pas les connexions réussies
  handler: (req, res) => {
    console.warn(`⚠️ Login rate limit exceeded from ${req.ip}`);
    res.status(HTTP_STATUS.RATE_LIMITED).json({
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message:
          "Trop de tentatives de connexion, veuillez réessayer plus tard",
      },
    });
  },
});

/**
 * Rate limiting pour les inscriptions newsletter
 */
export const newsletterRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // 5 inscriptions par IP par heure
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message:
        "Limite d'inscriptions à la newsletter atteinte, veuillez réessayer plus tard",
    },
  },
  handler: (req, res) => {
    console.warn(`⚠️ Newsletter rate limit exceeded from ${req.ip}`);
    res.status(HTTP_STATUS.RATE_LIMITED).json({
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message:
          "Limite d'inscriptions à la newsletter atteinte, veuillez réessayer plus tard",
      },
    });
  },
});
