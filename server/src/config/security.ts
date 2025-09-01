/**
 * Configuration de sécurité centralisée
 * CRITICAL: Remplace les valeurs par défaut dangereuses
 */

export const SecurityConfig = {
  JWT: {
    SECRET: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️  SECURITY WARNING: Using fallback JWT_SECRET for Railway deployment');
        console.warn('⚠️  Please set JWT_SECRET environment variable in Railway Dashboard');
        // Fallback temporaire pour Railway - 64 caractères
        return 'railway_fallback_jwt_secret_change_this_immediately_in_dashboard_12345678';
      }
      return 'dev_secret_key_change_in_production';
    })(),
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️  SECURITY WARNING: Using fallback JWT_REFRESH_SECRET');
        return 'railway_fallback_refresh_secret_change_this_immediately_in_dashboard_123';
      }
      return 'dev_refresh_secret_change_in_production';
    })(),
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
  },
  
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    UPLOAD_PATH: process.env.UPLOAD_PATH || './public/uploads/events',
  },
  
  RATE_LIMITING: {
    LOGIN_ATTEMPTS: {
      window: 15 * 60 * 1000, // 15 minutes
      max: 5, // tentatives
    },
    API_CALLS: {
      window: 15 * 60 * 1000,
      max: 100,
    },
  },
  
  CORS: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
