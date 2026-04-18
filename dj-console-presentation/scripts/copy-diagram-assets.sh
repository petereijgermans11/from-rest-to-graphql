#!/usr/bin/env sh
set -e

# Rendered diagram SVGs
SRC="diagram-assets"
DEST="reveal/diagram-assets"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$SRC/"* "$DEST/"
echo "✅ Diagram assets copied to $DEST"

# Speaker photos, logos, and other static images used in slides
IMG_SRC="diagram-images"
IMG_DEST="reveal/diagram-images"
rm -rf "$IMG_DEST"
mkdir -p "$IMG_DEST"
cp -R "$IMG_SRC/"* "$IMG_DEST/"
echo "✅ Diagram images copied to $IMG_DEST"

