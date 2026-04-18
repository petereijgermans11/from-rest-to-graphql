# DJ Console API

Spring Boot 4 + Spring GraphQL demo for **Spring I/O 2026**.
Talk: _"From REST to GraphQL — Stop REST-ing"_.

## What this demo shows

- How a REST-style multi-call flow (`GET /mixSession`, `GET /tracks`, `GET /artists/{id}`)
  collapses into a single GraphQL query that returns exactly the fields the client needs.
- How domain mutations (crowd events) are expressed as GraphQL mutations
  that trigger DDD aggregate behaviour inside `MixSession`.
- How hexagonal architecture separates the domain model from Spring infrastructure.

## Quick start

See `CLAUDE.md` at the repository root for all build, run, and test commands,
and for the PostgreSQL Docker setup.

## Architecture overview

The high-level architecture is documented in `CLAUDE.md` §Architecture.
Domain model documentation lives alongside the code:

| Package | README |
|---|---|
| `domain/` | [Aggregate root rationale](src/main/java/com/github/fbascheper/dj/console/domain/README.md) |
| `domain/session/` | [MixSession aggregate](src/main/java/com/github/fbascheper/dj/console/domain/session/README.md) |
| `domain/library/` | [Music library reference catalog](src/main/java/com/github/fbascheper/dj/console/domain/library/README.md) |
| `domain/event/` | [Crowd event hierarchy](src/main/java/com/github/fbascheper/dj/console/domain/event/README.md) |
| `infrastructure/` | [Secondary adapters & JSONB persistence](src/main/java/com/github/fbascheper/dj/console/infrastructure/README.md) |
| `service/` | [Application service & exceptions](src/main/java/com/github/fbascheper/dj/console/service/README.md) |

## GraphQL endpoint

- **GraphiQL playground:** `http://localhost:8080/graphiql` (requires the app to be running)
- **Schema:** `src/main/resources/graphql/schema.graphqls`

Example queries to try in the demo:

```graphql
# Fetch the current session with all tracks
query CurrentMixSession {
  currentMixSession {
    id
    status
    tracks {
      id
      energyLevel
      song { title artist { name } }
    }
  }
}

# Fetch only the last track (avoids overfetching)
query CurrentTrack {
  currentMixSession {
    tracks(last: 1) {
      energyLevel
      song { title artist { name } }
    }
  }
}

# Trigger a crowd-cheered event
mutation CrowdCheered($id: ID!) {
  crowdCheered(id: $id) {
    status
    tracks(last: 1) {
      song { title }
      energyLevel
    }
  }
}
```

## Database

See `README-pgsql.md` for PostgreSQL Docker setup, schema/seed behaviour, and optional DB reset.

- **Clean dev state:** with default `ddl-auto: create`, restarting the API recreates tables and reloads seeds.
- **Reset Docker Postgres only:** run `../scripts/reset-djconsole-postgres.sh` from the repo root, then `docker run …` as documented.
