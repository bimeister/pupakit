FROM node:14-slim as build-pupakit
RUN apt update && apt-get install jq -y

WORKDIR /docker/build-pupakit

COPY yarn.lock package.json .npmrc /docker/build-pupakit/
RUN yarn install --frozen-lockfile

COPY . /docker/build-pupakit
RUN yarn run lint:inspect \
 && yarn run prettier:check \
 && yarn run build

ENTRYPOINT ["scripts/publish.sh"]
