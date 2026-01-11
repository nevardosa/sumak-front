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

# (Opcional) elimina config por defecto para evitar conflictos
RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/sumak-front /usr/share/nginx/html

# Tu nginx.conf COMPLETO va aquí
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

# Validar config y arrancar en foreground
CMD ["sh", "-c", "nginx -t && nginx -g 'daemon off;'"]
