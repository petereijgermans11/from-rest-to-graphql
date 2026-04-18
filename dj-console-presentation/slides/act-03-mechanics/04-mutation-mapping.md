<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Mutation Mapping

Same annotation pattern — return type follows the schema, not a convention.

```java
// Returns MixSession — domain event applied
@MutationMapping
public MixSession crowdCheered(@Argument UUID id) {
    return mixSessionService.applyCrowdCheered(id);
}

// ... crowdEnergyDropped, dancefloorEmptied, dancefloorFilledUp follow the same pattern

// Returns MixSession — audience request resolved via domain
@MutationMapping
public MixSession requestFromAudience(@Argument UUID id, @Argument String trackName) {
    return mixSessionService.applyRequestFromAudience(id, trackName);
}

// Returns VoteTally — different schema type, same mapping pattern
@MutationMapping
public VoteTally castCrowdVote(@Argument UUID id, @Argument int slot) {
    return crowdVoteService.castVote(id, slot); // publish happens inside service
}
```

<div style="margin-top:1em;"><div style="display:flex; justify-content:center; gap:0.7em;">
  <button onclick="(function(btn){ navigator.clipboard.writeText('mutation CrowdCheered {\n  crowdCheered(id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;) {\n    id\n    status\n    tracks { song { title artist { name } } energyLevel }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='📋 crowdCheered';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">📋 &nbsp;crowdCheered</button>
  <button onclick="(function(btn){ navigator.clipboard.writeText('mutation RequestFromAudience {\n  requestFromAudience(\n    id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;\n    trackName: &quot;Neon Requiem&quot;\n  ) {\n    id\n    status\n    tracks(last: 1) { song { title artist { name } } energyLevel }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='📋 requestFromAudience';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">📋 &nbsp;requestFromAudience</button>
  <button onclick="(function(btn){ navigator.clipboard.writeText('mutation CastCrowdVote {\n  castCrowdVote(id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;, slot: 0) {\n    sessionId\n    totalVotes\n    choices { slot label votes }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='📋 castCrowdVote';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">📋 &nbsp;castCrowdVote</button>
</div><div style="text-align:center; margin-top:0.6em;">
  <a href="http://localhost:8080/graphiql" target="_blank" style="display:inline-block; padding:0.45em 1.4em; border-radius:14px; background:rgba(65,195,157,0.15); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; text-decoration:none; letter-spacing:0.05em; box-shadow:0 0 22px rgba(65,195,157,0.4), 0 0 6px rgba(65,195,157,0.2); animation:pulse-glow 2s ease-in-out infinite;">🔍 &nbsp; DEMO with GraphiQL</a>
</div></div>

## Speaker notes
<!-- DELIVERY CUE — show one line per mutation first: method name is still the wiring contract.

- Mapping rule stays the same
  - Method name = schema mutation field name
  - `@Argument` binding model is identical to queries

- Key design point: return type is schema-driven
  - `crowdCheered` → `MixSession` — domain event mutates session state
  - `castCrowdVote` → `VoteTally` — votes are in-memory, not domain events
  - Same annotation, different return types — the schema decides, not the controller

- Controller is intentionally thin (Hexagonal architecture)
  - Zero orchestration logic in the controller — all in the service
  - Session validation and publish all happen inside `CrowdVoteService.castVote()`
  - `applyCrowdVoteWinner` is one line: `crowdVoteService.applyCrowdVoteWinner(id)`

- Full crowd-event mutation family
  - `crowdCheered`, `crowdEnergyDropped`, `dancefloorEmptied`, `dancefloorFilledUp`, `requestFromAudience`
  - `castCrowdVote`, `resetCrowdVote`, `applyCrowdVoteWinner` (applies winning vote as request)

- GraphiQL demo — one mutation per return type
  - 📋 `crowdCheered` → returns `MixSession` — run it, point at `status` changing
  - 📋 `requestFromAudience` → returns `MixSession` — adds "Neon Requiem" to the setlist
  - 📋 `castCrowdVote` → returns `VoteTally` — different return type, same annotation pattern
  - "Same `@MutationMapping`, three different return types — the schema decides, not the controller"

BRIDGE — next we trace how nested fields are resolved from the updated aggregate. -->
