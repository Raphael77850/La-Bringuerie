# Railway Dockerfile pour monorepo
FROM node:22-alpine

WORKDIR /app

# Update Alpine packages to reduce vulnerabilities
RUN apk update && apk upgrade --no-cache

# Copier les package.json
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build le client
RUN npm run build --workspace=client

# Build le serveur
RUN npm run build --workspace=server

# Debug: voir la structure des fichiers
RUN ls -la /app/server/dist/

# Exposer le port
EXPOSE $PORT

# Démarrer le serveur
CMD ["npm", "start", "--workspace=server"]