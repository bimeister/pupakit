ARG BASE_IMAGE
FROM "$BASE_IMAGE" as static-files
ARG BASE_HREF
COPY . .
RUN yarn run create-untracked-files && yarn run ng build --project=demo --base-href #

FROM nginx:latest
COPY --from=static-files /base/dist/demo /usr/share/nginx/html
