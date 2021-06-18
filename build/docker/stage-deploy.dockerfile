ARG BASE_IMAGE
FROM "$BASE_IMAGE" as static-files
ARG BASE_HREF
COPY . .
RUN yarn run barrel && yarn run ng build --project=demo --base-href ${BASE_HREF}

FROM nginx:latest
COPY --from=static-files /base/dist/demo /usr/share/nginx/html
