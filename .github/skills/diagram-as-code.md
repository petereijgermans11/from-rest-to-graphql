# Skill: Diagram-as-Code with Rendered Assets

## Purpose
Create diagrams as code (Mermaid or PlantUML), render them to SVG assets, and reference the rendered images from slides.

This ensures:
- diagrams are version-controlled
- slides stay clean and readable
- Reveal.js renders deterministic assets

## Definitions
- **Diagram source**: files under `diagrams/`
  - Mermaid: `.mmd`
  - PlantUML: `.puml`
- **Rendered asset**: SVG under `diagram-assets/`
  - Same relative path and filename (extension `.svg`)

## Choosing format
- Mermaid (.mmd): flows, sequences, architecture, request paths
- PlantUML (.puml): UML class diagrams, aggregates, domain structure

## Rules
- Prefer intent over completeness
- Use domain language
- Diagrams must fit on one slide
- Avoid framework-specific details unless necessary
- Avoid low-level implementation details

## Areas
- architecture/
- flows/
- domain/
- graphql/

## Mandatory Output Pattern (Image Slides)

When creating or updating a slide that includes a diagram:

1. Ensure a diagram source exists:
   `diagrams/<area>/<name>.(mmd|puml)`

2. Ensure the slide references BOTH:
   `[DIAGRAM: diagrams/<area>/<name>.(mmd|puml)]`
   `[IMAGE: diagram-assets/<area>/<name>.svg]`

3. The IMAGE path must map 1:1 to the DIAGRAM path:
   - `diagrams/x/y.mmd`  → `diagram-assets/x/y.svg`
   - `diagrams/x/y.puml` → `diagram-assets/x/y.svg`

## Rendering Contract
- Slides NEVER embed Mermaid or PlantUML code
- Rendering is done via repository scripts:
  - `scripts/render-diagrams.sh`
- The script uses **per-file SHA-256 sidecar hashes** — only re-renders when source changes:
  - `diagrams/x/y.mmd` → sidecar `diagrams/x/y.mmd.sha256` (committed to git)
  - Re-renders if: source hash changed, SVG missing, or no sidecar yet
- If new or changed diagrams are produced, remind the user to run:
  `npm run render:diagrams`
- Do NOT ask users to force-re-render unchanged diagrams

## What to Commit
- ✅ `diagrams/<area>/<name>.mmd` or `.puml` — source of truth
- ✅ `diagrams/<area>/<name>.mmd.sha256` or `.puml.sha256` — shared hash baseline
- ✅ `diagram-assets/<area>/<name>.svg` — rendered output

## Choosing Diagram Language
- Use **Mermaid (.mmd)** for:
  - flows
  - sequences
  - request / execution paths
  - architecture overviews
- Use **PlantUML (.puml)** for:
  - UML-style class diagrams
  - aggregates
  - domain structure

## Anti‑Patterns
- Inline diagram code inside slides
- Referencing `.mmd` / `.puml` directly as images
- Using screenshots instead of rendered assets
