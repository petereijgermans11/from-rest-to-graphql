<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Real-Time Server Push

Mutation fires → domain state changes → all subscribers receive the update. No polling.

### 📡 Controller — subscribe to `MixSession` updates
```java
@SubscriptionMapping
public Flux<MixSession> mixSessionUpdated(@Argument UUID id) {
    return Flux.concat(
        Mono.fromCallable(() -> mixSessionService.getSessionById(id)), // snapshot
        mixSessionUpdatePublisher.streamForSession(id));               // live stream
}
```

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

### ⚙️ Service — mutation produces the same `MixSession`
```java
@Transactional
public MixSession applyCrowdCheered(UUID id) {
    return applyAndPublish(id, new CrowdCheered(LocalDateTime.now()));
}

private MixSession applyAndPublish(UUID id, CrowdEvent event) {
    var session = getSessionById(id);
    var updated = session.applyEvent(event);
    var saved   = repository.save(updated);
    mixSessionUpdatePublisher.publish(saved); // → Sinks → mixSessionUpdated Flux ticks
    return saved;
}
```
<div style="margin-bottom:0.8em;"><div style="display:flex; justify-content:center; gap:0.7em; margin-bottom:0.5em;">
  <button onclick="(function(btn){ navigator.clipboard.writeText('subscription MixSessionUpdated {\n  mixSessionUpdated(id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;) {\n    id\n    status\n    tracks(last: 1) { song { title artist { name } } energyLevel }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='① 📡 Subscribe: mixSessionUpdated';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">① 📡 &nbsp;Subscribe: mixSessionUpdated</button>
  <button onclick="(function(btn){ navigator.clipboard.writeText('mutation CrowdCheered {\n  crowdCheered(id: &quot;91af9cac-ce3a-55a9-85bf-a051d84d4a0d&quot;) {\n    id\n    status\n    tracks(last: 1) { song { title artist { name } } energyLevel }\n  }\n}'); btn.textContent='✅ Copied!'; setTimeout(function(){btn.textContent='② 🔥 Trigger: crowdCheered';},2000); })(this)" style="padding:0.45em 1.1em; border-radius:14px; background:rgba(65,195,157,0.08); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; cursor:pointer;">② 🔥 &nbsp;Trigger: crowdCheered</button>
</div><div style="text-align:center;">
  <a href="http://localhost:8080/graphiql" target="_blank" style="display:inline-block; padding:0.45em 1.4em; border-radius:14px; background:rgba(65,195,157,0.15); border:2px solid #41c39d; color:#41c39d; font-size:0.95em; font-weight:700; text-decoration:none; letter-spacing:0.05em; box-shadow:0 0 22px rgba(65,195,157,0.4), 0 0 6px rgba(65,195,157,0.2); animation:pulse-glow 2s ease-in-out infinite;">🔍 &nbsp; DEMO with GraphiQL</a>
</div></div>
</div>


## Speaker notes
<!-- DELIVERY CUE — walk the code first, then run the demo. "The diagram showed the chain. Here's the annotation that wires it up."

- Block 1 — the controller (visible on load)
  - `@SubscriptionMapping` returns `Flux<MixSession>` — WebSocket lifecycle handled by the framework
  - `Flux.concat(snapshot, liveStream)` — subscriber gets current state immediately on connect, then live updates
  - `mixSessionUpdatePublisher.streamForSession(id)` — controller delegates; no Reactor `Sinks` in the controller

- Block 2 — the service (click 1)
  - `applyCrowdCheered` — one line delegates to `applyAndPublish`
  - `applyAndPublish`: load → apply domain event → save → `publish(saved)` — the last call is the trigger
  - `publish(saved)` pushes a `MixSession` — the exact same type `mixSessionUpdated` streams back to the client
  - `mixSessionUpdatePublisher` is typed as `MixSessionUpdatePort` — service never imports GraphQL

- Live demo (after walking both code blocks)
  - ① Copy `mixSessionUpdated` → open GraphiQL → paste → run → subscription sits open, snapshot arrives
  - ② Copy `crowdCheered` → paste in a new GraphiQL operation tab → run → subscription tab receives a live push
  - Say: "No polling. The mutation fired — every subscriber received the update."

- Two subscriptions in this app (don't demo both here)
  - `mixSessionUpdated` — used here; live session state after each crowd event
  - `crowdVoteTallyUpdated` — saved for Act 5's live crowd vote demo

- Transport reminder (if asked)
  - Queries + mutations: HTTP POST `/graphql`; subscriptions: WebSocket (`graphql-ws` sub-protocol)
  - `graphql-ws` is the community standard — replaces the deprecated `subscriptions-transport-ws`

BRIDGE — that's the full push chain wired and live; let's take stock of the whole backend stack. -->

