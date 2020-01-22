FROM node:12-slim as build-pupakit
RUN apt update && apt-get install jq -y

ARG NODE_OPTIONS=--max_old_space_size=2048

WORKDIR /docker/build-pupakit

COPY package-lock.json package.json .npmrc /docker/build-pupakit/
RUN npm ci

COPY . /docker/build-pupakit
RUN npm run lint:inspect \
 && npm run prettier:check \
 && npm run build

CMD ./scripts/publish.sh && echo "container passed" || echo "container failed"
