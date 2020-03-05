FROM node:13-slim as build-pupakit
RUN apt update && apt-get install jq -y

WORKDIR /docker/build-pupakit

COPY package-lock.json package.json .npmrc /docker/build-pupakit/
RUN npm ci

COPY . /docker/build-pupakit
RUN npm run lint:inspect \
 && npm run prettier:check \
 && npm run build

ENTRYPOINT ["scripts/publish.sh"]
