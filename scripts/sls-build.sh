#!/bin/bash

set -e

STAGE="dev"
REGION="ap-southeast-1"

echo "--> Running serverless build for stage $STAGE in region $REGION ..."

PROJECT_DIR=$(pwd)
SERVICE_DIR=$PROJECT_DIR
BUILD_DIR=$SERVICE_DIR/build
CF_BUILD_DIR=$BUILD_DIR/cloudformation
CONF_BUILD_DIR=$BUILD_DIR/config

echo "--> Cleaning up build directory $BUILD_DIR ..."
rm -r $BUILD_DIR || true
mkdir $BUILD_DIR
mkdir $CF_BUILD_DIR
mkdir $CONF_BUILD_DIR

echo "--> Running babel compile ..."
$PROJECT_DIR/node_modules/babel-cli/bin/babel.js $SERVICE_DIR/handler.js --out-file $BUILD_DIR/handler.js || true
$PROJECT_DIR/node_modules/babel-cli/bin/babel.js $SERVICE_DIR/functions -d $BUILD_DIR/functions || true
$PROJECT_DIR/node_modules/babel-cli/bin/babel.js $SERVICE_DIR/lib -d $BUILD_DIR/lib || true
# Copy static files
$PROJECT_DIR/node_modules/babel-cli/bin/babel.js $SERVICE_DIR/lib -d $BUILD_DIR/lib --copy-files || true

echo "--> Install node modules ..."
cp $SERVICE_DIR/package.json $BUILD_DIR || true
cp $SERVICE_DIR/yarn.lock $BUILD_DIR || true
cd $BUILD_DIR
yarn --production --ignore-optional
npm prune --production

echo "--> Copy sls dependencies ..."
cp $SERVICE_DIR/cloudformation/* $CF_BUILD_DIR || true
cp $SERVICE_DIR/config/* $CONF_BUILD_DIR || true
cp $SERVICE_DIR/serverless.yml $BUILD_DIR

# Make sure we're still inside the build dir
cd $BUILD_DIR

# Setup Serverless command options
SLS_BINARY_PATH="serverless deploy"
SLS_BUILD_OPTIONS="-v -r $REGION -s $STAGE"
export SLS_BINARY_PATH="$SLS_BINARY_PATH"

echo "--> Running sls $SLS_BUILD_OPTIONS ..."
$SLS_BINARY_PATH $SLS_BUILD_OPTIONS

echo "--> Build artifacts created at:"
echo "$BUILD_DIR/.serverless"

# Return back home
cd $PROJECT_DIR
