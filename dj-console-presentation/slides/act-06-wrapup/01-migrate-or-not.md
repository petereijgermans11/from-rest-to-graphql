<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Should I Migrate?

| Question | Lean REST | Lean GraphQL |
|---|---|---|
| How many consumers? | One or two, known | Many, different needs |
| Response shape? | Stable, server-owned | Client-driven, varies |
| HTTP caching needed? | Yes — CDN, ETags | Harder — single endpoint |
| Schema governance? | Not ready | Team can own a contract |
| Team experience? | REST-native | Willing to invest |

## Speaker notes
<!-- Use this as a decision framework — don't sell GraphQL, help the audience decide.

- The disqualifier
  - HTTP caching: one POST endpoint, no URL-based cache keys, no CDN out of the box
  - If you need HTTP caching, REST wins — full stop

- The sweet spot for GraphQL
  - Many consumers with different needs → BFF pattern (next slide)
  - Schema governance: team must own the contract — deprecation discipline, breaking-change policy

- The honest question to leave with the audience
  - "Which column does MY project land in?"

Schema governance is real cost — if the team isn't ready to own the schema as a product, the migration will hurt.

BRIDGE — here's the full picture: both sides, honestly. -->
