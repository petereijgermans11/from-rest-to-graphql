<!-- .slide: data-background-image="theme/background-images/01-title-background.jpg" data-background-size="cover" data-background-opacity="0.20" -->
# Angular + Apollo in one call

```ts
const sessionId$ = this.apollo
  .query<{ currentMixSession: AudienceSession }>({
    query: AUDIENCE_SESSION,
    fetchPolicy: 'no-cache',
  })
```

## Speaker notes
<!-- Keep this card short (15–20 seconds): concept → real client code.

- Why this snippet matters
  - It proves the previous slide is not theoretical: a second client really asks a lighter shape from the same field.
  - The query returns the active session and gives us `id` for follow-up subscriptions.


- Delivery
  - Point at `AUDIENCE_SESSION` and `fetchPolicy: 'no-cache'` only.
  - Do not explain RxJS here; this is a bridge from query documents to client runtime wiring.

BRIDGE — now lock the contract in SDL. -->
