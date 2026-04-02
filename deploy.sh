#!/usr/bin/env bash
set -euo pipefail

# Build the Vite app
echo "Building..."
npm run build

# Clear and repopulate docs/
echo "Copying build output to docs/..."
rm -rf docs
cp -r dist docs

# Commit and push docs/
echo "Committing and pushing docs/..."
git add docs/
git commit -m "Deploy: update docs build"
git push

# Clean up dist/ so it's not accidentally committed later
echo "Cleaning up dist/..."
rm -rf dist

echo "Done."
