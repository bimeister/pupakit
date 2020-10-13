#! /bin/bash
set -u
set -e
set -x

CONTAINER_ID=$1
SOURCE_PATH=$2
TARGET_PATH=$3

WORK_DIR=$(docker inspect --format='{{.Config.WorkingDir}}' ${CONTAINER_ID})
docker cp ${CONTAINER_ID}:${WORK_DIR}/${SOURCE_PATH} ${TARGET_PATH}