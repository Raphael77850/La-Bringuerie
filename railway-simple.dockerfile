# Railway Dockerfile SIMPLE - Version optimisée mémoire
FROM node:22-alpine

# Optimisation: Limite la mémoire Node.js
ENV NODE_OPTIONS="--max-old-space-size=512"

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci

# Copy source code
COPY . .

# Build the application (avec limite mémoire)
RUN npm run build --workspace=client
RUN npm run build --workspace=server

# Create uploads directory with proper permissions
RUN mkdir -p ./server/public/uploads/events
RUN chmod 755 ./server/public/uploads/events

# Start the application
EXPOSE 3310
CMD ["npm", "start", "--workspace=server"]
