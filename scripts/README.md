# make-artifacts.sh
Validate and store the `docker-compose.yml` and `docker-compose.build.yml`. Usage examples:
```sh
# store images list to `images.list` and build yml to `docker-compose.build.effective.yml`
scripts/make-artifacts.sh

# store images list to `some-images.list` and build yml to `some-build.effective.yml`
IMAGES_FILE=some-images.list BUILD_EFFECTIVE_YML_FILE=some-build.effective.yml scripts/make-artifacts.sh
```
**Artifacts**
* `images.list`
* `docker-compose.build.effective.yml`
# build.sh
Execute docker-compose build task (in parallel mode). Usage examples:

```sh
# Build all services
scripts/build.sh

# Build only specified services
scripts/build.sh service1 service2

# Push docker images after success build (if variable 'CI' is present)
CI=yes scripts/build.sh

# Use 'some-build.effective.yml' intead default 'docker-compose.build.effective.yml'
BUILD_EFFECTIVE_YML_FILE=some-build.effective.yml scripts/build.sh

# Pull images from 'CACHE_FROM_YML_FILE' docker-compose yml file before build
CACHE_FROM_YML_FILE=branch-docker-compose.build.effective.yml scripts/build.sh
```
# deploy.sh
Usage examples:
```sh
# Deploy services and wait until everything starts, stop services, return exit code 0
# If some services are failed to start, return exit code 1
scripts/deploy.sh

# Run containers in background
scripts/deploy.sh --detach

# Use docker-compose.ports.yml if variable 'LISTEN_IP' is present
LISTEN_IP=0.0.0.0 scripts/deploy.sh --detach

# Provide to docker-compose '--project-name ${ENV_PREFIX}' if `ENV_PREFIX` is present, else '--project-name {random value}'
ENV_PREFIX=demo scripts/deploy.sh --detach

# Merge `${DEPLOY_YML}` with `${ADDITIONAL_YML_FILES}`(list, separator ';') and run containers in background
ADDITIONAL_YML_FILES="file-01.yml;file-02.yml" scripts/deploy.sh --detach

# Deploy to remote 'demo.example.com' as 'demouser'
TARGET_HOST=demo.example.com TARGET_USER=demouser LISTEN_IP=0.0.0.0 ENV_PREFIX=demo scripts/deploy.sh --detach
```
# backup.sh
Usage:
```sh
scripts/backup.sh docker-compose.yml prod
```
**Artifacts**
* `backup_dd_mm_yyyy.tar`
# restore.sh
Usage:
```sh
scripts/restore.sh docker-compose.yml prod backup_21_05_2019.tar
```
# export.sh
Save docker images. Usage:
```sh
# Read 'images.list' and save presented images to 'images.tar.gz'
scripts/export.sh

# Read 'some-images.list' and save presented images to 'images.tar.gz'
IMAGES_FILE=some-images.list scripts/export.sh

# Read 'images.list' and save presented images to 'master-images.tar'
TARGET_FILE=master-images.tar.gz scripts/export.sh
```
**Artifacts**
 * `images.tar.gz`
 
 # cp-from-image.sh
Copy files and folders from docker image. Source path is relative to [WORKDIR](https://docs.docker.com/engine/reference/#workdir).\
Usage: `scripts/cp-from-image ${IMAGE_LABELS} ${SOURCE} ${DESTINATION}`
```sh
# Copy file `source.xml` from docker image (founded by label `label-key1=val1`) to local `destination.xml`'
scripts/cp-from-image "label-key1=val1" source.xml destination.xml

# Copy directory `source_dir_` from docker image (founded by labels `label-key1=val1` and `labe2-key1=val2`) to local `destination_dir`'
scripts/cp-from-image "label-key1=val1;labe2-key1=val2" source_dir destination_dir
```
**Artifacts**
 * `${DESTINATION}`

 # cp-from-container.sh
Copy files and folders from docker image. Source path is relative to [WORKDIR](https://docs.docker.com/engine/reference/#workdir).\
Usage: `scripts/cp-from-container ${CONTAINER_NAME|CONTAINER_ID} ${SOURCE} ${DESTINATION}`
```sh
# Copy file `source.xml` from container `testrunner` to local `destination.xml`'
scripts/cp-from-container "testrunner" source.xml destination.xml

# Copy directory `source_dir_` from container "testrunner" to local `destination_dir`'
scripts/cp-from-container "testrunner" source_dir destination_dir
```
**Artifacts**
 * `${DESTINATION}`