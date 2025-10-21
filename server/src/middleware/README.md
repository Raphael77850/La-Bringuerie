# Middlewares de Sécurité

Ce dossier contient tous les middlewares liés à la sécurité de l'application.

## 📁 Structure

```
middleware/
└── security.ts  ← Tous les middlewares de sécurité, validation et rate limiting
```

## 🔐 Middlewares Disponibles

### Authentification

#### `authenticateToken`
Vérifie la validité du token JWT dans l'en-tête Authorization.

```typescript
router.get('/admin/events', authenticateToken, adminActions.getAllEvents);
```

**Retours:**
- `401 UNAUTHORIZED` : Token manquant
- `403 FORBIDDEN` : Token invalide ou expiré

---

#### `requireAdmin`
Vérifie que l'utilisateur authentifié a le rôle admin.

**⚠️ Important:** À utiliser **après** `authenticateToken`

```typescript
router.delete('/admin/events/:id', authenticateToken, requireAdmin, adminActions.deleteEvent);
```

**Retours:**
- `403 FORBIDDEN` : Utilisateur non admin

---

### Rate Limiting

#### `apiRateLimit`
Rate limiting général pour toutes les routes API.

- **Fenêtre:** 15 minutes
- **Limite:** 1000 requêtes par IP

```typescript
app.use('/api', apiRateLimit);
```

---

#### `loginRateLimit`
Rate limiting spécifique pour les tentatives de connexion.

- **Fenêtre:** 15 minutes
- **Limite:** 10 tentatives par IP
- **Skip:** Les tentatives réussies ne comptent pas

```typescript
router.post('/auth/login', loginRateLimit, login);
```

---

#### `newsletterRateLimit`
Rate limiting pour les inscriptions newsletter.

- **Fenêtre:** 1 heure
- **Limite:** 5 inscriptions par IP

```typescript
router.post('/newsletter', newsletterRateLimit, newsletterActions.add);
```

---

### Validation

#### `validateEventInput`
Valide les données d'entrée pour la création/modification d'événements.

**Validations:**
- Titre: min 3 caractères
- Description: min 10 caractères
- Dates: format valide, date fin > date début
- Participants: entre 1 et 10000

```typescript
router.post('/admin/events', 
  authenticateToken, 
  upload.single('image'),
  validateEventInput, 
  adminActions.addEvent
);
```

**Retours:**
- `400 BAD_REQUEST` : Données invalides avec détails des erreurs

---

#### `blockTemporaryRoutes`
Bloque l'accès à certaines routes sensibles.

**Routes bloquées:**
- `/init-db`
- `/check-admin`
- `/check-tables`

---

### Utilitaires

#### `validatePassword(password: string)`
Valide la force d'un mot de passe.

**Critères:**
- ✅ Min 12 caractères
- ✅ Au moins 1 majuscule
- ✅ Au moins 1 minuscule
- ✅ Au moins 1 chiffre
- ✅ Au moins 1 caractère spécial

```typescript
const { isValid, errors } = validatePassword('MonP@ssw0rd123');
if (!isValid) {
  console.error(errors);
}
```

---

#### `hashPassword(password: string)`
Hash un mot de passe avec bcrypt (12 rounds).

```typescript
const hashedPassword = await hashPassword('MonP@ssw0rd123');
```

---

#### `verifyPassword(password: string, hash: string)`
Vérifie un mot de passe contre son hash.

```typescript
const isValid = await verifyPassword('MonP@ssw0rd123', hashedPassword);
```

---

#### `sanitizeInput(input: string)`
Nettoie les entrées utilisateur pour éviter les XSS.

**Protections:**
- Suppression des balises `<script>`
- Suppression de `javascript:`
- Suppression des gestionnaires d'événements (`onclick`, etc.)
- Limite à 1000 caractères

```typescript
const clean = sanitizeInput(userInput);
```

---

## 🎯 Bonnes Pratiques

### Ordre des Middlewares

L'ordre d'application des middlewares est **critique**:

```typescript
router.post('/admin/events',
  loginRateLimit,           // 1. Rate limiting en premier
  authenticateToken,         // 2. Authentification
  requireAdmin,              // 3. Autorisation
  upload.single('image'),    // 4. Upload
  validateEventInput,        // 5. Validation
  adminActions.addEvent      // 6. Action
);
```

### Types TypeScript

Utilisez l'interface `AuthenticatedRequest` pour les routes protégées:

```typescript
import type { AuthenticatedRequest } from './middleware/security';

export const myAction = (req: AuthenticatedRequest, res: Response) => {
  const adminId = req.admin?.id; // ✅ Typé correctement
};
```

### Gestion des Erreurs

Tous les middlewares renvoient des réponses standardisées:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur",
    "details": ["détail 1", "détail 2"]
  }
}
```

---

## 📊 Codes d'Erreur

```typescript
enum ErrorCodes {
  MISSING_TOKEN = "MISSING_TOKEN",
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
  AUTHORIZATION_FAILED = "AUTHORIZATION_FAILED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR = "INTERNAL_ERROR"
}
```

---

## 🔒 Sécurité

### Variables d'Environnement

**⚠️ CRITIQUE:** Définissez ces variables en production:

```env
JWT_SECRET=votre_secret_jwt_ultra_securise
JWT_REFRESH_SECRET=votre_refresh_secret_ultra_securise
```

### Logs de Sécurité

Tous les middlewares loggent les événements de sécurité:

```
⚠️ Authentication attempt without token from 192.168.1.1
✅ Login successful for admin@example.com
🚫 Blocked dangerous route access: /init-db from 192.168.1.1
```

---

## 🧪 Tests

Pour tester les middlewares:

```bash
npm test -- security.test.ts
```
