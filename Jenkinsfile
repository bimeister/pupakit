def PUSH
pipeline {
  agent any
  stages {
      stage('Initialize') {
          when {
            environment name: 'PUSH', value: 'true'
          }
          steps {
            script{
              PUSH = true
            }
          }
        }
    stage('Build') {
      parallel {
        stage('Pre-release') {
          when {
            expression {params.PUSH_TYPE == 'pre-release'}
          }
          steps {
            sh '''export PKG_VERSION=${BUILD_VERSION}-pre-release.$(git rev-parse --short HEAD) && docker build --build-arg PKG_VERSION="${PKG_VERSION}" --build-arg REPOSITORY_URL="${REPOSITORY_URL}" --build-arg REPOSITORY_LOGIN="${REPOSITORY_LOGIN}" --build-arg REPOSITORY_PASSWORD="${REPOSITORY_PASSWORD}" --build-arg REPOSITORY_EMAIL="${REPOSITORY_EMAIL}" --build-arg PUSH=${PUSH} .'''
          }
        }
        stage('Release') {
          when {
            expression {params.PUSH_TYPE == 'release'}
          }
          steps {
            sh 'export PKG_VERSION=${BUILD_VERSION} && docker build --build-arg PKG_VERSION="${PKG_VERSION}" --build-arg REPOSITORY_URL="${REPOSITORY_URL}" --build-arg REPOSITORY_LOGIN="${REPOSITORY_LOGIN}" --build-arg REPOSITORY_PASSWORD="${REPOSITORY_PASSWORD}" --build-arg REPOSITORY_EMAIL="${REPOSITORY_EMAIL}" --build-arg PUSH=${PUSH} .'
          }
        }
      }
    }
  }
  post {
    fixed {
      slackSend color: 'good', channel: "ci_common", message: ":sunglasses: Fixed pupakit: '${env.GIT_BRANCH} [${env.BUILD_NUMBER}]' (<${env.RUN_DISPLAY_URL}|Open>)"
    }
    failure {
      slackSend color: 'danger', channel: "ci_common", message: ":angry: Failed pupakit: '${env.GIT_BRANCH} [${env.BUILD_NUMBER}]' (<${env.RUN_DISPLAY_URL}|Open>)"
    }
  }
  environment {
    REPOSITORY_URL="http://npm.meistersoft.ru:4873"
    REPOSITORY_LOGIN="meistersoft"
    REPOSITORY_PASSWORD="4752F3C937AF78759643A44F0E6E3E6526BFFEC79CEA310009F0DD01EFB0AAF1"
    REPOSITORY_EMAIL="info@meistersoft.ru"
    BUILD_VERSION="0.1.0"
  }
  parameters {
    choice(name: 'PUSH_TYPE', choices: ['pre-release', 'release'], description: 'Package release type.')
    booleanParam(name: 'PUSH', defaultValue: false, description: 'Push the package to the npm repository.')
  }
}
