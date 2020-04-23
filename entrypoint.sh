#!/bin/bash

set -e

bundle install --clean --retry 9999 --path vendor

yarn install
yarn generate:all

if [ ! -f android/app/google-services.json ]; then
    cp mock-google-services.json android/app/google-services.json
fi
if [ ! -f .env ]; then
    cp .env.example .env
fi

mkdir $HOME/.vnc
echo emulator | vncpasswd -f > $HOME/.vnc/passwd

USER="" vncserver :0
$ANDROID_HOME/emulator/emulator -avd android_10 -no-window -qemu -vnc -gpu guest :0

exec "$@"
