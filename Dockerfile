# Dockerfile for Vite + React + Typescript + Nginx static site
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install --frozen-lockfile || npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
