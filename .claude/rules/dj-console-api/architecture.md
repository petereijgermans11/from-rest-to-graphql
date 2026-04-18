
# Backend Architecture Rules (dj-console-api)

These rules apply exclusively to backend code under `dj-console-api/`.

## Architecture Style
- The backend follows **Domain-Driven Design** and **Hexagonal Architecture**
- Dependency direction: controller → service → domain; infrastructure implements domain ports

## Layers
- `domain/` — pure domain model, no Spring or persistence dependencies
  - `domain/session/` — `MixSession` aggregate root, `SessionTrack`, `DiscJockey`, `EnergyLevel`, `DanceEvent`, `MixSessionRepository` (port)
  - `domain/library/` — `MusicLibrary`, `Artist`, `Song`, `Track`, `CuePoint`, `MusicLibraryLookup` (port)
  - `domain/event/` — sealed `CrowdEvent` hierarchy: `CrowdCheered`, `CrowdEnergyDropped`, `DancefloorEmptied`, `DancefloorFilledUp`, `RequestFromAudienceReceived`
  - `domain/util/` — `ValidatingBuilder`
- `service/` — application services, orchestration, transactions (`MixSessionService`, `CrowdVoteService`)
- `infrastructure/` — JPA repositories, database access (`MixSessionRepositoryImpl`, `MusicLibraryLookupImpl`)
- `controller/` — Spring GraphQL controllers and resolvers (`DiscJockeyConsoleGraphQLController`, `GraphQLExceptionResolver`)
- `graphql/` — subscription publishers (`MixSessionUpdatePublisher`, `CrowdVoteTallyPublisher`) and GraphQL DTOs (`graphql/dto/`: `VoteTally`, `VoteChoice`); part of the controller layer
- `config/` — `@ConfigurationProperties` classes (e.g. `CrowdVoteProperties`)
- `exception/` — exception hierarchy (`DJConsoleException`, `MixSessionException`, `ModelValidationException`, `ErrorCode`, and domain-specific subclasses)
- `bootstrap/` — seed data loaders (`MusicLibrarySmartLoader` phase 10, `MixSessionSmartLoader` phase 20, `DiscJockeySmartLoader`), `DiscJockeyRegistry`, and `CustomJacksonJsonFormatMapper`; phase ordering matters — session loader depends on library being loaded first

## Aggregates
- `MixSession` is the aggregate root
- All state changes go through aggregate methods
- No aggregate references another aggregate by object reference
- `DanceEvent` in `domain/session/` captures dancefloor state transitions alongside `CrowdEvent`
- `MixSessionRepository` is the domain port (interface); implemented by `MixSessionRepositoryImpl` in `infrastructure/`

## Key Design Decisions
- `MixSession` is stored as a single JSONB column (`mix_sessions.session`) via Hibernate's `@JdbcTypeCode(SqlTypes.JSON)` — the entire aggregate is serialized/deserialized as JSON with no relational joins
- `MusicLibraryEntity` is similarly stored as JSONB
- **Jackson 3** (`tools.jackson.*`) is used — not Jackson 2 (`com.fasterxml.jackson`). `CustomJacksonJsonFormatMapper` bridges Jackson 3 + Hibernate 7 for JSONB. Do not mix Jackson 2 and 3 APIs.
- JSONB deserialization is lenient (`FAIL_ON_UNKNOWN_PROPERTIES` disabled) to handle legacy rows gracefully when new fields are added
- Domain objects are Java records using Lombok `@Builder` with `ValidatingBuilder` that auto-generates IDs when not provided
- `MixSession.applyEvent()` delegates to `DiscJockey.decideNextTrack()`, which uses a Java 25 pattern-matching switch on sealed `CrowdEvent` types:
  - `CrowdCheered` / `DancefloorFilledUp` → next track at average energy
  - `CrowdEnergyDropped` → next track at next-higher energy
  - `DancefloorEmptied` → next track at highest energy
  - `RequestFromAudienceReceived` → lookup by title, fallback to average energy
- `MixSession.status` is derived: `WARM_UP` (< 5 tracks), `PEAK` (average energy HIGH), `COOL_DOWN` (fallback)
- `currentMixSession` uses a "last in list" policy — see `MixSessionRepositoryImpl.findCurrent()` (has a FIXME)
- **Vote tally is in-memory only** (`ConcurrentHashMap<UUID, AtomicIntegerArray>`, 3 slots) — tallies are lost on restart and are never persisted
- Subscription publishers use `Sinks.many().multicast().onBackpressureBuffer()` (hot multicast); the controller prepends a `Mono.fromCallable` snapshot so subscribers always receive the current state first

## Persistence
- Aggregates are stored as JSONB columns
- Hibernate `@JdbcTypeCode(SqlTypes.JSON)` is mandatory
- No relational joins inside aggregates

## Events
- `CrowdEvent` is a sealed hierarchy
- Event handling uses Java 25 pattern matching
- Event application logic lives inside the aggregate

## GraphQL Schema
Defined in `dj-console-api/src/main/resources/graphql/schema.graphqls` — treat that file as the source of truth. Do not maintain a duplicate listing here.
