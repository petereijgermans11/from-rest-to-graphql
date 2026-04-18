<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The Party & The DJ

## The scene
- A crowded venue — people are here to dance
- The DJ plays songs to get everyone to the dancefloor
- The crowd reacts: cheers, silence, requests

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

## The DJ
- **Has** — a curated track library with energy levels
- **Does** — runs a session, selects tracks
- **Should** — react to the crowd, keep the energy up

</div>

<div class="fragment fade-in" data-fragment-index="2" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">
<div style="text-align:center; margin:0.45em 0 0.8em;">
  <a href="http://localhost:4200/" target="_blank"
     style="display:inline-block; padding:0.42em 1.35em; border-radius:12px;
            background:rgba(65,195,157,0.16); border:2px solid #41c39d;
            color:#41c39d; font-size:0.86em; font-weight:700;
            text-decoration:none; letter-spacing:0.03em;">
    I want Music DJ !
  </a>
</div>
</div>


## Speaker notes
<!-- DELIVERY CUE — slide appears with background + "The scene" bullets visible; click once to reveal the DJ block (heading + bullets together).

- The scene (visible on load)
  - Keep it human: a party is something everyone has been to
  - "Reads the room" = first hint that events drive decisions — don't say MixSession yet
  - "What plays next depends on what just happened" = event-driven state in plain language

- The DJ (first click — whole block appears)
  - "Has" — personal subset of the global catalog; selection operates on this list, not the global MusicLibrary
  - "Does" — `MixSession` is the aggregate root; `applyEvent(CrowdEvent)` is the single write path
  - "Constraint" — Status (WARM_UP / PEAK / COOL_DOWN) is derived from track history, never stored
  - The DJ can't fake a PEAK — the crowd has to earn it
  - Same idea surfaces in the schema: `status` is a computed field, not a stored one

This is a rich domain, not a CRUD app — the GraphQL schema reflects that. Next: the model in pictures. -->
