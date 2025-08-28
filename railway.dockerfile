# Railway Dockerfile optimisé pour La-Bringuerie
FROM node:22-alpine AS base

# Sécurité et optimisations Alpine
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Stage 1: Installer les dépendances
FROM base AS deps
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Installer toutes les dépendances (dev + prod pour le build)
RUN npm ci --include=dev

# Stage 2: Build de l'application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build le client et le serveur
RUN npm run build --workspace=client && \
    npm run build --workspace=server

# Stage 3: Production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copier les packages.json
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev && npm cache clean --force

# Copier les builds et fichiers nécessaires
COPY --from=builder --chown=nodejs:nodejs /app/client/dist ./client/dist
COPY --from=builder --chown=nodejs:nodejs /app/server/dist ./server/dist
COPY --from=builder --chown=nodejs:nodejs /app/server/database ./server/database
COPY --chown=nodejs:nodejs server/.env.example-secure ./server/.env.example

# Changer vers l'utilisateur non-root
USER nodejs

# Exposer le port Railway
EXPOSE ${PORT:-3310}

# Healthcheck pour Railway
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-3310}/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Démarrer avec dumb-init pour la gestion des signaux
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start", "--workspace=server"]