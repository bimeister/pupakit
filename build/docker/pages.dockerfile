ARG BASE_IMAGE
FROM "$BASE_IMAGE"
COPY . .
RUN yarn run barrel && yarn run ng build --project=demo --base-href ${CI_PAGES_URL}
