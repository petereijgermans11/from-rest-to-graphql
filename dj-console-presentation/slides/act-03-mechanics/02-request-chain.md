<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The Request Chain

🌐 Query & mutation over **HTTP POST (`/graphql`)**

[DIAGRAM: diagrams/spring-graphql/request-flow-http.mmd]
<div class="diagram-frame diagram-tall">

[IMAGE: diagram-assets/spring-graphql/request-flow-http.svg]

</div>

## Speaker notes
<!-- DELIVERY CUE — walk the chain left to right; connect each box back to the comparison table just shown.

- Execution chain (point at each box)
  - Client POSTs → `ExecutionGraphQlService` — "that's the entry-point row from the previous slide"
  - Engine dispatches to `@QueryMapping` / `@MutationMapping` by field name — "the routing row"
  - `@SchemaMapping` resolves nested fields only when asked — "the lazy field resolution row"
  - Service layer does domain work; controller just delivers — "everything below here is pure Java"

- Key insight
  - No GraphQL imports below the controller line — ArchUnit enforces this
  - Swapping transports (HTTP → WebSocket → SSE) only changes the entry side; service is untouched

- What this diagram does NOT show
  - Subscriptions travel over WebSocket (`graphql-ws`) — different transport, different chain
  - Slides 08–09 cover that path in full; don't get ahead of it here

BRIDGE — each annotation maps to a box in this chain; next slides show the code behind each one. -->
