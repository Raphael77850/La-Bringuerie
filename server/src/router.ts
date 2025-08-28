import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

// Import des actions existantes
import itemActions from './modules/item/itemActions';
import eventActions from './modules/EventModule/eventActions';
import newsletterActions from './modules/NewsletterModule/newsletterActions';
import { login } from './modules/auth/authActions';
import adminActions from './modules/adminModule/adminActions';
import newsletterAdminActions from './modules/adminModule/newsletterAdminActions';

// Import des middlewares de sécurité
import { 
  authenticateToken, 
  validateEventInput,
  loginRateLimit,
  newsletterRateLimit 
} from './middleware/security';

// ===============================
// ROUTES PUBLIQUES
// ===============================

// Health check
router.get('/health', (req: Request, res: Response) => {
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

// Routes items (publiques)
router.get('/items', itemActions.browse);
router.get('/items/:id', itemActions.read);
router.post('/items', itemActions.add);

// Routes newsletter (avec rate limiting)
router.post('/newsletter', newsletterRateLimit, newsletterActions.add);

// Routes événements publiques
router.get('/events', eventActions.getEvents);
router.get('/events/:id', eventActions.getEventById);
router.post('/user_event', eventActions.add);

// Route d'authentification (avec rate limiting)
router.post('/auth/login', loginRateLimit, login);

// ===============================
// ROUTES ADMIN (SÉCURISÉES)
// ===============================

// Admin - Newsletter
router.get('/admin/newsletter/emails', authenticateToken, adminActions.getNewsletterEmails);
router.get('/admin/newsletter', authenticateToken, newsletterAdminActions.getAllSubscriptions);
router.delete('/admin/newsletter/:id', authenticateToken, newsletterAdminActions.deleteSubscription);

// Admin - Événements
router.get('/admin/events', authenticateToken, adminActions.getAllEvents);
router.post('/admin/events', authenticateToken, validateEventInput, adminActions.addEvent);
router.put('/admin/events/:id', authenticateToken, validateEventInput, adminActions.updateEvent);
router.delete('/admin/events/:id', authenticateToken, adminActions.deleteEvent);

// Admin - Utilisateurs événements
router.get('/admin/event-users', authenticateToken, async (req: Request, res: Response) => {
  try {
    const adminRepository = (await import('./modules/adminModule/adminRepository')).default;
    const users = await adminRepository.getEventEmails();
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error('❌ Error fetching event users:', err);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Erreur lors de la récupération des utilisateurs' }
    });
  }
});

router.delete('/admin/event-users/:id', authenticateToken, adminActions.deleteEventUser);

// ===============================
// ROUTES DE DÉVELOPPEMENT UNIQUEMENT
// ===============================
if (process.env.NODE_ENV === 'development') {
  console.warn('⚠️ Routes de développement activées - NE PAS UTILISER EN PRODUCTION');
  
  router.get('/dev/status', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        environment: 'development',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        memory: process.memoryUsage()
      }
    });
  });
}

export default router;
