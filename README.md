
This repository contains a **conference demo for Spring I/O 2026** illustrating
migration from REST to GraphQL using a DJ Console domain.

The repository is a **multi-module project**:

- `dj-console-api/` — Java 25, Spring Boot 4, Spring GraphQL backend (WAR on embedded Tomcat, backed by PostgreSQL)
- `dj-console-ui/` — Angular **21** frontend

Claude Code must respect strict separation between backend and frontend concerns.

## Backend (dj-console-api)
- Java 25
- Spring Boot 4 + Spring GraphQL
- PostgreSQL 18 with JSONB persistence
- Domain-Driven Design (DDD)
- **Test-Driven Development (TDD) is mandatory**

## Frontend (dj-console-ui)
- Angular 21 application consuming the GraphQL API
- The frontend must never drive backend architecture or domain modeling

## Key Commands

### Backend
- Reset DB: `./scripts/reset-djconsole-postgres.sh`
- Build: `cd dj-console-api && mvn clean package`
- Test: `cd dj-console-api && mvn test`
- Run: `cd dj-console-api && mvn spring-boot:run`

### Frontend
- `cd dj-console-ui`
- Install dependencies: `npm install`
- Run application: `npm run start:all`
- Expose backend via ngrok: `npm run ngrok`

## Runtime Notes
- PostgreSQL must be running before starting the backend
- Schema is auto-created via `spring.jpa.hibernate.ddl-auto: create` on startup; seed data is reloaded from `src/main/resources/seed/` on every restart
- GraphiQL is available at http://localhost:8080/graphiql
- For Docker-specific reset (optional), see `dj-console-api/README-pgsql.md` and `scripts/reset-djconsole-postgres.sh`

Start PostgreSQL locally with Docker:
```shell
docker run --name dj-console-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=djconsole \
  -p 5432:5432 \
  -d postgres:18
```

Run a single test class:
```shell
cd dj-console-api && mvn test -Dtest=DiscJockeyConsoleGraphQLControllerTests
```

Run PIT mutation tests:
```shell
cd dj-console-api && mvn -P pitest verify
```

Install ngrok (required for mobile device demos):
```shell
brew install ngrok/ngrok/ngrok
ngrok config add-authtoken YOUR_TOKEN
# Get token at: https://dashboard.ngrok.com/signup
```

## Workflow Conventions

### Commit Messages
This project uses **[Conventional Commits](https://www.conventionalcommits.org/)**.

Format: `<type>[(scope)]: <description>`

Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

Examples:
```
feat(session): add DanceEvent aggregate root
fix(event): add @JsonTypeInfo to CrowdEvent to survive JSONB round-trip
docs(bootstrap): update seed loading phase table
test(service): add regression test for crowdCheered NPE
```

- Bug-fix commits must reference the GitHub issue in the footer: `Closes #<n>`
- Breaking changes must include `BREAKING CHANGE:` in the footer.

### Branch Names
Branch names follow a convention inspired by **Conventional Branch** (mirrors Conventional Commits) combined with GitHub issue references, similar to the style used by the Spring Framework project (`issues/GH-NNNNN`).

Format: `<type>/GH-<issue-number>-<kebab-case-description>`

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Tests only, no production code |
| `refactor` | Refactoring, no behaviour change |
| `chore` | Build, tooling, dependency updates |

Examples:
```
fix/GH-2-discjockey-tracklibrary-npe
fix/GH-3-crowdevent-jsonb-deserialization
feat/GH-5-add-dance-event-aggregate
docs/GH-7-architecture-readme
```

- When a branch addresses multiple issues, list the primary one: `fix/GH-2-GH-3-crowdcheered-fixes`
- Branch names must be lowercase kebab-case after the type prefix

### Pull Requests & Issues
- **A GitHub issue must exist before a PR fixing a bug can be created.**
- PR titles must follow the same Conventional Commits format as commit messages.
- Bug-fix PRs must reference the issue in commits, branch name, and the PR body.

### Releases
- Every release is documented in `RELEASES.md` at the repository root.
- Each entry lists: release version, date, and a section per change type (`Bug Fixes`, `Features`, `Documentation`) with description and issue/PR number.
- Update `RELEASES.md` as part of the commit that bumps the version, or as the last commit on a release branch before merging.


