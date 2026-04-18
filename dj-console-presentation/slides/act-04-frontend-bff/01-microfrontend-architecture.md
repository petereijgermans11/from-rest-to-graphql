<!-- .slide: class="mfe-slide" style="background: linear-gradient(145deg, #080810 0%, #1a1a28 42%, #0a1e32 100%)" -->

# Microfrontends

<p class="mfe-hero-line"><span class="mfe-hero-accent">One shell</span> · independently deployable slices · <span class="mfe-hero-accent">stitched together at runtime</span></p>

[DIAGRAM: diagrams/architecture/mfe-pattern.mmd]
<div class="mfe-diagram-frame">

[IMAGE: diagram-assets/architecture/mfe-pattern.svg]

</div>

## Speaker notes
<!-- Big picture only — the next slide lands this repo in detail.

- Why teams reach for this: autonomy per feature, smaller blast radius, incremental delivery without rewriting the whole SPA.
- Not a static shared library: remote URLs come from a federation manifest at runtime.
- The host still orchestrates routing, shell UX, and shared context; remotes plug in as lazy-loaded capabilities.
- Bridge line for the room: “Next slide — how we actually wired that in this Angular workspace.” -->
