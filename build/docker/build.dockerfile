FROM node:14.5-slim as pupakit-build
RUN apt update && apt-get install jq -y

# NPM dependencies preinstall
WORKDIR /tmp
COPY .npmrc package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts \
  && mkdir --parents /pupakit \
  && cp --archive /tmp/node_modules /pupakit

# build library sources
WORKDIR /pupakit
COPY . .
RUN yarn run build

ENTRYPOINT ["local-scripts/publish.sh"]
