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

RUN rm -f /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/sumak-front/ /usr/share/nginx/html/


COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["sh", "-c", "nginx -t && nginx -g 'daemon off;'"]
