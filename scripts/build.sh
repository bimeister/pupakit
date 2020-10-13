#! /bin/bash

set -x
set -e

BUILD_EFFECTIVE_YML_FILE=${BUILD_EFFECTIVE_YML_FILE:-docker-compose.build.effective.yml}

# Pull latest images from current bracnh (to enable using docker build cache)
if [[ -n ${CACHE_FROM_YML_FILE} ]]; then
    [ -f "$CACHE_FROM_YML_FILE" ] || { echo "File not found: '$CACHE_FROM_YML_FILE'."; exit 1; }    
    docker-compose -f ${CACHE_FROM_YML_FILE} pull $* || echo "[Build cache] Error on pulling build cache"    
fi 

# build
[ -f "$BUILD_EFFECTIVE_YML_FILE" ] || { echo "File not found: '$BUILD_EFFECTIVE_YML_FILE'."; exit 1; }
docker-compose -f ${BUILD_EFFECTIVE_YML_FILE} build --parallel $*

# push
if [[ -n $CI ]]; then
    docker-compose -f ${BUILD_EFFECTIVE_YML_FILE} push $*
fi
