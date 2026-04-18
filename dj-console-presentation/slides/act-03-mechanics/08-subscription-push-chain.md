<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The Push Chain

📡 `publish(session)` → `MixSessionUpdatePublisher` → `Flux` filtered per session → WebSocket client

[DIAGRAM: diagrams/spring-graphql/request-flow-subscription.mmd]
<div class="diagram-frame diagram-tall">

[IMAGE: diagram-assets/spring-graphql/request-flow-subscription.svg]

</div>

## Speaker notes
<!-- DELIVERY CUE — connect this to the mutation slides just shown: "The mutation returned a result. Now watch what happens on the side."

- The push chain
  - Service calls `publish(session)` on `MixSessionUpdatePort` — an interface, not a GraphQL class
  - `MixSessionUpdatePublisher` implements the port; it holds a `Sinks.many().multicast().onBackpressureBuffer()`
  - `sink.tryEmitNext(session)` fans out to every subscriber Flux filtered by session id
  - Each subscriber receives the same `MixSession` shape they originally queried

- Why an output port?
  - Service layer never imports `..graphql..` — ArchUnit rule enforces this
  - The GraphQL layer is a plug-in, not a dependency of the domain
  - Swapping the transport (e.g. SSE) means changing only the publisher, not the service

- Two subscriptions in this app
  - `mixSessionUpdated(id)` — live session state after each crowd event
  - `crowdVoteTallyUpdated(id)` — live vote counts as the audience scans QR codes

BRIDGE — now let's see the controller annotation that wires this up, and run it live. -->

