# Create nojekyll file
touch ../../docs/.nojekyll
# Build Tauri
pnpm tauri build --ci --bundles app --config '{"build":{"beforeBuildCommand":""}}'
# Build Android
pnpm rimraf mobile/android && pnpm cap add android
# Build iOS
pnpm rimraf mobile/ios && pnpm cap add ios
