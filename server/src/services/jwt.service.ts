/**
 * Service JWT
 * Responsabilité : Gestion des tokens JWT (génération, vérification, refresh)
 * Principe SRP + DIP (Dependency Inversion Principle)
 */

import jwt from "jsonwebtoken";
import { SecurityConfig } from "../config/security";

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Génère un access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SecurityConfig.JWT.SECRET, {
    expiresIn: SecurityConfig.JWT.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Génère un refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SecurityConfig.JWT.REFRESH_SECRET, {
    expiresIn: SecurityConfig.JWT.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Génère une paire de tokens (access + refresh)
 */
export const generateTokenPair = (payload: JwtPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Vérifie et décode un access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, SecurityConfig.JWT.SECRET) as JwtPayload;
};

/**
 * Vérifie et décode un refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, SecurityConfig.JWT.REFRESH_SECRET) as JwtPayload;
};

/**
 * Décode un token sans vérification (utile pour debug)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
