<!-- .slide: data-background-image="theme/background-images/01-title-background.jpg" data-background-size="cover" data-background-opacity="0.20" -->
# REST Still Works — Until It Doesn't

## Where REST earns its place
- Simple CRUD, stable domain, one or two known consumers → keep REST
- Mature tooling: OpenAPI, Swagger, Spring MVC — years of investment
- HTTP caching: ETags, Cache-Control, CDN — GraphQL gives you none of this out of the box
- Every team already knows it

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

## Where it broke down — for us
- DJ screen needs session + tracks + songs + artists → **one fat endpoint, or multiple round-trips**
- DJ Console needs to stay live → **polling** — no push, no WebSocket in REST

</div>

## Speaker notes
<!-- DELIVERY CUE — you just showed the app; now earn trust before showing the cost. "We love REST. We didn't start with GraphQL. Here's where we started."

- Group 1 — REST earns its place (say this firmly — no hedging)
  - HTTP caching is REST's biggest structural advantage over GraphQL — CDN, ETags, Cache-Control
  - "If your API has one consumer and a stable shape — keep REST. Full stop."
  - Mature tooling: 15 years of OpenAPI, Swagger, Spring MVC ecosystem
  - Position this as a journey, not a verdict against REST

- Group 2 — Where it broke in our app (click — land each bullet)
  - Fat endpoint: `GET /api/sessions/current` returns everything always — every client pays for every field
  - DJ Console: REST has no push — polling every N seconds means stale data windows and unnecessary load
  - "You saw the subscription work 90 seconds ago — that was the GraphQL answer to this third bullet"

- The bridge
  - Don't explain GraphQL yet — just let the pain land
  - "Let me show you what that fat endpoint actually returns"

BRIDGE — next slide opens the real API response in the browser. -->
