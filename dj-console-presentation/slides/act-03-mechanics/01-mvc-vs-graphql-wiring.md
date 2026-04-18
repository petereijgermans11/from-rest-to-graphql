<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Spring MVC vs Spring GraphQL — Wiring

One new entry point.

Routing, resolution, and shape follow from it.

| | Spring MVC | Spring GraphQL |
|---|---|---|
| Entry point | `@RestController` + `@GetMapping` | `@Controller` + `@QueryMapping` |
| Routing | URL + HTTP method | Schema field name → method name |
| Field resolution | Controller returns full object | `@SchemaMapping` — per field, lazily |
| Client shape | Server-fixed | Selection set — ask only what you need |
| Server shape | New endpoint or query param | Schema argument — `tracks(last: Int)` |

## Speaker notes
<!-- DELIVERY CUE — "You already know Spring MVC. The annotations look almost identical. One thing changed underneath." Point at the entry point row first.

- Row by row (spend ~8 seconds each)
  - Entry point: `@Controller` + `@QueryMapping` instead of `@RestController` + `@GetMapping` — that's the visible delta
    - Under the hood: `ExecutionGraphQlService` replaced `DispatcherServlet`; you never implement it
  - Routing: no URL, no HTTP method — method name IS the schema field name; typo fails the schema check at startup
  - Field resolution: `@SchemaMapping` — each field gets its own resolver, called only when the client asks for it
    - MVC: the controller returns the full object, you decide what's in it
    - GraphQL: the engine builds a field execution plan; `@SchemaMapping tracks()` is only invoked if the client asked for `tracks`
  - Client shape: the selection set is the filter — same method, different callers, different shapes
  - Server shape: `tracks(last: Int)` — a typed schema argument controls how much the server returns
    - No new endpoint, no query param — just a parameter in the schema and `@Argument Integer last` in the resolver
    - This is different from the selection set: the client controls *which fields*, the argument controls *how many items*

- The connection to Act 1
  - "Per field, lazily" → the mechanism behind the REST Tax slide's over-fetching
  - "Selection set" → the mechanism behind the Same Field slide's two queries
  - `tracks(last: Int)` → the mechanism behind the UI showing only the latest track without a dedicated endpoint

BRIDGE — here's what that engine layer looks like in the actual request chain. -->

