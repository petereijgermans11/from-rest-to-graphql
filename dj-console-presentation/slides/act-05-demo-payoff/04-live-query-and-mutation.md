<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Live: Query & Mutation

## GraphQL in action — two operations

### 🔍 Query — ask exactly what you need
```graphql
query CurrentMixSession {
  currentMixSession {
    id
    status
    tracks {
      song { title  artist { name } }
      energyLevel
    }
  }
}
```

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

### ✍️ Mutation — recovery in one command
```graphql
mutation ApplyRecovery($id: ID!) {
  applyRecovery(id: $id) {
    id
    status
    tracks(last: 1) {
      song { title audioFile }
      energyLevel
    }
  }
}
```

</div>

## Speaker notes
<!-- DELIVERY CUE — open GraphiQL; paste and fire the query first. Then click once to reveal the mutation block and execute it.

- Block 1: Query (visible on load)
  - Open GraphiQL, paste and run `currentMixSession`
  - Response mirrors the selection set exactly — no extra fields
  - `status` is WARM_UP — energy is building
  - Copy the `id` from the response — you need it for the mutation
  - Schema also supports `tracks(last: 1)` — mention it, save it for the mutation

- Block 2: Mutation (first click)
  - Paste the `id` into variables, execute once, then execute again without changing the query
  - Use `applyRecovery` here to match the on-stage RECOVERY button flow
  - `tracks(last: 1)` keeps the response focused on the newly queued track
  - `status` and `energyLevel` show domain progression with each call
  - Same pattern also works for other events: `crowdEnergyDropped`, `dancefloorEmptied`, `dancefloorFilledUp`, `requestFromAudience`
  - Client still controls the returned shape per mutation call

BRIDGE — now let the audience drive a vote. -->

