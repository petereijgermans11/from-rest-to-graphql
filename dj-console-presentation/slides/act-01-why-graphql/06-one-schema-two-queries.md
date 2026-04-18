# Same field, two questions

### DJ Console — `CurrentMixSession`

```graphql
query CurrentMixSession {
  currentMixSession {
    id
    status
    tracks {          # all tracks (full setlist)
      id              # track id (selection / audio playback)
      energyLevel
      song {
        title
        audioFile     # local mp3 path
        artist { name }
      }
    }
  }
}
```

<div class="fragment fade-in" data-fragment-index="1">

### Versus — `AudienceSession` (crowd screen)

```graphql
query AudienceSession {
  currentMixSession {
    id
    status
    tracks(last: 1) {  # only the last track
      song {
        title
        artist { name }
      }
      energyLevel
    }                   # no track id, no audioFile
  }
}
```

</div>

## Speaker notes
<!-- DELIVERY CUE — land on the DJ Console query first. Walk through the selection set top to bottom. Then click to reveal the audience query.

- DJ Console query (before click)
  - Full setlist: every track, `id` for deck logic, `audioFile` for playback — the host needs the weight
  - "This client asked for everything it needs — and nothing it doesn't"

- Click — Audience query appears
  - `tracks(last: 1)` — projector / phone only needs the current track; no `id`, no `audioFile`
  - Point at the diff: same root field `currentMixSession`, radically different payload
  - "Same endpoint. Same schema. Two different questions — two different responses."

- Contrast with REST (callback to slide 04)
  - REST: one `GET` shape for every caller — clients pay for fields they don't render
  - GraphQL: each client's document is the filter — server returns exactly what was asked

- Delivery
  - Don't read the `#` comments aloud — let the diff in the selection set speak
  - Pause after the audience query lands — let the audience spot what's missing

BRIDGE — client runtime wiring first, then schema as contract. -->
