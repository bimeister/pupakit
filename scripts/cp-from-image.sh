#! /bin/bash
set -u
set -e

FILTER=''
LABELS_IN=$(echo $1 | tr ";" "\n")
SOURCE_PATH=$2
TARGET_PATH=$3

for LABEL_VALUE in ${LABELS_IN}
do
    FILTER+="--filter label=${LABEL_VALUE} "
done

SOURCE_IMAGE=$(docker image ls ${FILTER} -q)
IMAGES_COUNT=$(echo ${SOURCE_IMAGE} | wc -w)
[[ "${IMAGES_COUNT}" -eq 0 ]] && (echo "Image(s) not found" && exit 1)
[[ "${IMAGES_COUNT}" -gt 1 ]] && (echo "Found more than one image. Try search by unique label(s)" && exit 1)

TEMP_CONTAINER=$(docker create ${SOURCE_IMAGE})
WORK_DIR=$(docker inspect --format='{{.Config.WorkingDir}}' ${TEMP_CONTAINER})
trap "docker rm ${TEMP_CONTAINER}" EXIT
docker cp ${TEMP_CONTAINER}:${WORK_DIR}/${SOURCE_PATH} ./${TARGET_PATH}
