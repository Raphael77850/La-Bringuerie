# Railway Dockerfile SIMPLE - Version de fallback
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build --workspace=client
RUN npm run build --workspace=server

# Start the application
EXPOSE 3310
CMD ["npm", "start", "--workspace=server"]
