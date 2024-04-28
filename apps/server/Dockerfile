FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable pnpm

COPY package.json .

COPY . .

RUN pnpm install

RUN pnpm build

# Just metadata on which port the app is running on
EXPOSE 5173 

CMD ["pnpm", "start:prod"]
