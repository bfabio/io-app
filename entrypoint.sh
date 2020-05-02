#!/bin/bash

set -e

if [ ! -d $ANDROID_SDK/platform-tools ]; then
    >&2 echo "Can't find the Android SDK, make sure to bind mount the directory"
    >&2 echo "with -v /path/to/Android/Sdk:/opt/android-sdk"
    exit 1
fi

bundle install --clean --retry 9999 --path vendor

yarn install
yarn generate:all

if [ ! -f .env ]; then
    cp .env.example .env
fi

yes | $ANDROID_TOOLS/tools/bin/sdkmanager \
    --sdk_root="$ANDROID_SDK" \
    "build-tools;$ANDROID_TOOLS_VERSION" \
    "emulator" \
    "platforms;android-$ANDROID_API_VERSION" \
    "platform-tools" \
    "system-images;android-$ANDROID_API_VERSION;default;x86"

echo no | $ANDROID_TOOLS/tools/bin/avdmanager \
    --verbose \
    create avd \
    --name $ANDROID_EMULATOR_IMAGE \
    --abi "x86" \
    --package "system-images;android-$ANDROID_API_VERSION;default;x86" \
    --tag "default" \
    --force

yarn run-android

exec "$@"
