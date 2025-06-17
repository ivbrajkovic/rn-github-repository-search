#!/bin/bash

# Launch the Expo Dev Client on the Android emulator
# Use this only when the emulator is running on the same PC as the DevContainer
# Requires ADB to be on your PATH

adb shell am start -a android.intent.action.VIEW \
  -d "exp+github-repository-search://expo-development-client/?url=http://10.0.2.2:8081"
