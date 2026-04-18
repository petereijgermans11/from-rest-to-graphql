#!/usr/bin/env sh
set -e

SRC="node_modules/reveal.js"
DEST="reveal/vendor/reveal"
CUSTOM_THEMES="reveal/theme"

rm -rf "$DEST"
mkdir -p "$DEST"

# Core reveal assets
cp "$SRC/dist/reveal.js"   "$DEST/"
cp "$SRC/dist/reveal.css" "$DEST/"
cp "$SRC/dist/reset.css"  "$DEST/"

# Themes
mkdir -p "$DEST/theme"
cp -R "$SRC/dist/theme/"* "$DEST/theme/"

# Theme fonts (required by white.css)
mkdir -p "$DEST/theme/fonts"
cp -R "$SRC/dist/theme/fonts/"* "$DEST/theme/fonts/"

# Plugins (Reveal.js 5.x layout)
mkdir -p "$DEST/plugin"
cp -R "$SRC/plugin/markdown"  "$DEST/plugin/"
cp -R "$SRC/plugin/notes"     "$DEST/plugin/"
cp -R "$SRC/plugin/highlight" "$DEST/plugin/"

# Patch speaker-view notes font — the popup embeds all CSS inside notes.js/notes.esm.js;
# spring-graphql.css cannot reach it.  Targets (from unpatched node_modules source):
#   1.2em  → 0.85em : .speaker-controls-notes .value  (notes text, all layouts)
#   1.25em → 0.9em  : #speaker-controls base for wide / tall / notes-only layouts
#   18px   → 13px   : #speaker-controls base for default layout (anchored on unique context)
#   16/14/12px → 12/11/10px : default layout @media breakpoints (900px, 1080px, 800px)
for _f in "$DEST/plugin/notes/notes.js" "$DEST/plugin/notes/notes.esm.js"; do
  sed -i '' 's/font-size: 1\.2em/font-size: 0.85em/g'  "$_f"
  sed -i '' 's/font-size: 1\.25em/font-size: 0.9em/g'   "$_f"
  sed -i '' 's/overflow: auto;\\n\\t\\t\\t\\tfont-size: 18px/overflow: auto;\\n\\t\\t\\t\\tfont-size: 13px/g' "$_f"
  # Breakpoints: patch smallest value first so earlier replacements are never re-matched
  sed -i '' 's/layout=\\"default\\"] #speaker-controls {\\n\\t\\t\\t\\t\\tfont-size: 12px/layout=\\"default\\"] #speaker-controls {\\n\\t\\t\\t\\t\\tfont-size: 10px/g' "$_f"
  sed -i '' 's/layout=\\"default\\"] #speaker-controls {\\n\\t\\t\\t\\t\\tfont-size: 14px/layout=\\"default\\"] #speaker-controls {\\n\\t\\t\\t\\t\\tfont-size: 11px/g' "$_f"
  sed -i '' 's/layout=\\"default\\"] #speaker-controls {\\n\\t\\t\\t\\t\\tfont-size: 16px/layout=\\"default\\"] #speaker-controls {\\n\\t\\t\\t\\t\\tfont-size: 12px/g' "$_f"
done
echo "✅ Patched speaker-view notes font-size (all layouts)"

# Custom themes — copy last so they overlay the vendor themes
if [ -d "$CUSTOM_THEMES" ]; then
  cp "$CUSTOM_THEMES/"*.css "$DEST/theme/"
  # Copy custom font subfolders (e.g. Cinzel for thank-you slide)
  if [ -d "$CUSTOM_THEMES/fonts" ]; then
    cp -R "$CUSTOM_THEMES/fonts/"* "$DEST/theme/fonts/"
  fi
  echo "✅ Custom themes copied to $DEST/theme"
fi


echo "✅ Reveal.js assets (including fonts) copied to $DEST"