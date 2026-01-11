# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# IMPORTANT: disable husky in CI/build
ENV HUSKY=0

# Copy package files
COPY package*.json ./

# Install ALL deps (Angular needs devDependencies to build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Stage 2: Production
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist/sumak-front /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Cloud Run uses 8080 by default
EXPOSE 8080

CMD ["nginx"]()
