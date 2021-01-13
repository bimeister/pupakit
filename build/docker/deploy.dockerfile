ARG BUILD_IMAGE
FROM "$BUILD_IMAGE"
ARG GIT_COMMIT_HASH
ARG NPM_AUTH_TOKEN
RUN yarn run build-cli prepare-npmrc \
      --npmrc_path="./.npmrc" \
      --auth_token="${NPM_AUTH_TOKEN}" \
      --org_email="info@bimeister.com" \
      --registry="https://git.bimeister.com/api/v4/projects/98/packages/npm/" \
      --remove_scoped_registries="true" \
 && cp ./.npmrc ./.npmignore --target-directory ./dist/lib/ \
 \
 && cp ./LICENSE --target-directory ./dist/lib/ \
 && yarn run build-cli prepare-package-json \
      --commit_hash="${GIT_COMMIT_HASH}" \
      --package_json_path="./dist/lib/package.json"
RUN npm publish ./dist/lib/ --tag="latest" --access="public"
