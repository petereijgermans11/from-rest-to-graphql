<!-- .slide: data-background-image="theme/background-images/01-title-background.jpg" data-background-size="cover" data-background-opacity="0.20" -->
# Watch This

## It's live — right now

<div class="fragment fade-in" data-fragment-index="1" style="margin-top:0; padding-top:1.6em; text-align:center;">
  <a href="http://localhost:4200/" target="_blank"
     style="display:inline-block; padding:0.6em 2em; border-radius:14px;
            background:rgba(65,195,157,0.22); border:2px solid #41c39d;
            color:#41c39d; font-size:1.25em; font-weight:700;
            text-decoration:none; letter-spacing:0.05em;
            box-shadow:0 0 28px rgba(65,195,157,0.55), 0 0 8px rgba(65,195,157,0.3);
            animation:pulse-glow 2s ease-in-out infinite;">
    🎧 &nbsp; localhost:4200
  </a>
</div>

<div class="fragment fade-in" data-fragment-index="2" style="margin-top:0; padding-top:1.6em; border-top:1px solid rgba(255,255,255,0.12);">

## It's powered - by GraphQL

<div style="width:74%; max-width:640px; margin:0.7em auto 0; opacity:0.92;">
  <img src="diagram-assets/spring-graphql/context-mini-act1.svg" alt="Act 1 context map" style="width:100%; height:auto;" />
</div>

</div>

<style>
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 28px rgba(65,195,157,0.55), 0 0 8px rgba(65,195,157,0.3); }
  50%       { box-shadow: 0 0 44px rgba(65,195,157,0.85), 0 0 18px rgba(65,195,157,0.5); }
}
</style>

## Speaker notes
<!-- The context diagram shows the system at a high level:

- Frontend (Angular + Apollo) is the client.
- Spring GraphQL backend is the single API entry point.
- The backend is driven by:
  - the GraphQL Schema (contract),
  - Resolvers (mapping operations to code),
  - Service/Repository/DB (business logic + persistence).

How data flows:

- Frontend sends queries/mutations to /graphql over HTTP.
- Frontend receives subscriptions as live updates over GraphQL WebSocket.
- Backend resolves requests using schema + resolvers, then reads/writes domain data.

In short:

- UI asks for exactly what it needs,
- backend enforces one typed contract,
- and live updates keep screens in sync. -->
