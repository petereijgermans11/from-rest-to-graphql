# Copilot Instructions — Presentation Mode

## Global Intent
This repository is used to create a **technical presentation**.

When working with files in:
- `dj-console-presentation/slides-starter/`
- `dj-console-presentation/slides/`

you MUST:
- Produce **slide content**, not documentation
- Prefer **titles + short bullets**
- Avoid paragraphs and tutorials
- Assume **experienced Java / Spring developers**

## Path Scope (Mandatory)
- All presentation-relative paths in this document resolve from `dj-console-presentation/`
- Do NOT create or edit top-level `slides/` or `slides-starter/` folders outside `dj-console-presentation/`

## Slide Rules
- One slide = one idea
- Max 3–5 bullets per slide
- Bullets are fragments, not sentences
- Code examples must fit on one slide

## Slide Template Enforcement
When creating or updating slides:
- You SHOULD choose one of the templates in `.github/slide-templates/`
- Select the template explicitly:
  - slide-text.md for conceptual slides
  - slide-code.md for code-centric slides
  - slide-comparison.md for slides comparing alternatives
  - slide-image.md for diagrams or visuals
- Only when necessary, suggest a different slide structure, explain why and ask for approval
- Preserve template headings exactly

## Slide File Naming Convention (Mandatory)
All slide files MUST be placed under `dj-console-presentation/slides/act-NN-descriptive-words/` and named using:
`dj-console-presentation/slides/act-NN-descriptive-words/NN-short-descriptive-name.md`

Where:
- act folder: `act-NN-descriptive-words`
  - NN = two-digit act number (01, 02, 03, …)
  - descriptive-words: 1–2 lowercase hyphen-separated words describing the act's narrative purpose
- slide file: `NN-short-descriptive-name.md`
  - NN = two-digit slide number **within that act** (01, 02, 03, …)
  - short-descriptive-name: lowercase, hyphen-separated, 2–4 words, describes the slide's intent

Act folder examples:
- act-01-tension/
- act-02-first-demo/
- act-03-mechanics/
- act-04-trade-offs/
- act-05-demo-payoff/
- act-06-close/

Slide file examples:
- `dj-console-presentation/slides/act-01-tension/01-title.md`
- `dj-console-presentation/slides/act-01-tension/03-rest-pain-points.md`
- `dj-console-presentation/slides/act-02-first-demo/01-the-party.md`
- `dj-console-presentation/slides/act-03-mechanics/02-query-mapping.md`
- `dj-console-presentation/slides/act-05-demo-payoff/03-the-mistake.md`

Rules:
- Numbering resets to 01 at the start of each act
- Adding slides to one act does NOT renumber any other act
- Do NOT skip numbers within an act
- Do NOT rename files unless explicitly instructed
- File name and slide title MUST be aligned semantically
- `dj-console-presentation/slides/00-outline.md` stays at the root — it is the single source of truth

## Speaker Notes (Mandatory format)

Speaker notes MUST use structured formatting — NOT a blob of prose.

### Required structure
```
<!-- DELIVERY CUE — one sentence: what to do or say first on this slide

- Group 1 label (optional, omit if obvious)
  - Key point
  - Key point
    - Sub-detail only when essential

- Group 2 label (optional)
  - Key point
  - Key point

BRIDGE — one sentence: punchline, contrast, or link to the next slide -->
```

### Rules
- Opening line: delivery cue — tells the speaker what action to take ("Ask the audience…", "Fire this query…", "Let that land.")
- Body: bullet groups — 2–4 groups max, 2–4 bullets each
- Sub-bullets: only for a detail that cannot be cut (code reference, correction, caveat)
- Closing line: bridge or punchline — one sentence, no bullet
- NO paragraphs, NO full sentences inside bullets
- Blank line between groups and before/after the closing line
- Target 60–90 seconds per slide

