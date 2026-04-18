<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# The Full Chain

Controller → domain event → persist → publish → subscriber Flux ticks. GraphQL just carries the result.

```java
// 1. Controller — thin delivery: name matches schema field, zero logic
@MutationMapping
public MixSession requestFromAudience(@Argument UUID id, @Argument String trackName) {
    return mixSessionService.applyRequestFromAudience(id, trackName);
}

// 2. Service — "mistake" event applied, persisted, then pushed via output port
public MixSession applyRequestFromAudience(UUID id, String trackName) {
    var updated = getSessionById(id)
                    .applyEvent(new RequestFromAudienceReceived(trackName, LocalDateTime.now()));
    var saved   = repository.save(updated);                             // persisted
    mixSessionUpdatePort.publish(saved);                                // output port call
    return saved;
}

// 2b. Service — recovery button, same chain, separate intent name
public MixSession applyRecovery(UUID id) {
    var updated = getSessionById(id)
                    .applyEvent(new RecoverMusic(LocalDateTime.now()));
    var saved   = repository.save(updated);
    mixSessionUpdatePort.publish(saved);
    return saved;
}

// 3. Publisher (GraphQL layer implements the port)
public void publish(MixSession session) {
    sink.tryEmitNext(session);   // → every active subscription Flux receives the update
}
// sink = Sinks.many().multicast().onBackpressureBuffer()
// subscribers filter by session id: sink.asFlux().filter(s -> s.id().value().equals(id))
```

## Speaker notes
<!-- DELIVERY CUE — walk the three layers top to bottom. Point at each numbered comment.

- Layer 1: Controller (same pattern as act-03 — now you see WHY it stays thin)
  - Two lines. Name is the contract. All logic is elsewhere.

- Layer 2: Service (the domain engine)
  - `applyRequestFromAudience` = the "mistake" move from the audience
  - `applyRecovery` = explicit comeback move from the DJ
  - Both methods run the same chain: apply event → save → publish
  - `mixSessionUpdatePort.publish(saved)` — calls an OUTPUT PORT interface
    - Service depends on an interface; GraphQL layer provides the implementation
    - ArchUnit rule enforces this: service package must not import graphql package

- Layer 3: Publisher (the subscription wire-up)
  - Single shared `Sinks.many().multicast().onBackpressureBuffer()` — one sink for all sessions
  - Subscribers filter by session id: `sink.asFlux().filter(s -> s.id().value().equals(id))`
  - `tryEmitNext` fires the Reactor sink
  - HTTP mutation caller gets `saved` back; WebSocket subscribers get the same object pushed

This is the moment where all three operation types — query, mutation, subscription — converge on one audience-to-recovery flow.

BRIDGE — next, the audience decides the winner directly via Crowd Vote Live. -->

