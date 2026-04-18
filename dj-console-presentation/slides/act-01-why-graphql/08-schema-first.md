<!-- .slide: data-background-image="theme/background-images/01-title-background.jpg" data-background-size="cover" data-background-opacity="0.20" -->
# The Schema IS the Contract

The schema is defined in SDL before any implementation.<br>
The `Query` is the public API surface — explicit, typed, versioned by design.

```graphql
type Query {
    # Convenience: the active/most-recent session (domain decides what "current" means)
    currentMixSession: MixSession!

    # Explicitly load a session by ID (UUID as ID scalar)
    mixSession(id: ID!): MixSession!

    # (... etc ...)
}

enum MixSessionStatus { WARM_UP  PEAK  COOL_DOWN }

type MixSession {
  id: ID!
  status: MixSessionStatus!
  tracks(last: Int): [SessionTrack!]!  # argument on a field, not a new endpoint
}

# (... etc ...)

```

## Speaker notes
<!-- DELIVERY CUE — point at `type Query` first; this is the API surface, not a class, not a controller.

- This IS the contract — not documentation, not a generated artifact
  - Schema ships first; clients code against it before the server is built
  - Changing a field name here is a breaking change — same discipline as a REST endpoint rename

- Things to point at
  - `currentMixSession: MixSession!` — no `id` parameter: the domain decides what "current" means
  - `tracks(last: Int)` — argument on a field, no new endpoint needed
  - `audioFile: String` (no `!`) — nullable; client omits it and the server skips the resolution
  - `!` = non-null guarantee — stronger than a REST OpenAPI description

- What you do NOT see yet
  - `Mutation` and `Subscription` types are intentionally absent here — build anticipation
  - Act 2 shows the full type system (MixSession, Song, Artist)
  - Act 3 wires up mutations and subscriptions with `@MutationMapping` / `@SubscriptionMapping`

The schema is the shared language — everything else follows from it. -->
