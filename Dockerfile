FROM node:13-slim as build-pupakit
RUN apt update && apt-get install jq -y

WORKDIR /docker/build-pupakit

COPY yarn.lock package.json .npmrc /docker/build-pupakit/
RUN yarn install --frozen-lockfile

COPY . /docker/build-pupakit
RUN npm run lint:inspect \
 && npm run prettier:check \
 && npm run build

ENTRYPOINT ["scripts/publish.sh"]
