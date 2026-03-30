#!/usr/bin/env bash

# 🚀 Post-build script for Tauri and Mobile platforms
# This script handles documentation flags and cross-platform builds in CI environments.

set -e # Exit on error

# 📄 Create .nojekyll to ensure GitHub Pages processes the docs correctly
echo "📝 Creating .nojekyll file..."
touch ../../docs/.nojekyll

# 🤖 CI-specific build process
if [ "$CI" = "true" ]; then
  echo "🛠️ CI detected. Starting build process..."

  # 💻 Detect OS and assign appropriate build bundles
  OS_TYPE="$(uname -s)"
  case "$OS_TYPE" in
    Darwin*)  BUNDLES="dmg,app" ;;
    Linux*)   BUNDLES="deb,appimage" ;;
    MSYS*|MINGW*|CYGWIN*) BUNDLES="nsis,msi" ;;
    *)        BUNDLES="app" ;;
  esac

  echo "📦 Target bundles for $OS_TYPE: $BUNDLES"

  # 🏗️ Build Tauri application
  echo "🏗️ Building Tauri..."
  pnpm tauri build --ci --bundles "$BUNDLES" --config '{"build":{"beforeBuildCommand":""}}'

  # 📱 Mobile builds (Android/iOS)
  echo "📱 Preparing mobile platforms..."
  
  # 🤖 Build Android (on macOS and Linux)
  if [[ "$OS_TYPE" == "Darwin"* ]] || [[ "$OS_TYPE" == "Linux"* ]]; then
    echo "🤖 Adding Android platform..."
    pnpm rimraf mobile/android && pnpm cap add android
  fi

  # 🍎 Build iOS (only on macOS)
  if [[ "$OS_TYPE" == "Darwin"* ]]; then
    echo "🍎 Adding iOS platform..."
    pnpm rimraf mobile/ios && pnpm cap add ios
  fi

  echo "✅ CI build process completed successfully!"
else
  echo "⏭️ Not running in CI. Skipping distribution builds."
fi
