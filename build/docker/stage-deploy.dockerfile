FROM node:16-slim as static-files
WORKDIR /temporary
RUN  apt-get update && apt-get install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils -y

# Extract node_modules-relative files
COPY .npmrc package.json package-lock.json tsconfig.lib.json tsconfig.spec.json tsconfig.json build/ ./raw-copy/
RUN rm ./raw-copy/docker --recursive --force \
  && mkdir ./build \
  \
  && mv ./raw-copy/node --target-directory="./build" \
  && mv ./raw-copy/* --target-directory="./" \
  && rm ./raw-copy --recursive --force \
  \
  && npm ci \
  && mkdir --parents /base \
  && cp /temporary/node_modules --recursive --target-directory="/base"

# Set clean directory with installed node_modules as container layer
WORKDIR /base

ARG BASE_HREF
COPY . .
RUN npm run build:demo-stage

FROM nginx:latest
COPY --from=static-files /base/dist/demo /usr/share/nginx/html
