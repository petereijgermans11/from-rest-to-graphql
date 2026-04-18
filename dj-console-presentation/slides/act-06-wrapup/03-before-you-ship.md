<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Before You Ship

## *"It works"* vs *"It survives production"*

### 🔒 Subscription hardening
- Auth: validate token from `connectionParams` — HTTP headers are gone after handshake
- Reconnect: `graphql-ws` retries; `Flux.concat` re-delivers snapshot — no stale UI
- Observability: WebSocket frames need explicit Micrometer instrumentation

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

### 📄 Pagination discipline
- Add cursor-based pagination (`first` / `after`) where lists grow unbounded
- Keep connection shapes stable — breaking pagination is a breaking change
- Spring GraphQL `ScrollSubrange` + `Window<T>` supports keyset/offset pagination

</div>

<div class="fragment fade-in" data-fragment-index="2" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

### 🛡️ Security depth
- Field-level authorization: `@PreAuthorize` on `@SchemaMapping` methods
- Method-level security applies per resolver — not per HTTP endpoint
- Mask sensitive fields by returning `null` rather than throwing from a resolver

</div>

## Speaker notes
<!-- DELIVERY CUE — one click per topic; land each before moving on.

- Framing (say before first click)
  - "Everything you saw today works. This slide is about what comes next in a real production system."
  - "Three areas — each is non-trivial, none is GraphQL-specific friction."

- Fragment 1 — Subscription hardening
  - Auth: `Authorization` header is only available at WebSocket handshake (HTTP Upgrade request)
    - Post-handshake: use `graphql-ws` `connectionParams` payload; validate in a `WebSocketInterceptor`
  - Reconnect: `graphql-ws` handles retries; Spring's `Flux.concat(snapshot, liveStream)` re-delivers state
  - Observability: HTTP traces don't span WebSocket frames — add `observation` beans or structured logging per session ID

- Fragment 2 — Pagination
  - Cursor pagination (`first`/`after`) is better than offset for growing lists — stable under concurrent inserts
  - Spring GraphQL reference: `ScrollSubrange` + `CursorStrategy` + `Window<T>` — built-in support since 1.2
  - Deprecating `tracks(last: Int)` in favour of a proper connection type is a planned schema evolution

- Fragment 3 — Security depth
  - `@PreAuthorize` on individual `@SchemaMapping` / `@QueryMapping` methods — Spring Security applies normally
  - Prefer returning `null` from a resolver over throwing for sensitive fields — partial data is valid in GraphQL
  - `DataFetcherExceptionResolver` handles auth errors cleanly without exposing internals in `errors[]`

BRIDGE — of these three, subscriptions carry the most operational weight — let's be specific. -->
