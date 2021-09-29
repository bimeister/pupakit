ARG BASE_IMAGE
FROM "$BASE_IMAGE"
COPY . .
RUN yarn run create-untracked-files && yarn run yarn run build:cache --project=demo --base-href ${CI_PAGES_URL}
