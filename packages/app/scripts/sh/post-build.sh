#!/usr/bin/env bash
# Create nojekyll file
touch ../../docs/.nojekyll
if [ "$CI" = "true" ]; then
  # Detect OS and assign bundles
  case "$(uname -s)" in
    Darwin*)  BUNDLES="dmg,app" ;;
    Linux*)   BUNDLES="deb,appimage" ;;
    MSYS*|MINGW*|CYGWIN*) BUNDLES="nsis,msi" ;;
    *)        BUNDLES="app" ;;
  esac

  # Build Tauri
  pnpm tauri build --ci --bundles "$BUNDLES" --config '{"build":{"beforeBuildCommand":""}}'

  OS_NAME=$(uname -s)
  # Build Android
  if [ "$OS_NAME" = "Darwin" ] || [ "$OS_NAME" = "Linux" ]; then
    pnpm rimraf mobile/android && pnpm cap add android
  fi
  # Build iOS
  if [ "$OS_NAME" = "Darwin" ]; then
    pnpm rimraf mobile/ios && pnpm cap add ios
  fi
fi
