<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The Session Model

[DIAGRAM: diagrams/domain/domain-model-session.mmd]
<div class="diagram-frame diagram-tall">

[IMAGE: diagram-assets/domain/domain-model-session.svg]

</div>

- `MixSession` is the aggregate root — it owns tracks, events, and the DJ

## Speaker notes
<!-- Walk top-down: MixSession owns everything on this side of the domain.

- MixSession
  - Aggregate root: owns `SessionTrack`s and `CrowdEvent`s
  - `DiscJockey` is referenced — not owned — carries the personal `trackLibrary`
  - `getStatus()` is DERIVED — `WARM_UP` / `PEAK` / `COOL_DOWN` emerge from what was played

- DiscJockey
  - Holds a `trackLibrary` — personal subset of tracks used for selection
  - `findNextNewTrack` + `findTrackByTitle` — all selection logic lives here, not in the session

- CrowdEvent sealed hierarchy
  - Five variants — exhaustive switch in `applyEvent()`
  - Compiler enforces completeness: new event type forces a new case

Next slide: the catalog that feeds the DJ's library. -->

