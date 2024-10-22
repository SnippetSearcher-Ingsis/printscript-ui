FROM oven/bun:alpine AS build
WORKDIR /app
COPY bun.lockb .
COPY package.json .
RUN apk update
RUN apk add unzip gzip
RUN bun install
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80