<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The Music Library

[DIAGRAM: diagrams/domain/domain-model-library.mmd]
<div class="diagram-frame diagram-tall">

[IMAGE: diagram-assets/domain/domain-model-library.svg]

</div>

- `MusicLibrary` is the static catalog — `SessionTrack` is derived from it at runtime

## Speaker notes
<!-- Point at the dashed arrow from SessionTrack to Track — that's the bridge between the two worlds.

- MusicLibrary
  - Static aggregate: Artists, Songs, Tracks — shared, read-only during a session
  - The library doesn't know about sessions — clean boundary

- Track → Song → Artist chain
  - `Track` is a playable version of a `Song` — adds `energyLevel` and `CuePoint`s
  - `Song` carries `audioFile` (nullable) — optional enrichment, not always present
  - `Artist` is the leaf — name only

- The bridge
  - `SessionTrack.fromLibrary(Track)` copies a library track into the session context
  - Cue points travel with it — the DJ can edit them per session without mutating the library

These names appear directly in the SDL and the live query — next slide makes that explicit. -->

