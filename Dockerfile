FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY bun.lockb ./
COPY . .
RUN bun install --frozen-lockfile
RUN npm run build || bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
