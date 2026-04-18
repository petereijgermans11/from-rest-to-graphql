<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Subscriptions in Production

| Win | Watch out | Solution |
|-----|-----------|----------|
| No polling — server pushes on state change | WebSocket is stateful — sticky sessions required | Sticky LB *or* Redis/Kafka fan-out per node |
| `Flux.concat` snapshot on connect | Auth headers unavailable after handshake | Pass token via `graphql-ws` `connectionParams` |
| Same type across query/mutation/subscription | Client must handle reconnect & re-subscribe | `graphql-ws` retries automatically; snapshot re-delivered |
| `graphql-ws` sub-protocol — broad client support | In-memory `Sinks` — single-node only | Kafka/Redis broker + per-node fan-out for multi-pod |
| Reactive backpressure with Reactor `Flux` | Traces don't span WebSocket frames | Micrometer WebSocket metrics; structured logging per session |

## Speaker notes
<!-- DELIVERY CUE — tell the audience this is the slide most teams skip, and they should not.

- The wins (brief — demo proves them)
  - No polling: eliminates stale reads and unnecessary load
  - Single schema contract: `VoteTally` used in Query, Mutation, Subscription — no duplication
  - `graphql-ws` is the community standard; broad support (Apollo, urql, native)

- The real costs + solutions (spend time here)
  - Load balancer: persistent connection needs sticky sessions OR a distributed broker (Redis/Kafka)
  - Auth: Authorization header only available at WebSocket handshake — use `connectionParams` payload validated server-side
  - Scaling: in-memory `Sinks` is fine for one node; multi-pod needs pub/sub broker — standard reactive architecture
  - Observability: WebSocket frames are not HTTP requests — instrument with Micrometer + structured session logging

BRIDGE — production concerns are real, but they all come back to one question: is GraphQL the right tool for your problem? -->

