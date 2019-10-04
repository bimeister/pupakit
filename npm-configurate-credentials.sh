#!/bin/bash

USER_NAME=$1
USER_PASSWORD=$2
USER_EMAIL=$4
NPM_REGISTRY=$3

echo -e "Credentials accepted: \e[4m$USER_NAME\e[0m:${USER_PASSWORD//?/*}"
echo -e "Target NPM registry: \e[4m$NPM_REGISTRY\e[0m"

USER_CREDENTIALS='{"username": "'$USER_NAME'", "password": "'$USER_PASSWORD'"}'

REQUEST=$(curl ''$NPM_REGISTRY'/-/verdaccio/login' \
 --header 'Origin: '$NPM_REGISTRY'' \
 --header 'Accept-Encoding: gzip, deflate' \
 --header 'Content-Type: application/json' \
 --header 'Accept: application/json' \
 --header 'Referer: '$NPM_REGISTRY'' \
 --data-binary "$USER_CREDENTIALS" \
 --compressed \
 --insecure \
 --silent)

TOKEN=$(echo $REQUEST 2>&1 | grep -Po '(?<="token": ")[^"]*')

npm set registry $NPM_REGISTRY

touch ./.npmrc && > ./.npmrc

echo "$NPM_REGISTRY/:_authToken=$TOKEN" >> ./.npmrc
echo "registry=$NPM_REGISTRY" >> ./.npmrc
echo "email = $USER_EMAIL" >> ./.npmrc
echo "always-auth = true" >> ./.npmrc
echo "strict-ssl = false" >> ./.npmrc
echo "loglevel = silly" >> ./.npmrc
