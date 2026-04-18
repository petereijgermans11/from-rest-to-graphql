#!/usr/bin/env bash
set -euo pipefail

# Hash-based diagram rendering to avoid unnecessary SVG updates.
# Each diagram source file has a corresponding .sha256 hash file.
# Only re-renders if source content changes, output is missing, or
# the Mermaid config/theme has changed.

mkdir -p diagram-assets

# ── Mermaid dark-theme config ────────────────────────────────────────────────
# Matches the spring-graphql.css dark palette (#1e1e2e background).
# Presentation target: 16:9 widescreen (1920×1080). Diagrams are rendered at
# 1600px wide so they fill a slide without upscaling artefacts.
MMDC_CONFIG="scripts/mermaid-dark.json"
MMDC_BG="#1e1e2e"
MMDC_WIDTH=1600

# Function to compute hash of a file (works on macOS and Linux)
compute_hash() {
  if command -v shasum &> /dev/null; then
    shasum -a 256 "$1" | awk '{print $1}'
  elif command -v sha256sum &> /dev/null; then
    sha256sum "$1" | awk '{print $1}'
  else
    echo "Error: sha256sum or shasum not found" >&2
    exit 1
  fi
}

# Combined hash: source file + mermaid config (so theme changes force re-render)
compute_combined_hash() {
  local src="$1"
  local h_src h_cfg
  h_src=$(compute_hash "$src")
  h_cfg=$(compute_hash "$MMDC_CONFIG")
  echo "${h_src}+${h_cfg}"
}

# Function to read stored hash from .sha256 sidecar file
read_stored_hash() {
  local hash_file="$1.sha256"
  if [[ -f "$hash_file" ]]; then
    cat "$hash_file"
  else
    echo ""
  fi
}

# Function to store hash in .sha256 sidecar file
store_hash() {
  local file="$1"
  local hash="$2"
  local hash_file="$file.sha256"
  echo "$hash" > "$hash_file"
}

RENDERED=0

# Render PlantUML (.puml -> .svg) while preserving folder structure
while IFS= read -r -d '' file; do
  rel="${file#diagrams/}"
  outdir="diagram-assets/$(dirname "$rel")"
  out_file="${outdir}/$(basename "$rel" .puml).svg"

  current_hash=$(compute_hash "$file")
  stored_hash=$(read_stored_hash "$file")

  # Re-render if: source changed, output missing, or no hash stored
  if [[ "$current_hash" != "$stored_hash" ]] || [[ ! -f "$out_file" ]]; then
    mkdir -p "$outdir"
    plantuml -tsvg "$file" -o "../../$outdir"
    store_hash "$file" "$current_hash"
    ((RENDERED++))
  fi
done < <(find diagrams -type f -name "*.puml" -print0)

# Render Mermaid (.mmd -> .svg) while preserving folder structure
while IFS= read -r -d '' file; do
  rel="${file#diagrams/}"
  out="diagram-assets/${rel%.mmd}.svg"

  current_hash=$(compute_combined_hash "$file")
  stored_hash=$(read_stored_hash "$file")

  # Re-render if: source changed, config changed, output missing, or no hash stored
  if [[ "$current_hash" != "$stored_hash" ]] || [[ ! -f "$out" ]]; then
    mkdir -p "$(dirname "$out")"
    mmdc -i "$file" -o "$out" -t dark -b "$MMDC_BG" -c "$MMDC_CONFIG" --width "$MMDC_WIDTH"
    store_hash "$file" "$current_hash"
    ((RENDERED++))
  fi
done < <(find diagrams -type f -name "*.mmd" -print0)

if [[ $RENDERED -eq 0 ]]; then
  echo "✅ All diagrams up-to-date (no changes detected)"
else
  echo "✅ Rendered $RENDERED diagram(s) to diagram-assets/"
fi
