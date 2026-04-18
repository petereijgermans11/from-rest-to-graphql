# The DJ Console — Critical User Journey

[DIAGRAM: diagrams/spring-graphql/cuj-flow.mmd]
<div class="diagram-frame diagram-tall">

[IMAGE: diagram-assets/spring-graphql/cuj-flow.svg]

</div>

## Speaker notes
<!--
- Start (Query)
  - The app asks the server for the current DJ session (tracks + status).
  - This loads the screen in one go.

- Stay Live (Subscription)
  - The app opens a live connection.
  - Any change in the session is pushed instantly to the UI (no refresh).

- React (Mutation + Push)
  - A user action happens (for example: audience request or recovery).
  - The server updates the session, saves it, and pushes the new state to everyone watching.

- In one sentence:
  - The console loads once, stays live, and reacts in real time to crowd and DJ actions.
-->

