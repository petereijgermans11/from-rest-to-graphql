<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The BFF Strategy

[DIAGRAM: diagrams/architecture/bff-strategy.mmd]
<div class="diagram-frame diagram-tall">

[IMAGE: diagram-assets/architecture/bff-strategy.svg]

</div>

- One GraphQL layer, three clients, three different query shapes — zero new endpoints

## Speaker notes
<!-- Walk the diagram top to bottom — three clients, one endpoint, three query shapes.

- The pattern
  - Web needs full session data; Mobile needs just status; Dashboard tracks energy levels
  - In REST: three tailored endpoints or one bloated one
  - Here: one `/graphql` endpoint, client selects the shape

- What this means in practice
  - GraphQL BFF routes each field to the right service
  - Clients are decoupled from backend service boundaries
  - Services behind the BFF can still be REST — GraphQL doesn't replace backend contracts

This is exactly the pattern in the demo: one controller, one schema, multiple query shapes. -->
