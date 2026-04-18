<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# REST vs GraphQL

| Aspect | REST | GraphQL |
|---|---|---|
| API shape | Server-defined | Client-defined |
| Versioning | `/v1`, `/v2` — explicit | Additive by default; deprecate fields |
| HTTP caching | Native — CDN, ETags | No URL-based caching |
| Error model | HTTP status + RFC 9457 `ProblemDetail` | Errors in body, HTTP 200 by default |
| Tooling maturity | Excellent — OpenAPI, Swagger | Good — GraphiQL, schema introspection |
| Over/under-fetching | Common pain point | Eliminated by design |

## Speaker notes
<!-- Walk the table row by row — show both sides fairly.

- Where GraphQL wins
  - API shape: client-defined → eliminates over/under-fetching (the REST Tax slide proved this)
  - Versioning: additive by default; field deprecation is cleaner than `/v1` accumulation

- Where REST wins
  - HTTP caching: CDN, ETags, Cache-Control — GraphQL's biggest structural weakness
    - Be honest: don't minimise this
  - Tooling: 15-year head start — OpenAPI, Swagger, Spring MVC ecosystem

- Where it's nuanced
  - Error model: REST now uses RFC 9457 `ProblemDetail` — structured, machine-readable, HTTP-status-coupled
    - GraphQL: HTTP 200 always, errors in `errors[]` array alongside partial data
    - Neither is strictly better — they solve the same problem differently
    - The audience saw the GraphQL `extensions` pattern in Act 3

GraphQL doesn't win on every axis — choose the right tool for the right problem.

BRIDGE — so what does "before you ship" actually mean in practice? Three areas. -->
