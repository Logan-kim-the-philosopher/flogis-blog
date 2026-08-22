FROM node:22.20.0-bookworm-slim@sha256:b21fe589dfbe5cc39365d0544b9be3f1f33f55f3c86c87a76ff65a02f8f5848e AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src

ARG PUBLIC_SITE_URL=https://flogis-blog.tail2dac17.ts.net
ARG SANITY_PROJECT_ID=w1jypogd
ARG SANITY_DATASET=production
ARG SANITY_API_VERSION=2025-08-22
ARG SANITY_STRICT_CONTENT=true

RUN PUBLIC_SITE_URL="${PUBLIC_SITE_URL}" \
    SANITY_PROJECT_ID="${SANITY_PROJECT_ID}" \
    SANITY_DATASET="${SANITY_DATASET}" \
    SANITY_API_VERSION="${SANITY_API_VERSION}" \
    SANITY_STRICT_CONTENT="${SANITY_STRICT_CONTENT}" \
    npm run build

FROM nginxinc/nginx-unprivileged:1.27.5-alpine@sha256:65e3e85dbaed8ba248841d9d58a899b6197106c23cb0ff1a132b7bfe0547e4c0

COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
