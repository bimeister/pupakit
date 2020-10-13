#! /bin/bash

DITRIBUTE_USERS=$(curl -s --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" ${CI_API_V4_URL}/groups/gitlab-distributors/members  | jq -e '.[] | .username')

if [[ ! ${DITRIBUTE_USERS} =~ ${GITLAB_USER_LOGIN} ]] ; then
    echo "No access to deploy (GITLAB_USER_LOGIN=${GITLAB_USER_LOGIN})."
    exit 1
fi
