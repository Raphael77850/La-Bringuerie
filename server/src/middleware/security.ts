import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

// ===============================
// CONSTANTES DE SÉCURITÉ
// ===============================
export enum ErrorCodes {
  MISSING_TOKEN = 'MISSING_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500
} as const;

// ===============================
// INTERFACES
// ===============================
interface AuthenticatedRequest extends Request {
  admin?: {
    id: number;
    email: string;
    role: string;
  };
}

// ===============================
// MIDDLEWARE D'AUTHENTIFICATION
// ===============================
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn(`⚠️ Authentication attempt without token from ${req.ip}`);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: { code: ErrorCodes.MISSING_TOKEN, message: 'Token d\'accès requis' }
    });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_in_production';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    if (!decoded.id || !decoded.email || !decoded.role) {
      throw new Error('Token payload invalide');
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    console.warn(`⚠️ Token validation failed from ${req.ip}:`, error instanceof Error ? error.message : 'Unknown error');
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: { 
        code: error instanceof jwt.TokenExpiredError ? ErrorCodes.TOKEN_EXPIRED : ErrorCodes.INVALID_TOKEN, 
        message: error instanceof jwt.TokenExpiredError ? 'Token expiré' : 'Token invalide' 
      }
    });
    return;
  }
};

// ===============================
// MIDDLEWARE DE VALIDATION
// ===============================
export const validateEventInput = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, date, endTime, maxParticipants, max_participants } = req.body;
  const errors: string[] = [];
  
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }
  
  if (!date || !endTime) {
    errors.push('Les dates de début et fin sont requises');
  } else {
    const startDate = new Date(date);
    const endDate = new Date(endTime);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      errors.push('Format de date invalide');
    } else if (endDate <= startDate) {
      errors.push('La date de fin doit être postérieure à la date de début');
    }
    // Permettre les événements passés pour l'admin
    // } else if (startDate <= new Date()) {
    //   errors.push('L\'événement doit être programmé dans le futur');
    // }
  }
  
  // Accepter les deux formats: maxParticipants et max_participants
  const participants = maxParticipants || max_participants;
  if (participants !== undefined && participants !== null && participants !== '') {
    const maxPart = Number(participants);
    if (isNaN(maxPart) || maxPart < 1 || maxPart > 10000) {
      errors.push('Le nombre maximum de participants doit être entre 1 et 10000');
    }
  }
  
  if (errors.length > 0) {
    console.warn(`⚠️ Validation failed from ${req.ip}:`, errors);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: { 
        code: ErrorCodes.VALIDATION_ERROR, 
        message: 'Données de validation invalides',
        details: errors
      }
    });
    return;
  }
  
  // Nettoyer les données
  req.body.title = title.trim();
  req.body.description = description.trim();
  next();
};

// ===============================
// RATE LIMITING
// ===============================

// Rate limiting général pour API
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limite à 1000 requêtes par IP par fenêtre
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded from ${req.ip}`);
    res.status(HTTP_STATUS.RATE_LIMITED).json({
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message: 'Trop de requêtes, veuillez réessayer plus tard'
      }
    });
  }
});

// Rate limiting pour les routes d'authentification
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limite à 10 tentatives de connexion par IP
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Trop de tentatives de connexion, veuillez réessayer plus tard'
    }
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.warn(`⚠️ Auth rate limit exceeded from ${req.ip}`);
    res.status(HTTP_STATUS.RATE_LIMITED).json({
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message: 'Trop de tentatives de connexion, veuillez réessayer plus tard'
      }
    });
  }
});

// Rate limiting pour les soumissions de newsletter
export const newsletterRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // limite à 5 soumissions par IP par heure
  message: {
    success: false,
    error: {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Limite d\'inscriptions à la newsletter atteinte, veuillez réessayer plus tard'
    }
  },
  handler: (req, res) => {
    console.warn(`⚠️ Newsletter rate limit exceeded from ${req.ip}`);
    res.status(HTTP_STATUS.RATE_LIMITED).json({
      success: false,
      error: {
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        message: 'Limite d\'inscriptions à la newsletter atteinte, veuillez réessayer plus tard'
      }
    });
  }
});

// Middleware temporaire qui bloque certaines routes
export const blockTemporaryRoutes = (req: Request, res: Response, next: NextFunction): void => {
  const blockedPaths = ['/init-db', '/check-admin', '/check-tables'];
  
  if (blockedPaths.includes(req.path)) {
    console.warn(`🚫 Blocked dangerous route access: ${req.path} from ${req.ip}`);
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: {
        code: ErrorCodes.AUTHORIZATION_FAILED,
        message: 'Route non autorisée'
      }
    });
    return;
  }
  
  next();
};

// ===============================
// UTILITAIRES DE SÉCURITÉ
// ===============================

/**
 * Valide un mot de passe fort
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password || password.length < 12) {
    errors.push('Le mot de passe doit contenir au moins 12 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Hash sécurisé d'un mot de passe
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Vérification d'un mot de passe
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Nettoyage et validation d'entrée
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprime les scripts
    .replace(/javascript:/gi, '') // Supprime javascript:
    .replace(/on\w+\s*=/gi, '') // Supprime les gestionnaires d'événements
    .slice(0, 1000); // Limite la longueur
};
