# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

ENV HUSKY=0

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

# Stage 2: Runtime
FROM nginx:alpine

# Remove default configs
RUN rm -f /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copy built app
COPY --from=build /app/dist/sumak-front/browser/ /usr/share/nginx/html/

# Copy optimized nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Verify setup
RUN echo "=== Nginx HTML Directory ===" && ls -la /usr/share/nginx/html
RUN echo "=== Nginx Config Test ===" && nginx -t

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
