FROM oven/bun:alpine
WORKDIR /app
COPY bun.lockb .
COPY package.json .
RUN apk update
RUN apk add unzip
RUN bun install
COPY . .
ENTRYPOINT ["bun", "run", "dev"]