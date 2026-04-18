<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Query Mapping

A schema `Query` field maps to a method — name matches by convention.

```java
@Controller
public class DiscJockeyConsoleGraphQLController {

    @QueryMapping
    public MixSession currentMixSession() {
        return mixSessionService.getCurrentSession();
    }

    @QueryMapping
    public MixSession mixSession(@Argument UUID id) {
        return mixSessionService.getSessionById(id);
    }

    @QueryMapping
    public VoteTally voteTally(@Argument UUID id) {
        mixSessionService.getSessionById(id); // validates session exists
        return crowdVoteService.getTally(id);
    }
}
```

<div style="margin-top:1em;"><div style="display:flex; justify-content:center; gap:0.7em;">
  <button onclick="(function(btn){ navigator.clipboard.writeText('query CurrentMixSession {\n  currentMixSession {\n    status\n    tracks {\n      song { title\n        artist { name }\n      }\n    }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='📋 currentMixSession';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">📋 &nbsp;currentMixSession</button>
  <button onclick="(function(btn){ navigator.clipboard.writeText('query MixSession {\n  mixSession(id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;) {\n    id\n    status\n    tracks {\n      song { title\n        artist { name }\n      }\n      energyLevel\n    }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='📋 mixSession(id)';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">📋 &nbsp;mixSession(id)</button>
  <button onclick="(function(btn){ navigator.clipboard.writeText('query VoteTally {\n  voteTally(id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;) {\n    sessionId\n    totalVotes\n    choices { slot label votes }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='📋 voteTally(id)';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">📋 &nbsp;voteTally(id)</button>
</div><div style="text-align:center; margin-top:0.6em;">
  <a href="http://localhost:8080/graphiql" target="_blank" style="display:inline-block; padding:0.45em 1.4em; border-radius:14px; background:rgba(65,195,157,0.15); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; text-decoration:none; letter-spacing:0.05em; box-shadow:0 0 22px rgba(65,195,157,0.4), 0 0 6px rgba(65,195,157,0.2); animation:pulse-glow 2s ease-in-out infinite;">🔍 &nbsp; DEMO with GraphiQL</a>
</div></div>

## Speaker notes
<!-- DELIVERY CUE — point at `@QueryMapping` on the first method: "That annotation is the entire routing config."

- @QueryMapping
  - Binds by method name — no routing, no path, no request mapping
  - Method name IS the schema field name

- @Argument
  - Binds a GraphQL argument to a Java parameter via `DataBinder`
  - Type coercion is automatic — `String → UUID` works out of the box

- Return type is schema-driven
  - `MixSession` is a domain record — nested fields resolved via `@SchemaMapping` (next slide)
  - `VoteTally` is a plain DTO record — no nested `@SchemaMapping` needed

- `voteTally` design point
  - Two services collaborate: `MixSessionService` validates the session exists, `CrowdVoteService` owns the tally
  - Tally is in-memory (`ConcurrentHashMap`) — not persisted, resets on restart

- GraphiQL demo — open first, then use the copy buttons one at a time
  - Click "🔍 Open GraphiQL", then come back to the slide for each copy button
  - 📋 `currentMixSession` — minimal selection set; point at response: "No audioFile, not asked for — not returned"
    - Then add `audioFile` manually in GraphiQL and re-run — it appears; selection set is the filter
  - 📋 `mixSession(id)` — same type, explicit UUID; same shape, explicit load
  - 📋 `voteTally(id)` — different return type (`VoteTally`), different resolver, same annotation pattern
  - Seeded session ID used in both: `91af9cac-ce3a-55a9-85bf-a051d84d4a0d`

BRIDGE — queries fetch data; next, mutations change it — same annotation, different schema operation. -->


