ARG image=ubuntu:focal
ARG node_version=10.13.0-1nodesource1

FROM $image

ARG node_version

ENV HOME=/home/user

ENV DEBIAN_FRONTEND=noninteractive

ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_REPO=https://dl.google.com/android/repository

# ENV ANDROID_COMMANDLINETOOLS=commandlinetools-linux-6200805_latest.zip
ENV ANDROID_COMMANDLINETOOLS=sdk-tools-linux-4333796.zip
ENV ANDROID_COMMANDLINETOOLS_SHA256=f10f9d5bca53cc27e2d210be2cbc7c0f1ee906ad9b868748d74d62e10f2c8275

# React native uses Android Pie (API level 28)
ENV ANDROID_API_VERSION=28
ENV ANDROID_TOOLS_VERSION=29.0.3

ENV ANDROID_EMULATOR_IMAGE=android_10

# https://github.com/hadolint/hadolint/wiki/DL4006
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /build

RUN touch /start

RUN apt-get update && apt-get install -y --no-install-recommends \
  adb \
  bundler \
  git \
  # python-minimal \
  build-essential \
  curl \
  # ca-certificates \
  # gpg \
  # gpg-agent \
  # rbenv \
  # libssl-dev \
  openjdk-8-jdk \
  nodejs \
  ruby2.7 \
  ruby2.7-dev \
  tightvncserver \
  unzip \
  watchman \
  xfonts-base \
  yarnpkg

RUN mkdir $HOME
RUN mkdir $HOME/.android
RUN rm -fr /root && ln -sf $HOME /root

RUN mkdir "$ANDROID_HOME" \
  && cd "$ANDROID_HOME" \
  && curl  -SLO "$ANDROID_REPO/$ANDROID_COMMANDLINETOOLS" \
  # && sha256sum $ANDROID_COMMANDLINETOOLS | sha256sum --check - \
  && unzip "$ANDROID_COMMANDLINETOOLS" \
  && rm "$ANDROID_COMMANDLINETOOLS"

RUN yes Y | $ANDROID_HOME/tools/bin/sdkmanager --sdk_root="$ANDROID_HOME" --licenses || true

RUN $ANDROID_HOME/tools/bin/sdkmanager \
      --sdk_root="$ANDROID_HOME" \
      "build-tools;$ANDROID_TOOLS_VERSION" \
      "emulator" \
      "platforms;android-$ANDROID_API_VERSION" \
      "platform-tools" \
      "system-images;android-$ANDROID_API_VERSION;default;x86_64"

RUN echo no | $ANDROID_HOME/tools/bin/avdmanager \
                --verbose \
                create avd \
                --name $ANDROID_EMULATOR_IMAGE \
                --path $HOME/.android/avd/$ANDROID_EMULATOR_IMAGE.avd \
                --abi "x86_64" \
                --package "system-images;android-$ANDROID_API_VERSION;default;x86_64" \
                --tag "default" \
                --force

# RUN mv /root/.android/avd/android_10.ini

RUN ln -s /usr/bin/yarnpkg /usr/bin/yarn \
  && ln -s /usr/bin/yarnpkg /usr/bin/npm \
  && node --version \
  && yarn --version \
  && ruby --version \
  && bundle --version

RUN yarn global add react-native-cli

RUN echo //npm.pkg.github.com/:_authToken=$GITHUB_TOKEN > $HOME/.npmrc
RUN echo 'cache-folder "/build/.cache/yarn"' > $HOME/.yarnrc

COPY entrypoint.sh /usr/local/bin/

RUN chmod -R a+rw $HOME

ENTRYPOINT ["entrypoint.sh"]
