<!-- .slide: class="mfe-slide" style="background: linear-gradient(145deg, #0a120e 0%, #1e1e2e 44%, #0c2228 100%)" -->

# Microfrontends in this app

<p class="mfe-bridge">Native Federation · <strong>dj-console-ui</strong> host · remotes on <strong>:4201</strong> &amp; <strong>:4202</strong> · one <strong>GraphQL</strong> backend</p>

[DIAGRAM: diagrams/architecture/mfe-this-app.mmd]
<div class="mfe-diagram-frame">

[IMAGE: diagram-assets/architecture/mfe-this-app.svg]

</div>

## Speaker notes
<!-- Map + concrete wiring — lazy load, manifest, same API.

- Remotes: `mfe-crowd-vote` (crowd voting screen), `mfe-spotlight` (GraphQL spotlight panel).
- Boot: `initFederation('/federation.manifest.json')` in `main.ts` — manifest points remotes at dev URLs (ports 4201 / 4202).
- Lazy load: `loadRemoteModule('mfe-crowd-vote' | 'mfe-spotlight', './Component')` from `dj-console.ts` when the host loads a remote.
- Render: `*ngComponentOutlet` in the host template — remote runs inside the shell, not a separate page handoff.
- Same Spring GraphQL API (:8080 via proxy) for every slice — one schema, many UI surfaces.
- Demo cue: the "Load … remote" buttons in the host — one user journey, multiple deployable bundles.

BRIDGE — one schema, three clients, three different query shapes. Next: the BFF pattern that makes this possible. -->
