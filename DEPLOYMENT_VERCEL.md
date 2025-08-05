# 🚀 Guide de déploiement Vercel

## Étapes de déploiement

### 1. Préparation locale
```bash
# Installer Vercel CLI
npm i -g vercel

# Login Vercel
vercel login

# Test en local
npm run dev
```

### 2. Configuration de la base de données

**Option A: Base de données externe (Recommandée)**
- Railway: https://railway.app (Gratuit 500h/mois)
- PlanetScale: https://planetscale.com (Gratuit 1GB)
- Supabase: https://supabase.com (Gratuit 500MB)

**Option B: Garder IONOS MySQL**
- Ajouter les variables d'environnement dans Vercel Dashboard

### 3. Variables d'environnement Vercel
Dans le dashboard Vercel, ajouter :
```
DB_HOST=votre-host
DB_PORT=3306
DB_USER=votre-user
DB_PASSWORD=votre-password
DB_NAME=votre-database
NODE_ENV=production
```

### 4. Déploiement
```bash
# Premier déploiement
vercel

# Déploiements suivants
git push origin main
```

## URLs importantes
- Dashboard Vercel: https://vercel.com/dashboard
- Documentation: https://vercel.com/docs

## Troubleshooting
- Logs: `vercel logs`
- Fonctions: `vercel dev` pour tester en local
- Build: Vérifier les logs dans le dashboard Vercel