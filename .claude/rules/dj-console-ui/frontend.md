
# Frontend Rules (dj-console-ui)

These rules apply only to the Angular frontend.

## Angular Version
- Angular **21** is required

## Application Structure
The frontend is a **Module Federation (Native Federation)** workspace with three apps:

| App | Port | Purpose |
|---|---|---|
| `dj-console-ui` (shell) | default | Main DJ console and audience screen |
| `mfe-crowd-vote` | separate | QR crowd voting micro-frontend |
| `mfe-spotlight` | separate | GraphQL client spotlight micro-frontend |

- `npm run start:all` runs all three concurrently (required for full functionality)
- Module Federation is provided by `@angular-architects/native-federation`

## GraphQL Client
- Uses **Apollo Angular** (`apollo-angular` + `@apollo/client`) for queries and mutations
- Uses **`graphql-ws`** for subscription transport over WebSocket
- All GQL operation definitions are centralized in `src/app/graphql/operations.ts`
- Treat the backend schema as the single source of truth
- Do not suggest schema changes unless explicitly requested

## Responsibilities
- The frontend consumes the GraphQL API
- No backend business or domain logic is duplicated
- The frontend must never drive backend architecture or domain modeling

## Architecture
- Use services for GraphQL communication
- Keep components declarative and thin
- MFE apps share GraphQL provider configuration from the shell where applicable
- Use Angular **signals** and `computed()` for reactive UI state — not RxJS subjects in components
- Use `takeUntilDestroyed()` for subscription lifecycle management in components

## Routing (shell app)
- `/` → `DjConsoleComponent` (main DJ console)
- `/vote` → `CrowdVotePageComponent` (audience voting screen)
- `**` → redirects to root

## GraphQL Client Configuration
- `graphql.provider.ts` routes WebSocket connections intelligently:
  - **localhost/127.0.0.1**: connects directly to `ws://host:8080/graphql` (bypasses Vite proxy, which does not reliably upgrade WebSocket)
  - **ngrok**: resolves the API tunnel URL from `NgrokPublicUrlService`, converts `https://...` to `wss://.../graphql`
  - **Fallback**: same-origin `/graphql`
- `graphql-ws` is deliberately **excluded from Native Federation shared dependencies** so each MFE controls its own subscription transport independently

## Testing
- Test runner is **Vitest** (not Karma/Jasmine)

## Tooling
- **Prettier** is used for code formatting
- QR code generation uses the `qrcode` library (in `mfe-crowd-vote`)
