# syntax = docker/dockerfile:1
ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-bookworm-slim AS base

FROM base AS build
RUN apt-get update
RUN apt-get upgrade
RUN apt-get -f install

# Set working directory
WORKDIR /app

RUN npm install turbo --global
COPY . .

# Create partial repo with a pruned api-v1 lockfile
RUN npx turbo prune @monitoring/api-v1 --docker

# Add api-v1 lockfile and package.json
FROM base AS installer
RUN apt-get update
RUN apt-get -f install
WORKDIR /app

# First install dependencies
COPY --from=build /app/out/json/ .
RUN npm i

# Build the project and its dependencies
COPY --from=build /app/out/full/ .
RUN npx turbo build


FROM base AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api-v1
USER api-v1

COPY --from=installer --chown=api-v1:nodejs /app .

CMD ["node", "apps/api/v1/dist/main.js"]
