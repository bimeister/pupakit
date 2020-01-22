#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )";
TARGET_VERSION="0.1.0-${PKG_VERSION}";

if  [[ "$PUBLISH" == "true" ]]
then
  cat ${SCRIPT_DIR}/../dist/@meistersoft/pupakit/package.json | jq ".version=\"${TARGET_VERSION}\"" > ${SCRIPT_DIR}/../dist/@meistersoft/pupakit/temp.json \
  && mv ${SCRIPT_DIR}/../dist/@meistersoft/pupakit/temp.json ${SCRIPT_DIR}/../dist/@meistersoft/pupakit/package.json \
  && npx npm-cli-login -u ${NPM_REPOSITORY_LOGIN} -p ${NPM_REPOSITORY_PASSWORD} -e ${NPM_REPOSITORY_EMAIL} -r ${NPM_REPOSITORY_URL} \
  && npm publish ${SCRIPT_DIR}/../dist/@meistersoft/pupakit --registry "${NPM_REPOSITORY_URL}" --tag "${PKG_TAG}" --tag "latest";
fi
