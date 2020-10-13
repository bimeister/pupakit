#! /bin/bash

set -e

IMAGES_FILE=${IMAGES_FILE:-images.list}
TARGET_FILE=${TARGET_FILE:-images.tar.gz}

IMAGES=`cat ${IMAGES_FILE}`
echo ${IMAGES} | xargs -n 1 docker pull
docker image save ${IMAGES} | gzip -c > ${TARGET_FILE}
