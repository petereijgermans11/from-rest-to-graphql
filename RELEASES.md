# Releases

## Unreleased

### Bug Fixes

- **[#2](https://github.com/fbascheper/spring-io-2026-from-rest-to-graphql/issues/2)**
  `NullPointerException` on first `crowdCheered` mutation — `DiscJockey.trackLibrary`
  was `null` because `MixSessionSmartLoader` deserialised `DiscJockey` from session JSON
  without resolving the personal track library. Fixed by introducing
  `DiscJockeySmartLoader` (phase 15) and `DiscJockeyRegistry`.

- **[#3](https://github.com/fbascheper/spring-io-2026-from-rest-to-graphql/issues/3)**
  `Jackson parse from String failed` on second `crowdCheered` mutation — `CrowdEvent`
  sealed interface had no type discriminator, so the JSONB round-trip lost the concrete
  subtype. Fixed by adding `@JsonTypeInfo` / `@JsonSubTypes` to `CrowdEvent`.

### Documentation

- Added `CLAUDE.md` AI developer guide covering build commands, architecture overview,
  TDD policy, conventional commits, and release process.
- Added `infrastructure/README.md`, `service/README.md`, `domain/library/README.md`,
  `domain/event/README.md`, `domain/session/README.md` with architecture notes.
- Added JavaDoc to port interfaces (`MusicLibraryLookup`, `MixSessionRepository`,
  `MixSessionService`) and key domain types (`EnergyLevel`, `CrowdEvent` and subtypes).

### Other

- Removed stale `FINISHED` value from `MixSessionStatus` GraphQL enum (no corresponding
  Java constant).
- Added missing `@SchemaMapping id(SessionTrack)` resolver — `SessionTrack.id` was
  returning `null` before this fix.
