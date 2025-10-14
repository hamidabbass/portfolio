# Dockerfile for Vite + React + TypeScript + Tailwind CSS app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json bun.lockb ./
COPY . .
RUN npm install --frozen-lockfile || bun install --frozen-lockfile
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
