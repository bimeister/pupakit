FROM node:12-slim as build-frontend

# common npm repo

# preinstall npm packages for using docker сache on build
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm ci
RUN mkdir -p /build && cp -a /tmp/node_modules /build

# building app
WORKDIR /build
COPY . .

ARG PKG_VERSION
ARG REPOSITORY_URL
ARG REPOSITORY_LOGIN
ARG REPOSITORY_PASSWORD
ARG REPOSITORY_EMAIL
ARG REPOSITORY_TOKEN
ARG PUSH

RUN echo ${REPOSITORY_URL}

RUN npm run lint:inspect && \
    npm run prettier:check && \
    npm run build

RUN apt update && \
    apt install -y jq


RUN cat .npmrc

RUN bash change_build_version.sh && \
    bash npm_push.sh
