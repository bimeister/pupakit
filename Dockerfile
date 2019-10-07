FROM node:12-slim as build-frontend

# common npm repo
RUN npm set registry "http://npm.meistersoft.ru:4873/"

# preinstall npm packages for using docker сache on build
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /build && cp -a /tmp/node_modules /build

# building app
WORKDIR /build
COPY . .
ARG PKG_VERSION
ARG REPOSITORY_URL
ARG REPOSITORY_LOGIN
ARG REPOSITORY_PASSWORD
ARG REPOSITORY_EMAIL
ARG PUSH
RUN npm cache clean --force
RUN npm ci
RUN npm run lint:inspect
RUN npm run prettier:check
RUN npm run build
RUN apt update && \
  apt install -y jq && \
  bash change_build_version.sh
RUN npm install -g npm-cli-login && \
  npm set registry http://npm.meistersoft.ru:4873 && \
  npm-cli-login -u ${REPOSITORY_LOGIN} -p ${REPOSITORY_PASSWORD} -e ${REPOSITORY_EMAIL} -r ${REPOSITORY_URL} && \
  bash npm_push.sh
