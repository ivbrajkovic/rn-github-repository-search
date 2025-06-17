# Base devcontainer with Node.js
FROM mcr.microsoft.com/devcontainers/javascript-node:22 AS base

# Set Android SDK environment variables
ENV ANDROID_SDK_ROOT=/home/node/android-sdk
ENV ANDROID_NDK_HOME=${ANDROID_SDK_ROOT}/ndk/27.1.12297006
ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/emulator:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin

# Install base OS packages (as root)
FROM base AS packages
USER root
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  openjdk-17-jdk \
  build-essential \
  watchman && \
  rm -rf /var/lib/apt/lists/*

# Install Android CLI tools as node user
FROM packages AS android-cli-tools
USER node
WORKDIR /home/node

ARG CMDLINE_TOOLS_REV=11076708
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
  curl -sSL -o /tmp/cli.zip \
  https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_REV}_latest.zip && \
  unzip -q /tmp/cli.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools && \
  rm /tmp/cli.zip && \
  mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools \
  ${ANDROID_SDK_ROOT}/cmdline-tools/latest

# Install SDK components and accept licenses as node
FROM android-cli-tools AS android-sdk
USER node
WORKDIR /home/node

RUN yes | sdkmanager --licenses && \
  sdkmanager \
  "platform-tools" \
  "platforms;android-34" \
  "platforms;android-35" \
  "build-tools;35.0.0" \
  "ndk;27.1.12297006"

# Final image
FROM android-sdk AS final
USER node
WORKDIR /home/node

# Install JavaScript tooling
RUN npm install -g pnpm

# Devcontainer indicator
ENV DEVCONTAINER=true
