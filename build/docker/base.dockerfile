FROM node:current-slim
ARG NPM_AUTH_TOKEN
WORKDIR /temporary
COPY .npmrc package.json yarn.lock ./
RUN echo "@bimeister:registry = https://git.bimeister.com/api/v4/packages/npm/" >> .npmrc \
 && echo "//git.bimeister.com/api/v4/projects/:_authToken = ${NPM_AUTH_TOKEN}" >> .npmrc \
 && echo "//git.bimeister.com/api/v4/packages/npm/:_authToken = ${NPM_AUTH_TOKEN}" >> .npmrc
RUN yarn install --frozen-lockfile \
  && mkdir --parents /base \
  && cp --archive /temporary/node_modules /base
WORKDIR /base
COPY . .
