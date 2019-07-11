#!/bin/bash

if  [[ "${PUSH}" == "true" ]]
then
  cd ./dist/@meistersoft/pupakit && npm publish --registry "${REPOSITORY_URL}"
fi
