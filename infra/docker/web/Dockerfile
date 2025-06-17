# syntax = docker/dockerfile:1
ARG NODE_VERSION=22.6.0
FROM node:${NODE_VERSION}-alpine AS base

FROM base AS build
RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

RUN npm install turbo --global
COPY . .

# Create partial repo with a pruned web lockfile
RUN npx turbo prune @monitoring/web --docker

# Add api-v1 lockfile and package.json
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies
COPY --from=build /app/out/json/ .
RUN npm i

# Build the project and its dependencies
COPY --from=build /app/out/full/ .
RUN npx turbo build

FROM nginx
COPY ./infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=installer /app/apps/web/index.html /usr/share/nginx/html
COPY --from=installer /app/apps/web/style.css /usr/share/nginx/html
COPY --from=installer /app/apps/web/dist/index.js /usr/share/nginx/html/dist/index.js

