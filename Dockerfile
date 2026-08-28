# Multi-stage Dockerfile for high-performance, lightweight Cloud Run deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build production bundle
RUN npm run build

# Production static serving with Nginx Alpine (Ultra lightweight < 25 MB image)
FROM nginx:alpine

# Copy built assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing and Cloud Run PORT support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default Cloud Run port (8080)
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
