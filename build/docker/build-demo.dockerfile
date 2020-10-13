FROM node:14.5-slim as pupakit-demo

# NPM dependencies preinstall
WORKDIR /tmp
COPY .npmrc package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts \
  && mkdir --parents /pupakit \
  && cp --archive /tmp/node_modules /pupakit

# Generate docs html representation
WORKDIR /pupakit
COPY . .
RUN yarn run build:demo
