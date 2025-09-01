# 🚂 RAILWAY DEPLOYMENT - VARIABLES OBLIGATOIRES

## 🔥 URGENT : Variables à configurer dans Railway Dashboard

### 1. **JWT_SECRET** (OBLIGATOIRE)
```bash
JWT_SECRET=votre_secret_jwt_de_64_caracteres_minimum_generez_un_secret_securise
```

### 2. **JWT_REFRESH_SECRET** (OBLIGATOIRE)  
```bash
JWT_REFRESH_SECRET=votre_refresh_secret_jwt_de_64_caracteres_different_du_premier
```

### 3. **Variables optionnelles mais recommandées**
```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.up.railway.app
```

## 🔐 **Générer des secrets sécurisés**

### Option 1: En ligne de commande
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Option 2: Online (OpenSSL)
```bash
openssl rand -hex 64
```

## 📍 **Comment configurer dans Railway**

1. **Aller dans Railway Dashboard**
2. **Sélectionner votre service La-Bringuerie**  
3. **Onglet "Variables"**
4. **Ajouter les variables une par une**
5. **Redéployer automatiquement**

## ⚡ **Exemple de configuration complète**

```bash
# SÉCURITÉ (OBLIGATOIRE)
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
JWT_REFRESH_SECRET=123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# PRODUCTION (RECOMMANDÉ)
NODE_ENV=production
ALLOWED_ORIGINS=https://la-bringuerie-production.up.railway.app

# BASE DE DONNÉES (AUTO-GÉNÉRÉES PAR RAILWAY)
# Ces variables sont créées automatiquement par Railway
# DATABASE_URL=${{MySQL.DATABASE_URL}}
# MYSQL_URL=${{MySQL.MYSQL_URL}}
```

## 🚨 **APRÈS CONFIGURATION**

1. **Sauvegarder les variables dans Railway Dashboard**
2. **Le service va redémarrer automatiquement**  
3. **Surveiller les logs pour confirmation**
4. **Tester l'endpoint `/api/health`**

## 🎯 **Vérification que ça marche**

```bash
curl https://your-app.up.railway.app/api/health
# Devrait retourner: {"status":"OK","timestamp":"..."}
```
