<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Recap — What We Just Wired

## The Spring GraphQL backend stack — end to end

### 📐 The contract
- **Schema-first** — SDL in `src/main/resources/graphql/` is the contract; Java follows
- **`@QueryMapping` / `@MutationMapping`** — method name binds to schema field; zero routing config

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

### ⚙️ The internals
- **`@SchemaMapping`** — nested field resolvers load child data only when the client asks for it
- **`DataFetcherExceptionResolverAdapter`** — typed errors surfaced in `errors[]`, HTTP stays 200
- **`@GraphQlTest` + ArchUnit** — slice test covers schema + wiring

</div>

<div class="fragment fade-in" data-fragment-index="2" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

### 📡 The push layer
- **`@SubscriptionMapping` + `Flux`** — `Flux.concat(snapshot, liveStream)` over WebSocket
- Service calls `MixSessionUpdatePort.publish()` — the service never imports a GraphQL class

</div>

## Speaker notes
<!-- DELIVERY CUE — pause briefly: "Let's take stock before we cross to the frontend. Three groups — two clicks."

- Group 1 — The contract (visible on open)
  - SDL is the source of truth; the Java follows it, not the other way round
  - `@QueryMapping` / `@MutationMapping` — method name IS the schema field name; convention does all the wiring

- Group 2 — The internals (click 1)
  - `@SchemaMapping` is only invoked when the client selection set includes that field — lazy by design
  - `DataFetcherExceptionResolverAdapter`: extend + `@Component` — typed error goes into `errors[]`; HTTP stays 200; partial data is valid
  - `@GraphQlTest` is the GraphQL equivalent of `@WebMvcTest` — schema + controller + exception resolvers, no DB
  - ArchUnit enforces the layering: service must not import `..graphql..` or `..infrastructure..`

- Group 3 — The push layer (click 2)
  - `@SubscriptionMapping` returns `Flux<T>` — `Flux.concat(snapshot, liveStream)` over WebSocket
  - `MixSessionUpdatePort.publish()` — the interface attendees saw called on slide 8; service never imports GraphQL
  - The publisher (GraphQL layer) implements the port; swapping transport means changing only the publisher

BRIDGE — the backend is wired; now let's see what the frontend does with it. -->

