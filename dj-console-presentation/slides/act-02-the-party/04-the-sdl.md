<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The SDL

The domain model maps directly to the schema — types you just saw, now as a contract.

```graphql
type MixSession {
  id: ID!
  status: MixSessionStatus!   # WARM_UP · PEAK · COOL_DOWN
  tracks(last: Int): [SessionTrack!]!
}

type SessionTrack {
  song: Song!
  energyLevel: Int!
}

type Song {
  title: String!
  audioFile: String           # nullable — crowd screen never asks for it
  artist: Artist!
}

type Artist { name: String! }
```

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.4em; border-top:1px solid rgba(255,255,255,0.12);">

### The client declares the shape — the engine resolves it
```graphql
query AudienceSession {
  currentMixSession {        # one request
    status
    tracks(last: 1) {        # only the latest track
      song { title  artist { name } }
      energyLevel
    }                        # no id, no audioFile — client decides
  }
}
```

</div>

## Speaker notes
<!-- DELIVERY CUE — point at the type names first: "You just saw these in the diagrams — now they're the contract." Then click to reveal the query.

- Type system (visible on load)
  - `MixSession`, `SessionTrack`, `Song`, `Artist` — same names, same structure as the diagrams
  - `status` comment inline: WARM_UP · PEAK · COOL_DOWN — no need to read the enum aloud
  - `tracks(last: Int)` — selective by argument, no new endpoint needed
  - `audioFile: String` (no `!`) — nullable; the comment says why: crowd screen never requests it

- Fragment: the client query (first click)
  - This is the audience/crowd screen query — NOT the DJ console query shown in Act 1
  - The client declares only what it needs: no `id`, no `audioFile` — not declared, not returned
  - The execution engine resolves `MixSession → SessionTrack → Song → Artist` server-side, in one HTTP request
  - "Client declares the shape" is the inversion of control made concrete: the consumer drives, not the server
  - Contrast with REST: no fat endpoint, no four round-trips — the type system made this possible

- What you do NOT see here (intentional)
  - `Query`, `Mutation`, `Subscription` root types are absent — this slide is the type system only
  - The full SDL with all three operation roots arrives in Act 3 when we wire up the controllers

BRIDGE — now let's wire it up in Spring GraphQL. -->
