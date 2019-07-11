#!/bin/bash -xe

cat dist/@meistersoft/pupakit/package.json | jq ".version=\"${PKG_VERSION}\"" > dist/@meistersoft/pupakit/temp.json && mv dist/@meistersoft/pupakit/temp.json dist/@meistersoft/pupakit/package.json
