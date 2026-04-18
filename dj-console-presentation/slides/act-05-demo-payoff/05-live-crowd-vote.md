<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Live: Crowd Vote

<div style="text-align:center; margin:0.45em 0 0.8em;">
  <a href="http://localhost:4200/" target="_blank"
     style="display:inline-block; padding:0.42em 1.35em; border-radius:12px;
            background:rgba(65,195,157,0.16); border:2px solid #41c39d;
            color:#41c39d; font-size:0.86em; font-weight:700;
            text-decoration:none; letter-spacing:0.03em;">
    I want Music DJ !
  </a>
</div>

The audience picks the next track — via QR code, live, in the room.

```graphql
# 1. Audience scans QR → vote cast
mutation CastCrowdVote($id: ID!, $slot: Int!) {
  castCrowdVote(id: $id, slot: $slot) {
    totalVotes
    choices { label votes }
  }
}

# 2. Dashboard watches live tally
subscription CrowdVoteLive($id: ID!) {
  crowdVoteTallyUpdated(id: $id) {
    totalVotes
    choices { label votes }
  }
}

# 3. DJ applies the winner → session updates, tally resets
mutation ApplyWinner($id: ID!) {
  applyCrowdVoteWinner(id: $id) {
    tracks(last: 1) { song { title } }
  }
}
```

## Speaker notes
<!-- DELIVERY CUE — open GraphiQL subscription tab first, then invite the audience to scan the QR.

- The flow
  - Three QR codes on screen: slot 0, 1, 2 — each maps to a configured track name
  - Audience scans → `castCrowdVote` fires → `crowdVoteTallyUpdated` subscription pushes live
  - After voting closes: `applyCrowdVoteWinner` resolves highest vote count
    - Internally calls `applyRequestFromAudience` with the winning track name
    - Resets tally + publishes reset — subscription reflects the clear

- `applyCrowdVoteWinner` flow (worth saying aloud)
  - Validates session exists
  - Gets current tally → throws `CrowdVoteNoVotesException` if nobody voted
  - Resolves winning slot (highest count; ties broken by lowest slot)
  - Looks up `trackName` from `CrowdVoteProperties` config → applies `RequestFromAudienceReceived`
  - Resets tally → publishes → returns updated `MixSession`

- What GraphQL makes possible here
  - Mutation + subscription on the same connection — no polling, no webhook
  - Three operations compose without any new endpoint

BRIDGE — the crowd just drove a domain decision through a GraphQL mutation. That's the payoff. -->
