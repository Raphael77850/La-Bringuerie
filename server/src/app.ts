import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';

// SÉCURITÉ: Import de la configuration centralisée
import { SecurityConfig } from './config/security';

// SÉCURITÉ: Configuration centralisée
const securityConfig = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com"
        ],
      },
    },
    crossOriginEmbedderPolicy: false
  }),

  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-domain.com'])
      : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  rateLimit: {
    auth: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      message: { 
        success: false, 
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' }
      },
      standardHeaders: true,
      legacyHeaders: false,
    }),
    
    api: rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { 
        success: false, 
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Trop de requêtes. Réessayez plus tard.' }
      }
    })
  }
};

// SÉCURITÉ: Validation des variables d'environnement
const validateEnvironment = () => {
  if (process.env.NODE_ENV === 'production') {
    // Utiliser SecurityConfig au lieu de process.env directement
    const jwtSecret = SecurityConfig.JWT.SECRET;
    const jwtRefreshSecret = SecurityConfig.JWT.REFRESH_SECRET;
    
    if (!jwtSecret || jwtSecret.length < 32) {
      console.warn('⚠️  JWT_SECRET should be at least 32 characters in production');
      console.warn('⚠️  Using fallback secret - Please configure proper JWT_SECRET in Railway Dashboard');
    }
    if (!jwtRefreshSecret || jwtRefreshSecret.length < 32) {
      console.warn('⚠️  JWT_REFRESH_SECRET should be at least 32 characters in production');
    }
  }
};

const app = express();

// SÉCURITÉ: Validation environnement
try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Configuration error:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}

// SÉCURITÉ: Middlewares de sécurité
app.use(securityConfig.helmet);
app.use(cors(securityConfig.cors));

// SÉCURITÉ: Rate limiting
app.use('/api/auth', securityConfig.rateLimit.auth);
app.use('/api', securityConfig.rateLimit.api);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SÉCURITÉ: Logging des requêtes (sans données sensibles)
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
    
    // Alerte sur requêtes lentes
    if (duration > 5000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
});

// Health check sécurisé
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    } 
  });
});

// Import des routes sécurisées (temporaire - en attendant la refactorisation complète)
import router from './router';

// IMPORTANT: Servir les fichiers uploads AVANT les routes API
const uploadsPath = path.join(__dirname, '../public/uploads');
console.info(`📁 Uploads directory: ${uploadsPath}`);
if (fs.existsSync(uploadsPath)) {
  console.info(`✅ Serving uploads from: ${uploadsPath}`);
  app.use('/uploads', express.static(uploadsPath));
} else {
  console.warn(`⚠️ Uploads directory not found, creating: ${uploadsPath}`);
  try {
    require('fs').mkdirSync(uploadsPath, { recursive: true });
    app.use('/uploads', express.static(uploadsPath));
    console.info(`✅ Created and serving uploads from: ${uploadsPath}`);
  } catch (err) {
    console.error(`❌ Failed to create uploads directory:`, err);
  }
}

app.use('/api', router);

// Servir les fichiers statiques (production)
if (process.env.NODE_ENV === 'production') {
  // Chemin corrigé pour Railway Docker container
  const clientBuildPath = path.join(__dirname, '../../../client/dist');
  
  if (fs.existsSync(clientBuildPath)) {
    console.info(`✅ Serving client from: ${clientBuildPath}`);
    app.use(express.static(clientBuildPath));
    
    // Route catch-all pour React Router (SPA)
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
    
    console.info(`✅ Client build files served from: ${clientBuildPath}`);
  } else {
    console.warn(`⚠️ Client build not found at: ${clientBuildPath}`);
    console.info(`📂 Current directory: ${__dirname}`);
    console.info(`📂 Checking path: ${clientBuildPath}`);
  }
}

// SÉCURITÉ: Gestion d'erreurs centralisée
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Application error:', {
    error: error.message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Ne pas exposer les détails d'erreur en production
  const response = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Une erreur interne s\'est produite'
        : error.message
    }
  };

  res.status(error.statusCode || 500).json(response);
});

// 404 handler
app.use('*', (req, res) => {
  console.warn(`⚠️ 404 Not Found: ${req.originalUrl} from ${req.ip}`);
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route non trouvée' }
  });
});

export default app;
