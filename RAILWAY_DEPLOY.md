# 🚄 Guide de déploiement Railway

## Étapes de déploiement

### 1. Connexion à Railway
- Allez sur [railway.app](https://railway.app)
- Connectez-vous avec GitHub
- Cliquez sur "New Project"

### 2. Configuration du projet
- Sélectionnez "Deploy from GitHub repo"
- Choisissez votre repo "La-Bringuerie"
- Railway détectera automatiquement votre monorepo

### 3. Variables d'environnement à configurer
```
NODE_ENV=production
PORT=3000
DB_HOST=votre_host_postgres
DB_PORT=5432
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=votre_database
JWT_SECRET=votre_secret_jwt
```

### 4. Base de données
- Dans Railway, ajoutez un service "PostgreSQL"
- Copiez les variables DATABASE_URL générées
- Ou configurez les variables DB_ séparément

### 5. Domaine
- Railway génère automatiquement un domaine gratuit
- Vous pouvez ajouter votre domaine custom plus tard

## Avantages Railway
✅ Déploiement automatique sur git push
✅ Base de données PostgreSQL incluse  
✅ SSL automatique
✅ Logs en temps réel
✅ 5$/mois pour commencer (très abordable)