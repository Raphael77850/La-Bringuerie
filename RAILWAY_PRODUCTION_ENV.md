# 🚂 Variables d'Environnement Railway - La-Bringuerie

## 🔑 Variables Requises pour Railway Dashboard

### **🛡️ SÉCURITÉ**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-64-character-secret-key-here-generate-random
BCRYPT_ROUNDS=12
```

### **🗄️ BASE DE DONNÉES (PostgreSQL Railway)**
```bash
# Railway auto-génère ces variables pour PostgreSQL
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
DB_HOST=${{PostgreSQL.PGHOST}}
DB_PORT=${{PostgreSQL.PGPORT}}
DB_USER=${{PostgreSQL.PGUSER}}
DB_PASSWORD=${{PostgreSQL.PGPASSWORD}}
DB_NAME=${{PostgreSQL.PGDATABASE}}
```

### **🌐 SERVEUR**
```bash
PORT=${{PORT}}  # Railway auto-set
APP_PORT=3310   # Fallback
```

### **🔧 CORS ET DOMAINES**
```bash
FRONTEND_URL=https://your-app-name.up.railway.app
ALLOWED_ORIGINS=https://your-app-name.up.railway.app,https://www.votre-domaine.com
```

### **📊 MONITORING**
```bash
LOG_LEVEL=info
ENABLE_LOGGING=true
```

## 🎯 **Étapes de Configuration Railway**

### 1. **Créer le Service PostgreSQL**
```bash
# Dans Railway Dashboard
1. New Project → Add PostgreSQL
2. Noter les variables générées automatiquement
```

### 2. **Déployer l'Application**
```bash
# Connecter votre repository GitHub
1. New Service → GitHub Repo → La-Bringuerie
2. Branch: dev-v3
3. Root Directory: / (monorepo)
```

### 3. **Configurer les Variables**
```bash
# Dans Railway Dashboard → Variables
- Copier toutes les variables ci-dessus
- Générer un JWT_SECRET sécurisé de 64 caractères
- Configurer FRONTEND_URL avec votre domaine Railway
```

### 4. **Vérifier le Déploiement**
```bash
# Endpoints à tester
GET https://your-app.up.railway.app/api/health
GET https://your-app.up.railway.app/api/status
```

## 🔐 **Génération JWT_SECRET Sécurisé**

```javascript
// Utiliser dans la console Node.js
require('crypto').randomBytes(64).toString('hex')
```

## 🛠️ **Scripts de Déploiement**

### **Build Command Railway**
```bash
npm run build --workspace=client && npm run build --workspace=server
```

### **Start Command Railway**
```bash
npm start --workspace=server
```

## 📋 **Checklist Pré-Déploiement**

- [ ] PostgreSQL service créé dans Railway
- [ ] Variables d'environnement configurées
- [ ] JWT_SECRET généré (64 caractères)
- [ ] CORS configuré pour le domaine Railway
- [ ] Repository connecté à Railway
- [ ] Branch dev-v3 sélectionnée
- [ ] Dockerfile railway.dockerfile présent
- [ ] Healthcheck `/api/health` fonctionnel

## 🚨 **Sécurité Production**

⚠️ **IMPORTANT** :
- JAMAIS committer les vraies variables d'environnement
- Utiliser uniquement Railway Dashboard pour les secrets
- Activer 2FA sur votre compte Railway
- Surveiller les logs pour les tentatives d'intrusion

## 🎯 **Performance Railway**

- **Memory**: 512MB minimum recommandé
- **CPU**: Shared OK pour démarrer  
- **Region**: Frankfurt/Paris pour l'Europe
- **Auto-scaling**: Activé par défaut
