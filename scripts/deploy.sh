#! /bin/bash

function docker-compose-cmd
{
    if [ -z "$TARGET_HOST" ]; then
        docker-compose -f ${DEPLOY_YML} --project-name ${ENV_PREFIX} ${@}
    else
        FILE=id_rsa
        if [ -f "id_rsa" ]; then
            cat ${DEPLOY_YML} | ssh -i id_rsa -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${TARGET_USER}@${TARGET_HOST} "docker-compose -f - --project-name ${ENV_PREFIX} ${@}"
        else
            echo "File id_rsa (identity_file) does not exist. Will be ask password for ssh connection."
            cat ${DEPLOY_YML} | ssh ${TARGET_USER}@${TARGET_HOST} "docker-compose -f - --project-name ${ENV_PREFIX} ${@}"
        fi
    fi
}

function docker-cmd
{
    if [ -z "$TARGET_HOST" ]; then
        docker ${@}
    else
        FILE=id_rsa
        if [ -f "id_rsa" ]; then
            cat ${DEPLOY_YML} | ssh -i id_rsa -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${TARGET_USER}@${TARGET_HOST} "docker ${@}"
        else
            echo "File id_rsa (identity_file) does not exist. Will be ask password for ssh connection."
            cat ${DEPLOY_YML} | ssh ${TARGET_USER}@${TARGET_HOST} "docker ${@}"
        fi
    fi
}

# put file (from base64 string) in remote container
function put-remote-cmd
{
  FILE_IN_BASE64=$1
  CONTANER_ID_OR_NAME=$2
  FULL_FILE_PATH_IN_CONTAINER=$3

  TEMP_FILE_NAME=$(mktemp);
  echo $FILE_IN_BASE64 | base64 --decode > $TEMP_FILE_NAME;
  scp -i id_rsa -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" $TEMP_FILE_NAME ${TARGET_USER}@${TARGET_HOST}:$TEMP_FILE_NAME
  docker-cmd cp $TEMP_FILE_NAME $CONTANER_ID_OR_NAME:$FULL_FILE_PATH_IN_CONTAINER;
  ssh -i id_rsa -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" ${TARGET_USER}@${TARGET_HOST} "rm ${TEMP_FILE_NAME}"
  rm $TEMP_FILE_NAME;
}

set -x
set -e
. environment
export $(tail -n +2 environment | cut -d= -f1)

DETACH_MODE=$1
DEPLOY_YML=${DEPLOY_YML:-docker-compose.deploy.effective.yml}
ENV_PREFIX=${ENV_PREFIX:-$(openssl rand -hex 2)}
TARGET_USER=${TARGET_USER:-tester}

SERVICES=${@:2}

if [[ ${DETACH_MODE} != "--detach" ]]; then
    # clean on exit
    trap "docker-compose-cmd \"down\"" EXIT
fi

# check LISTEN_IP
if [ -z "$LISTEN_IP" ]; then
    docker-compose -f docker-compose.yml config > ${DEPLOY_YML}
else
    docker-compose -f docker-compose.yml -f docker-compose.ports.yml config > ${DEPLOY_YML}
fi

# merge DEPLOY_YML and files from ADDITIONAL_YML_FILES
if [ -n "${ADDITIONAL_YML_FILES}" ]; then
    for yml_file in $(echo ${ADDITIONAL_YML_FILES} | tr ";" "\n")
    do
        docker-compose -f ${DEPLOY_YML} -f ${yml_file} config > temp-${DEPLOY_YML}
        rm ${DEPLOY_YML}
        mv temp-${DEPLOY_YML} ${DEPLOY_YML}
    done
fi

docker-compose-cmd "up -d --no-build ${SERVICES}"
target_running_count=$(docker-cmd ps -aq --filter name=${ENV_PREFIX} | wc -l)

if [ $target_running_count -eq 0 ]; then
    echo "All containers failed to create" 1>&2;
    docker-compose-cmd "ps"
    exit 1
fi

FRONTEND_CONTAINER_ID=$(docker-cmd ps -aq --filter name=$ENV_PREFIX.*frontend);

if [ ! -z $SSL_CERTIFICATE ] && [ ! -z $SSL_CERTIFICATE_FILE_IN_BASE64 ]; then
  put-remote-cmd $SSL_CERTIFICATE_FILE_IN_BASE64 $FRONTEND_CONTAINER_ID $SSL_CERTIFICATE
fi

if [ ! -z $SSL_CERTIFICATE_KEY ] && [ ! -z $SSL_CERTIFICATE_KEY_FILE_IN_BASE64 ]; then
  put-remote-cmd $SSL_CERTIFICATE_KEY_FILE_IN_BASE64 $FRONTEND_CONTAINER_ID $SSL_CERTIFICATE_KEY
fi

fail_counter=0
pass_counter=0

while [ $pass_counter -ne 3 ]
do
    running_count=$(docker-cmd ps -aq --filter name=${ENV_PREFIX} --filter status=running | wc -l)
    if [ $target_running_count -eq $running_count ]; then
        pass_counter=$((pass_counter + 1))
    else
        fail_counter=$((fail_counter + 1))
        pass_counter=0
    fi

    # raise error after repeats
    if [ $fail_counter -eq 10 ]; then
        echo "Some containers failed to start" 1>&2;
        docker-compose-cmd "ps"
        exit 1
    fi
    sleep 5
done
