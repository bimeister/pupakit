ARG BASE_IMAGE
FROM "$BASE_IMAGE"
COPY . .
RUN ls -a && yarn run build
