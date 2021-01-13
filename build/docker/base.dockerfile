FROM node:current-slim
WORKDIR /temporary
COPY .npmrc package.json yarn.lock ./
RUN yarn install --frozen-lockfile \
  && mkdir --parents /base \
  && cp --archive /temporary/node_modules /base
WORKDIR /base
COPY . .