## Source Interpretation
- `dj-console-api/` is the implementation source of truth for slide content
- Prioritize: `dj-console-api/src/main/java/`, `dj-console-api/src/main/resources/graphql/`, and relevant tests in `dj-console-api/src/test/`
- Use `dj-console-presentation/slides-starter/` files as optional raw narrative input
- Extract intent, architecture, and behavior from code
- Do NOT restate source content verbatim

## Explicit Anti‑Goals
- No REST or GraphQL introductions for beginners
- No framework documentation
- No marketing language

If in doubt: **shorter is better**

## Diagram Policy

For architecture, flow, or interaction explanations:
- Prefer diagrams over text
- Diagrams MUST be generated as Mermaid code
- Diagrams are stored under `dj-console-presentation/diagrams/`
- Slides reference diagrams, they do not embed Mermaid code

## Diagram Policy (Mandatory)

When a slide needs a visual (architecture, UML, flow, sequence):
1) Create or update a diagram file under `dj-console-presentation/diagrams/` (Mermaid .mmd preferred)
2) Reference that file in the slide-image template as:
   [DIAGRAM: diagrams/<area>/<name>.mmd]
3) Do NOT embed Mermaid/PlantUML directly in the slide
4) Keep the slide visual label stable; diagram edits happen in the diagram file


## Authoritative Source Rule — Spring GraphQL (Mandatory)
For Spring GraphQL concepts, APIs, annotations, and examples:
- You MUST treat the official Spring GraphQL reference documentation as the
  single authoritative source:
  https://docs.spring.io/spring-graphql/reference/index.html

- Do NOT rely on:
  - blog posts
  - StackOverflow answers
  - GitHub gists
  - pre-Spring-GraphQL articles
  - general GraphQL tutorials

- If information is not present or clearly documented in the reference:
  - say so explicitly
  - do NOT guess or invent behavior

- Prefer correctness over completeness.

## Diagram-to-Image Rendering Contract (Mandatory)
When creating or updating a slide using the image template:

1) The slide MUST contain BOTH markers:
  - [DIAGRAM: diagrams/<area>/<name>.(mmd|puml)]
  - [IMAGE: diagram-assets/<area>/<name>.svg]

2) The DIAGRAM file is the source of truth.
  - If it does not exist, create it under `dj-console-presentation/diagrams/`
  - Prefer Mermaid (.mmd) for flows/sequences
  - Prefer PlantUML (.puml) for UML/class diagrams

3) The IMAGE path MUST correspond 1:1 to the DIAGRAM path:
   diagrams/x/y.mmd  -> diagram-assets/x/y.svg
   diagrams/x/y.puml -> diagram-assets/x/y.svg

4) Never embed Mermaid or PlantUML code inside slides.
   Slides reference rendered assets only.

5) After generating diagrams, remind the user to run:
   npm run render:diagrams
   (or ./scripts/render-diagrams.sh)

## Diagram Rendering — Hash-Based Change Detection (Mandatory)

`render-diagrams.sh` uses **per-file SHA-256 sidecar hashes** to skip unchanged diagrams:
- For each source file `diagrams/x/y.mmd`, a sidecar `diagrams/x/y.mmd.sha256` is created
- SVG is only re-rendered when the source hash changes or the output is missing
- Sidecar `.sha256` files ARE committed to git — shared baseline for all collaborators
- SVG assets in `diagram-assets/` ARE committed alongside their source `.mmd`/`.puml`

**Consequence for agents**: never ask the user to force-re-render an unchanged diagram. Only edit the source `.mmd` or `.puml` file and prompt the user to run `npm run render:diagrams`.

## Reveal.js Policy
- Agents MUST NOT edit `dj-console-presentation/reveal/` files
- Slides reference only `diagram-assets/*.svg`
- Diagrams are rendered before rehearsal

## Reveal.js HTML Guardrail
Reveal `index.html` uses npm-based Reveal.js paths:
../node_modules/reveal.js/...

Agents MUST NOT rewrite these paths or inline Reveal assets.
