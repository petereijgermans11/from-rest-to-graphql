# DJ Console UI

Angular 21 **zoneless** app (signals + Apollo Client) for the Spring GraphQL DJ demo: queries and mutations over HTTP, subscriptions over **graphql-ws** (proxied to the API).

## Prerequisites

1. PostgreSQL and the Spring Boot API on **port 8080** (see repo root `CLAUDE.md` or `../dj-console-api`).
2. From this folder:

```bash
cd dj-console-ui

npm install
npm run start:all
```

`proxy.conf.js` forwards **HTTP** `/graphql` to `http://localhost:8080`. **WebSocket** subscriptions use **graphql-ws**: on `localhost` the client opens `ws://localhost:8080/graphql` (direct to the API); with **ngrok**, see *ngrok & WebSocket* below. Ensure the API listens on **8080** and `spring.graphql.cors` in `dj-console-api` allows your origins (incl. `*.ngrok-free.app`). Open `http://localhost:4200/`.

### ngrok & WebSocket (live vote bars)

On **HTTPS** via a **single** tunnel to **port 4200**, browser **`wss://…/graphql`** often does **not** survive the chain ngrok → Vite → HTTP proxy upgrade, so **`crowdVoteTallyUpdated`** never delivers and the bars look frozen even though `castCrowdVote` works.

Use **one ngrok agent** with **two HTTP endpoints** (UI → **4200**, API → **8080**). Work **in `dj-console-ui/`**:

```bash
brew install ngrok/ngrok/ngrok
sudo xattr -rd com.apple.quarantine /opt/homebrew/bin/ngrok

# Get token at: https://dashboard.ngrok.com/signup
ngrok config add-authtoken YOUR_TOKEN

# daarna, na API op :8080 en npm run start:public op :4200:

cd dj-console-ui
npm run ngrok
```

Als ngrok klaagt over `version: "2"`, gebruik `npm run ngrok:v3` (leest `ngrok-dj-demo.v3.yml.example`). Zie [ngrok agent config](https://ngrok.com/docs/agent/config/).

De app leest **beide** HTTPS-URL’s via `/ngrok-api/tunnels`: **QR’s** → tunnel naar **:4200**; **GraphQL WebSocket** → **`wss://`-host van de :8080-tunnel** + `/graphql` (dus niet dezelfde host als de UI).

If you only tunnel **:4200**, open the **DJ console** at **`http://localhost:4200`** (not the ngrok URL) so subscriptions use `ws://…:8080`, or add the **:8080** tunnel as above.

## Who runs what, where (full app + optional voting)

| Role | Machine | What to run / open |
|------|---------|-------------------|
| **You (DJ / speaker)** | Your laptop | PostgreSQL, API **8080**, Angular **`npm run start:public`** op **4200**, ngrok twee tunnels. DJ-console: **`http://localhost:4200/`** of de **HTTPS-URL van de UI-tunnel**; subscriptions gebruiken automatisch de **aparte API-tunnel** (`wss://…/graphql`). |
| **Audience** | Their phones | Nothing to install. Scan QR codes that open `https://YOUR-NGROK-HOST/vote?slot=0` (or `slot=1` / `slot=2`) in the browser. Each scan counts one vote. |
| **ngrok** | Your laptop | Prefer **two HTTP tunnels** in one agent (**4200** = UI, **8080** = API) so WebSocket subscriptions work; see *ngrok & WebSocket*. |

**Order (do this every time before a demo):**

1. **PostgreSQL** running (e.g. Docker on `localhost:5432`, DB `djconsole` — see repo root `CLAUDE.md`).
2. **API:** from `dj-console-api/`: `mvn spring-boot:run` (wait until it listens on **8080**).
3. **Angular:** from `dj-console-ui/`: `npm install` once, then either:
   - **Local only (no phones):** `ng serve` → open `http://localhost:4200/`.
   - **With phones / QR voting:** `npm run start:public` (of `ng serve --host 0.0.0.0`) so the tunnel can hit your machine.  
     **`angular.json`** sets **`allowedHosts: true`** so Vite requests met **`Host: *.ngrok-free.app`** accepteert.
4. **ngrok** (alleen met QR): eenmalig `ngrok config add-authtoken …`, daarna `npm run ngrok`. Gebruik niet twee losse `ngrok http`-aanroepen (die ruzie maken om poort **4040**).
5. The DJ console **auto-detects** both HTTPS URLs from **`/ngrok-api/tunnels`** and builds QR links (**:4200**) plus **`wss://…/graphql`** (**:8080**).
6. **You** can open the DJ console at **`http://localhost:4200/`** or the **ngrok UI URL** (`:4200`) once the **:8080** tunnel exists so subscriptions can connect to Spring directly.

**Crowd vote bars:** updates come from **`Subscription.crowdVoteTallyUpdated`** only (WebSocket). The initial `voteTally` query still loads the first frame; after that, live counts rely on the subscription.

**During the demo:** audience scans → bars on your DJ screen update live → you press **Play winner in 10s** → after the countdown the API plays the winning track (via `applyCrowdVoteWinner`).

**Tie-break:** equal highest vote count → **lowest slot** (`0` before `1` before `2`). **No votes** when pressing the winner action → GraphQL error (expected).

## Crowd Vote Live (technical summary)

In-memory voting: `castCrowdVote`, `voteTally`, `Subscription.crowdVoteTallyUpdated`. The DJ console shows live bars; **Play winner in 10s** runs `applyCrowdVoteWinner` (server calls `requestFromAudience` with the configured track title for the winning slot, then resets tallies).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 21.x.

## Development server

```bash
ng serve
```

The app reloads when you change source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


---

### Updates

```text
I have fetched sources from git upstream. 
Using the presentation-architect and the spring-graphql-expert sub-agent, check the latest sources vs the presentation if and where the presenation should be updated

```
