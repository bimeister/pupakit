#! /bin/bash

set -e

. environment
export $(tail -n +2 environment | cut -d= -f1)

IMAGES_FILE=${IMAGES_FILE:-images.list}
BUILD_EFFECTIVE_YML_FILE=${BUILD_EFFECTIVE_YML_FILE:-docker-compose.build.effective.yml}

# store all docker images to file
docker-compose -f docker-compose.yml config | grep 'image: ' | awk '{print $2}' | sort | uniq > ${IMAGES_FILE}

# append backup\restore image
echo "loomchild/volume-backup" >> ${IMAGES_FILE}

# store build yml
docker-compose -f docker-compose.yml -f docker-compose.build.yml config > ${BUILD_EFFECTIVE_YML_FILE}

# store dev deploy yml
#docker-compose -f docker-compose.yml -f docker-compose.ports.yml config > docker-compose.dev.effective.yml
